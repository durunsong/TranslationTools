import axios from "axios";
import { config, logger } from "@/config/env";
import PerformanceMonitor from "@/utils/performance";

const createErrorWithCause = (message: string, cause: unknown) => {
  const error = new Error(message) as Error & { cause?: unknown };
  error.cause = cause;
  return error;
};

export interface TranslationProxyResponse {
  success: boolean;
  data?: {
    from: string;
    to: string;
    result: string;
    trans_result: Array<{
      src: string;
      dst: string;
    }>;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface TranslationParams {
  query: string;
  from: string;
  to: string;
  appid: string;
  apiKey: string;
}

export class TranslationService {
  private static readonly PROXY_API_URL = config.api.proxyApiUrl;

  private static buildRequestData(
    params: TranslationParams
  ): Record<string, string> {
    return {
      query: params.query,
      from: params.from,
      to: params.to,
      appid: params.appid,
      apiKey: params.apiKey,
    };
  }

  static async translate(params: TranslationParams): Promise<string> {
    return PerformanceMonitor.measure("translation-request", async () => {
      try {
        const requestData = this.buildRequestData(params);

        logger.debug("Sending translation request:", {
          from: params.from,
          to: params.to,
          queryLength: params.query.length,
        });

        const response = await axios.post<TranslationProxyResponse>(
          this.PROXY_API_URL,
          requestData,
          {
            timeout: config.api.timeout,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;

        if (!data.success || data.error) {
          const errorMessage = data.error?.message ?? "Translation request failed";
          logger.error("Translation proxy error:", {
            code: data.error?.code,
            message: errorMessage,
          });
          throw new Error(errorMessage);
        }

        if (!data.data?.result) {
          logger.error("Translation result is empty:", data);
          throw new Error("Translation result is empty");
        }

        logger.debug("Translation completed:", {
          resultLength: data.data.result.length,
        });
        return data.data.result;
      } catch (error: unknown) {
        logger.error("Translation request failed:", error);

        if (axios.isAxiosError(error)) {
          if (error.code === "ECONNABORTED") {
            throw createErrorWithCause(
              "Request timed out, please try again later",
              error
            );
          }

          if (error.response?.status === 429) {
            throw createErrorWithCause(
              "Too many requests, please try again later",
              error
            );
          }

          const apiMessage = error.response?.data?.error?.message;
          if (typeof apiMessage === "string" && apiMessage.trim()) {
            throw createErrorWithCause(apiMessage, error);
          }
        }

        const message =
          error instanceof Error && error.message
            ? error.message
            : "Network request failed";
        throw createErrorWithCause(message, error);
      }
    });
  }

  static validateParams(
    params: Partial<TranslationParams>
  ): { isValid: boolean; message?: string } {
    if (!params.appid || !params.apiKey) {
      return { isValid: false, message: "Please configure App ID and API Key first" };
    }

    if (!params.query || !params.query.trim()) {
      return { isValid: false, message: "Please enter text to translate" };
    }

    if (params.query.length > config.limits.maxTextLength) {
      return {
        isValid: false,
        message: `Please keep the text within ${config.limits.maxTextLength} characters`,
      };
    }

    if (!params.from || !params.to) {
      return { isValid: false, message: "Please select both source and target languages" };
    }

    return { isValid: true };
  }
}

export default TranslationService;
