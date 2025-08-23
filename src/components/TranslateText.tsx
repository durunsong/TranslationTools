import React, { useState, useCallback } from "react";
import { App, Button, Typography, Input, Space } from "antd";
import LanguageSelect from "./LanguageSelect";
import { TextTranslationProps } from "@/types/textTranslation";
import { useTranslationLoading } from "@/hooks/useTranslationLoading";
import TranslationService from "@/services/translationService";

const { TextArea } = Input;
const { Paragraph, Title } = Typography;

const TextTranslationComponent: React.FC<TextTranslationProps> = ({
  appid,
  apiKey,
}) => {
  const [fromLang, setFromLang] = useState<string>("auto");
  const [toLang, setToLang] = useState<string>("zh");
  const [textData, setTextData] = useState<string>("");
  const [transResult, setTransResult] = useState<string | null>(null);
  const { isLoading, startLoading, stopLoading } = useTranslationLoading();
  const { message } = App.useApp();

  const handleTranslate = useCallback(async () => {
    // 参数验证
    const validation = TranslationService.validateParams({
      appid: appid || undefined,
      apiKey: apiKey || undefined,
      query: textData,
      from: fromLang,
      to: toLang,
    });

    if (!validation.isValid) {
      message.error({
        content: validation.message,
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    try {
      startLoading();
      const translatedText = await TranslationService.translate({
        query: textData,
        from: fromLang,
        to: toLang,
        appid: appid!,
        apiKey: apiKey!,
      });
      setTransResult(translatedText);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "翻译失败";
      message.error({
        content: errorMessage,
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      console.error("Translation error:", error);
    } finally {
      stopLoading();
    }
  }, [appid, apiKey, textData, fromLang, toLang, startLoading, stopLoading, message]);

  return (
    <>
      <Title level={5} className="mt-2">
        🧭请选择目标语言和输入你需要翻译的文本⬇
      </Title>
      <Space>
        <LanguageSelect
          showAutoDetect={true}
          value={fromLang}
          onChange={setFromLang}
          label="源语言"
        />
        <LanguageSelect
          showAutoDetect={false}
          value={toLang}
          onChange={setToLang}
          label="目标语言"
        />
      </Space>
      <TextArea
        allowClear
        value={textData}
        onChange={(e) => setTextData(e.target.value)}
        placeholder="请输入待翻译的文本"
        autoSize={{ minRows: 6, maxRows: 10 }}
        className="mt-4"
        showCount
        maxLength={2000}
      />
      <Button 
        type="primary" 
        onClick={handleTranslate} 
        className="mt-4 w-fit"
        loading={isLoading}
      >
        {isLoading ? "翻译中..." : "翻译"}
      </Button>
      {isLoading && !transResult && (
        <div className="mt-4 text-center">
          <div className="text-lg">正在为你翻译请稍等...</div>
        </div>
      )}
      {transResult && (
        <>
          <Title level={5} className="mt-4">
            🧭翻译结果⬇
          </Title>
          <Paragraph
            copyable
            className="p-4 rounded whitespace-pre-wrap font-mono"
          >
            {transResult}
          </Paragraph>
        </>
      )}
    </>
  );
};

export default TextTranslationComponent;
