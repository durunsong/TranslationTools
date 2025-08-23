import axios from 'axios';
import { config, logger } from '@/config/env';
import PerformanceMonitor from '@/utils/performance';

/**
 * 代理服务器响应接口
 */
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

/**
 * 翻译请求参数接口
 */
export interface TranslationParams {
  query: string;
  from: string;
  to: string;
  appid: string;
  apiKey: string;
}

/**
 * 翻译服务类
 * 封装翻译代理服务调用逻辑
 */
export class TranslationService {
  private static readonly PROXY_API_URL = config.api.proxyApiUrl;
  
  /**
   * 构建请求数据
   * @param params 翻译参数
   * @returns 请求数据对象
   */
  private static buildRequestData(params: TranslationParams): Record<string, string> {
    return {
      query: params.query,
      from: params.from,
      to: params.to,
      appid: params.appid,
      apiKey: params.apiKey,
    };
  }

  /**
   * 执行翻译请求
   * @param params 翻译参数
   * @returns Promise<string> 翻译结果
   */
  static async translate(params: TranslationParams): Promise<string> {
    return PerformanceMonitor.measure('translation-request', async () => {
      try {
        const requestData = this.buildRequestData(params);
        
        logger.debug('发起翻译请求:', { from: params.from, to: params.to, queryLength: params.query.length });
        
        const response = await axios.post<TranslationProxyResponse>(
          this.PROXY_API_URL,
          requestData,
          {
            timeout: config.api.timeout,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = response.data;

        // 检查代理服务返回的错误
        if (!data.success || data.error) {
          const errorMessage = data.error?.message || '翻译请求失败';
          logger.error('翻译代理服务错误:', { 
            code: data.error?.code, 
            message: errorMessage 
          });
          throw new Error(errorMessage);
        }

        // 检查翻译结果
        if (!data.data?.result) {
          logger.error('翻译结果为空:', data);
          throw new Error('翻译结果为空');
        }

        logger.debug('翻译成功:', { resultLength: data.data.result.length });
        return data.data.result;

      } catch (error: any) {
        logger.error('翻译请求失败:', error);
        
        // 处理不同类型的错误
        if (error.code === 'ECONNABORTED') {
          throw new Error('请求超时，请稍后重试');
        }
        
        if (error.response?.status === 429) {
          throw new Error('请求过于频繁，请稍后重试');
        }
        
        if (error.response?.data?.error?.message) {
          throw new Error(error.response.data.error.message);
        }
        
        throw new Error(error.message || '网络请求失败');
      }
    });
  }



  /**
   * 验证翻译参数
   * @param params 翻译参数
   * @returns 验证结果
   */
  static validateParams(params: Partial<TranslationParams>): { isValid: boolean; message?: string } {
    if (!params.appid || !params.apiKey) {
      return { isValid: false, message: '请先配置 APP ID 和 API Key' };
    }

    if (!params.query || !params.query.trim()) {
      return { isValid: false, message: '请输入需要翻译的内容' };
    }

    if (params.query.length > config.limits.maxTextLength) {
      return { isValid: false, message: `翻译内容过长，请控制在${config.limits.maxTextLength}字符以内` };
    }

    if (!params.from || !params.to) {
      return { isValid: false, message: '请选择源语言和目标语言' };
    }

    return { isValid: true };
  }
}

export default TranslationService;
