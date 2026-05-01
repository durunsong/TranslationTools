import React, { useState } from "react";
import { App, Button, Typography, Input, Space } from "antd";
import { EyeOutlined, CopyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import axios from "axios";
import LanguageSelect from "./LanguageSelect";
import ShowFileModel from "./ShowFileModel";
import ExampleFormatModal from "./ExampleFormatModal";
import { TextTranslationProps } from "@/types/textTranslation";
import { useTranslationLoading } from "@/hooks/useTranslationLoading";
import { config } from "@/config/env";
import { getExampleFormats } from "@/constants/exampleFormats";
import { shouldSubmitOnEnter } from "@/utils/submitOnEnter";

const { TextArea } = Input;
const { Paragraph, Title } = Typography;

type PHPScalarValue = string | number | boolean;
type PHPArrayValue = PHPScalarValue | PHPArrayObject;
interface PHPArrayObject {
  [key: string]: PHPArrayValue;
}

interface PHPParseResult {
  keys: string[];
  values: string[];
  structure: {
    parsed: PHPArrayObject;
  };
}

interface TranslationChunkApiResponse {
  success: boolean;
  data?: {
    trans_result?: Array<{
      src: string;
      dst: string;
    }>;
  };
  error?: {
    message?: string;
  };
}

const createErrorWithCause = (message: string, cause: unknown) => {
  const error = new Error(message) as Error & { cause?: unknown };
  error.cause = cause;
  return error;
};

class PHPArrayParser {
  static parsePHPArray(phpContent: string): PHPParseResult {
    const keys: string[] = [];
    const values: string[] = [];
    const structure: PHPParseResult["structure"] = { parsed: {} };

    const content = phpContent
      .replace(/<\?php/g, "")
      .replace(/\?>/g, "")
      .replace(/return\s+/g, "")
      .replace(/;?\s*$/, "")
      .trim();

    const collectValues = (value: PHPArrayObject, prefix = "") => {
      Object.entries(value).forEach(([key, childValue]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof childValue === "string") {
          keys.push(fullKey);
          values.push(childValue);
          return;
        }

        if (childValue && typeof childValue === "object") {
          collectValues(childValue, fullKey);
        }
      });
    };

    try {
      const parsed = this.parsePhpArrayString(content);
      structure.parsed = parsed;
      collectValues(parsed);
    } catch (error) {
      console.error("PHP array parsing failed:", error);
      throw createErrorWithCause("Invalid PHP array format", error);
    }

    return { keys, values, structure };
  }

  private static parsePhpArrayString(phpArrayString: string): PHPArrayObject {
    try {
      let content = phpArrayString
        .replace(/<\?php/g, "")
        .replace(/\?>/g, "")
        .replace(/return\s+/g, "")
        .replace(/;?\s*$/, "")
        .trim();

      if (content.startsWith("[") && content.endsWith("]")) {
        content = content.slice(1, -1);
      }

      return this.parseArrayContent(content);
    } catch (error) {
      console.error("PHP parsing error:", error);
      throw createErrorWithCause("Unable to parse the PHP array syntax", error);
    }
  }

  private static parseArrayContent(content: string): PHPArrayObject {
    const result: PHPArrayObject = {};
    let index = 0;

    while (index < content.length) {
      index = this.skipWhitespaceAndComments(content, index);
      if (index >= content.length) {
        break;
      }

      const keyResult = this.parseKey(content, index);
      if (!keyResult) {
        break;
      }

      index = keyResult.endIndex;
      index = this.skipWhitespaceAndComments(content, index);

      if (content.slice(index, index + 2) === "=>") {
        index += 2;
        index = this.skipWhitespaceAndComments(content, index);
      }

      const valueResult = this.parseValue(content, index);
      if (!valueResult) {
        break;
      }

      result[keyResult.key] = valueResult.value;
      index = valueResult.endIndex;
      index = this.skipWhitespaceAndComments(content, index);

      if (content[index] === ",") {
        index += 1;
      }
    }

    return result;
  }

  private static skipWhitespaceAndComments(content: string, index: number) {
    let cursor = index;

    while (cursor < content.length) {
      if (/\s/.test(content[cursor])) {
        cursor += 1;
        continue;
      }

      if (content.slice(cursor, cursor + 2) === "//") {
        while (cursor < content.length && content[cursor] !== "\n") {
          cursor += 1;
        }
        continue;
      }

      if (content.slice(cursor, cursor + 2) === "/*") {
        cursor += 2;
        while (cursor < content.length - 1) {
          if (content.slice(cursor, cursor + 2) === "*/") {
            cursor += 2;
            break;
          }
          cursor += 1;
        }
        continue;
      }

      break;
    }

    return cursor;
  }

  private static parseKey(
    content: string,
    index: number
  ): { key: string; endIndex: number } | null {
    const char = content[index];

    if (char === '"' || char === "'") {
      const quote = char;
      let cursor = index + 1;
      let key = "";

      while (cursor < content.length && content[cursor] !== quote) {
        if (content[cursor] === "\\") {
          cursor += 1;
        }

        if (cursor < content.length) {
          key += content[cursor];
          cursor += 1;
        }
      }

      if (content[cursor] === quote) {
        cursor += 1;
      }

      return { key, endIndex: cursor };
    }

    let cursor = index;
    let key = "";
    while (cursor < content.length && /[a-zA-Z0-9_]/.test(content[cursor])) {
      key += content[cursor];
      cursor += 1;
    }

    return key ? { key, endIndex: cursor } : null;
  }

  private static parseValue(
    content: string,
    index: number
  ): { value: PHPArrayValue; endIndex: number } | null {
    const char = content[index];

    if (char === '"' || char === "'") {
      const quote = char;
      let cursor = index + 1;
      let value = "";

      while (cursor < content.length && content[cursor] !== quote) {
        if (content[cursor] === "\\") {
          cursor += 1;
        }

        if (cursor < content.length) {
          value += content[cursor];
          cursor += 1;
        }
      }

      if (content[cursor] === quote) {
        cursor += 1;
      }

      return { value, endIndex: cursor };
    }

    if (char === "[") {
      let cursor = index + 1;
      let depth = 1;
      let nestedContent = "";

      while (cursor < content.length && depth > 0) {
        if (content[cursor] === "[") {
          depth += 1;
        } else if (content[cursor] === "]") {
          depth -= 1;
        }

        if (depth > 0) {
          nestedContent += content[cursor];
        }
        cursor += 1;
      }

      return {
        value: this.parseArrayContent(nestedContent),
        endIndex: cursor,
      };
    }

    let cursor = index;
    let rawValue = "";
    while (
      cursor < content.length &&
      content[cursor] !== "," &&
      content[cursor] !== "]" &&
      content[cursor] !== "\n"
    ) {
      rawValue += content[cursor];
      cursor += 1;
    }

    const value = rawValue.trim();
    if (/^\d+$/.test(value)) {
      return { value: Number.parseInt(value, 10), endIndex: cursor };
    }

    if (value === "true") {
      return { value: true, endIndex: cursor };
    }

    if (value === "false") {
      return { value: false, endIndex: cursor };
    }

    return { value, endIndex: cursor };
  }

  private static escapePhpString(value: string) {
    return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }

  static buildPHPArray(
    structure: PHPParseResult["structure"],
    translations: Record<string, string>
  ) {
    const buildLevel = (value: PHPArrayObject, prefix = "", indent = 1): string => {
      const indentStr = "    ".repeat(indent);
      const items: string[] = [];

      Object.entries(value).forEach(([key, childValue]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (childValue && typeof childValue === "object") {
          const nestedContent = buildLevel(childValue, fullKey, indent + 1);
          items.push(`${indentStr}'${key}' => [\n${nestedContent}\n${indentStr}]`);
          return;
        }

        if (typeof childValue === "string") {
          const translatedValue = translations[fullKey] ?? childValue;
          items.push(
            `${indentStr}'${key}' => '${this.escapePhpString(translatedValue)}'`
          );
          return;
        }

        items.push(`${indentStr}'${key}' => ${String(childValue)}`);
      });

      return items.join(",\n");
    };

    const content = buildLevel(structure.parsed);
    return `<?php\nreturn [\n${content}\n];\n?>`;
  }
}

