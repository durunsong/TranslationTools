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

type FlatJsonTranslation = Record<string, string>;

const LanguageSelectOptions: React.FC<TextTranslationProps> = ({
  appid,
  apiKey,
}) => {
  const [fromLang, setFromLang] = useState("auto");
  const [toLang, setToLang] = useState("zh");
  const [textData, setTextData] = useState("");
  const [transResult, setTransResult] = useState<FlatJsonTranslation | null>(null);
  const { isLoading, startLoading, stopLoading } = useTranslationLoading();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const [selectedSuffix, setSelectedSuffix] = useState("");

  const exampleFormats = getExampleFormats();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSuffixConfirm = (suffix: string, exportType: string) => {
    setSelectedSuffix(suffix);
    void handleTranslate(true, suffix, exportType);
  };

  const stringifyResult = (result: FlatJsonTranslation) =>
    JSON.stringify(result, null, 2);

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

    const resultText = stringifyResult(transResult);

    try {
      await navigator.clipboard.writeText(resultText);
      message.success({
        content: t("translation.copySuccess"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = resultText;
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

  const normalizeJsonInput = (input: string) => {
    let formattedText = input.replace(/,(\s*[}\]])/g, "$1");
    formattedText = formattedText.replace(/;/g, "");
    formattedText = formattedText.replace(
      /([{,]\s*)(["']?)(\w+)\2(\s*:\s*)/g,
      '$1"$3"$4'
    );
    formattedText = formattedText.replace(/:\s*'([^']*)'/g, ': "$1"');
    formattedText = formattedText.replace(
      /:\s*([a-zA-Z0-9_\s]+)(\s*[,}])/g,
      ': "$1"$2'
    );
    return formattedText;
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

  const downloadTranslation = (
    data: FlatJsonTranslation,
    suffix?: string,
    exportType?: string
  ) => {
    if (!suffix) {
      message.error({
        content: t("fileModal.selectFileFormat", "Please select a file format"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    const filename = `${toLang}.${suffix}`;
    const jsonContent = JSON.stringify(data, null, 2);
    const content =
      exportType === "Yes"
        ? `const ${toLang} = ${jsonContent};\n\nexport default ${toLang};\n`
        : jsonContent;

    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleTranslate = async (
    isDownload: boolean,
    suffix?: string,
    exportType?: string
  ) => {
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
        content: t("translation.fileError", "Please enter valid JSON content"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    let data: Record<string, string>;

    try {
      const parsed = JSON.parse(normalizeJsonInput(textData)) as unknown;
      if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
        throw new Error("Invalid JSON object");
      }

      data = Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>).map(([key, value]) => [
          key,
          String(value ?? ""),
        ])
      );
    } catch {
      message.error({
        content: t(
          "translation.fileError",
          "The input is not a valid JSON object"
        ),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    const keys = Object.keys(data);
    const values = Object.values(data);
    const chunks: string[] = [];
    const chunkSize = 10;

    for (let index = 0; index < values.length; index += chunkSize) {
      chunks.push(values.slice(index, index + chunkSize).join("\n"));
    }

    startLoading();

    try {
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

      const translation = keys.reduce<FlatJsonTranslation>((accumulator, key, index) => {
        accumulator[key] = translatedValues[index] ?? "";
        return accumulator;
      }, {});

      setTransResult(translation);

      message.success({
        content: t("translation.simpleJSONTranslateSuccess", {
          count: translatedValues.length,
        }),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });

      if (isDownload) {
        downloadTranslation(translation, suffix, exportType);
      }
    } catch (error) {
      message.error({
        content: t("translation.simpleJSONTranslateFailed"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <Title level={5} className="mt-2">
        {t("translation.selectLanguageAndInputJSON")}
      </Title>
      <Space>
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

      <div className="mt-4 mb-2 flex items-center justify-between">
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
        title={exampleFormats.simpleJSON.title}
        description={exampleFormats.simpleJSON.description}
        example={exampleFormats.simpleJSON.example}
        mode="simpleJSON"
      />

      <ShowFileModel
        open={isModalOpen}
        onCancel={closeModal}
        onSuffixSelect={handleSuffixConfirm}
        toLang={toLang}
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
        placeholder={exampleFormats.simpleJSON.placeholder}
        autoSize={{ minRows: 6, maxRows: 10 }}
        className="mt-4"
        showCount
        maxLength={10000}
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
          className="mt-4 ml-4"
          loading={isLoading}
        >
          {isLoading
            ? t("translation.translating")
            : `${t("translation.translateAndDownload")} ${toLang}.${selectedSuffix || "js"}`}
        </Button>
      </Space>

      {isLoading && !transResult && (
        <div className="mt-4 text-center">
          <div className="text-lg">
            {t("translation.translatingSimpleJSON")}
          </div>
        </div>
      )}

      {transResult && (
        <>
          <div className="mt-4 flex items-center justify-between">
            <Title level={5} className="mb-0">
              {t("translation.translationResult")}
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
          <Paragraph copyable className="mt-4 whitespace-pre-wrap rounded p-4 font-mono">
            {stringifyResult(transResult)}
          </Paragraph>
        </>
      )}
    </>
  );
};

const TranslateSimplerJSON: React.FC<TextTranslationProps> = ({
  appid,
  apiKey,
}) => (
  <App>
    <LanguageSelectOptions appid={appid} apiKey={apiKey} />
  </App>
);

export default TranslateSimplerJSON;