const PHPTranslationComponent: React.FC<TextTranslationProps> = ({
  appid,
  apiKey,
}) => {
  const [fromLang, setFromLang] = useState("auto");
  const [toLang, setToLang] = useState("zh");
  const [textData, setTextData] = useState("");
  const [transResult, setTransResult] = useState<string | null>(null);
  const { isLoading, startLoading, stopLoading } = useTranslationLoading();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const [selectedSuffix, setSelectedSuffix] = useState("php");

  const exampleFormats = getExampleFormats();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const detectInputFormat = (input: string): "php" | "json" => {
    const trimmed = input.trim();
    if (
      trimmed.includes("<?php") ||
      trimmed.includes("return [") ||
      trimmed.includes("=>")
    ) {
      return "php";
    }
    return "json";
  };

  const handleSuffixConfirm = (suffix: string) => {
    setSelectedSuffix(suffix);
    void handleTranslate(true, suffix);
  };

  const handleCopyResult = async () => {
    if (!transResult) {
      message.warning({
        content: t("translation.noResultToCopy", "No translation result to copy"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(transResult);
      message.success({
        content: t("translation.copySuccess"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = transResult;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        message.success({
          content: t("translation.copySuccess"),
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      } catch {
        message.error({
          content: t("translation.copyError"),
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const translateChunk = async (query: string) => {
    const response = await axios.post<TranslationChunkApiResponse>(
      config.api.proxyApiUrl,
      {
        query,
        from: fromLang,
        to: toLang,
        appid,
        apiKey,
      },
      {
        timeout: config.api.timeout,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (!data.success || data.error) {
      throw new Error(data.error?.message ?? "Translation request failed");
    }

    if (!data.data?.trans_result) {
      throw new Error("Translation result is empty");
    }

    return { trans_result: data.data.trans_result };
  };

  const downloadTranslation = (data: string, suffix?: string) => {
    if (!suffix) {
      message.error({
        content: t("fileModal.selectFileFormat", "Please select a file format"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    const filename = `${toLang}_translation.${suffix}`;
    const blob = new Blob([data], {
      type: suffix === "php" ? "application/x-php" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleTranslate = async (isDownload = false, suffix?: string) => {
    if (!appid || !apiKey) {
      message.error({
        content: t("translation.pleaseInputCredentials"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    if (!textData.trim()) {
      message.error({
        content: t("translation.fileError", "Please enter valid PHP content"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    try {
      startLoading();

      const { keys, values, structure } = PHPArrayParser.parsePHPArray(textData);
      if (values.length === 0) {
        message.warning({
          content: t(
            "translation.fileError",
            "No translatable text was found in the PHP array"
          ),
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
        return;
      }

      const chunks: string[] = [];
      const chunkSize = 10;
      for (let index = 0; index < values.length; index += chunkSize) {
        chunks.push(values.slice(index, index + chunkSize).join("\n"));
      }

      const results: Array<{ trans_result: Array<{ dst: string }> }> = [];
      for (let index = 0; index < chunks.length; index += 1) {
        if (index > 0) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        results.push(await translateChunk(chunks[index]));
      }

      const translatedValues = results.flatMap((result) =>
        result.trans_result.map((entry) => entry.dst)
      );

      const translations: Record<string, string> = {};
      keys.forEach((key, index) => {
        translations[key] = translatedValues[index] ?? values[index];
      });

      const detectedFormat = detectInputFormat(textData);
      const output =
        detectedFormat === "php"
          ? PHPArrayParser.buildPHPArray(structure, translations)
          : JSON.stringify(translations, null, 2);

      setSelectedSuffix(detectedFormat === "php" ? "php" : "json");
      setTransResult(output);

      if (isDownload) {
        downloadTranslation(
          output,
          suffix ?? (detectedFormat === "php" ? "php" : "json")
        );
      }

      message.success({
        content: t("translation.phpTranslateSuccess", {
          count: translatedValues.length,
        }),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } catch (error) {
      const content =
        error instanceof Error
          ? error.message
          : t("translation.phpTranslateFailed");
      message.error({
        content,
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      console.error("PHP translation error:", error);
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <Title level={5} className="mt-2">
        {t("translation.selectLanguageAndInputPHP")}
      </Title>
      <Space wrap>
        <LanguageSelect
          value={fromLang}
          onChange={setFromLang}
          showAutoDetect={true}
          label="Source"
        />
        <LanguageSelect
          showAutoDetect={false}
          value={toLang}
          onChange={setToLang}
          label="Target"
        />
      </Space>

      <div className="mt-4 mb-2 flex items-center justify-between md:justify-start md:gap-[40px]">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t("translation.dontKnowHowToInput")}
        </span>
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setIsExampleModalOpen(true)}
          className="text-blue-500 hover:text-blue-600"
        >
          {t("translation.viewExample")}
        </Button>
      </div>

      <ExampleFormatModal
        open={isExampleModalOpen}
        onCancel={() => setIsExampleModalOpen(false)}
        title={exampleFormats.php.title}
        description={exampleFormats.php.description}
        example={exampleFormats.php.example}
        mode="php"
      />

      <ShowFileModel
        open={isModalOpen}
        onCancel={closeModal}
        onSuffixSelect={handleSuffixConfirm}
        toLang={toLang}
        defaultSuffix={detectInputFormat(textData) === "php" ? "php" : "json"}
        defaultExport="No"
      />

      <TextArea
        allowClear
        value={textData}
        onChange={(event) => setTextData(event.target.value)}
        onKeyDown={(event) => {
          if (!shouldSubmitOnEnter(event)) {
            return;
          }

          event.preventDefault();
          if (!isLoading) {
            void handleTranslate(false);
          }
        }}
        placeholder={exampleFormats.php.placeholder}
        autoSize={{ minRows: 8, maxRows: 15 }}
        className="mt-4"
        showCount
        maxLength={20000}
      />
      <div className="mt-1 flex justify-start">
        <span className="select-none text-xs text-gray-400 dark:text-gray-500">
          {t(
            "translation.keyboardHint",
            "Enter to submit, Shift + Enter for a new line"
          )}
        </span>
      </div>

      <Space>
        <Button
          type="primary"
          onClick={() => void handleTranslate(false)}
          className="mt-4"
          loading={isLoading}
        >
          {isLoading
            ? t("translation.translating")
            : t("translation.directTranslate")}
        </Button>
        <Button
          type="primary"
          onClick={openModal}
          className="mt-4"
          loading={isLoading}
        >
          {isLoading
            ? t("translation.translating")
            : `${t("translation.translateAndDownload")} ${toLang}.${selectedSuffix}`}
        </Button>
      </Space>

      {isLoading && !transResult && (
        <div className="mt-4 text-center">
          <div className="text-lg">{t("translation.translatingPHP")}</div>
        </div>
      )}

      {transResult && (
        <>
          <div className="mt-4 flex items-center justify-between">
            <Title level={5} className="mb-0">
              {t("translation.translationResultWithFormat", {
                format: detectInputFormat(textData).toUpperCase(),
              })}
            </Title>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={handleCopyResult}
              className="flex items-center text-blue-500 hover:text-blue-600"
              size="small"
            >
              {t("translation.copyResult")}
            </Button>
          </div>
          <Paragraph
            copyable
            className="mt-4 whitespace-pre-wrap rounded p-4 font-mono text-sm"
            style={{
              backgroundColor: document.documentElement.classList.contains("dark")
                ? "#1f1f1f"
                : "#f5f5f5",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {transResult}
          </Paragraph>
        </>
      )}
    </>
  );
};

const TranslatePHP: React.FC<TextTranslationProps> = ({ appid, apiKey }) => (
  <App>
    <PHPTranslationComponent appid={appid} apiKey={apiKey} />
  </App>
);

export default TranslatePHP;
