import React, { useState, useCallback } from "react";
import { App, Button, Typography, Input, Space } from "antd";
import { EyeOutlined, CopyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import LanguageSelect from "./LanguageSelect";
import ExampleFormatModal from "./ExampleFormatModal";
import { TextTranslationProps } from "@/types/textTranslation";
import { useTranslationLoading } from "@/hooks/useTranslationLoading";
import TranslationService from "@/services/translationService";
import { getExampleFormats } from "@/constants/exampleFormats";

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
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const { isLoading, startLoading, stopLoading } = useTranslationLoading();
  const { message } = App.useApp();
  const { t } = useTranslation();
  
  const EXAMPLE_FORMATS = getExampleFormats();

  // 复制翻译结果到剪贴板
  const handleCopyResult = async () => {
    if (!transResult) {
      message.warning({
        content: t('translation.noResultToCopy', '没有翻译结果可复制'),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(transResult);
      message.success({
        content: t('translation.copySuccess'),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } catch {
      // 如果现代API失败，使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = transResult;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.success({
          content: t('translation.copySuccess'),
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      } catch {
        message.error({
          content: t('translation.copyError'),
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      }
      document.body.removeChild(textArea);
    }
  };

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
      
      message.success({
        content: t('translation.textTranslateSuccess'),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('translation.textTranslateFailed');
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
  }, [appid, apiKey, textData, fromLang, toLang, startLoading, stopLoading, message, t]);

  return (
    <>
      <Title level={5} className="mt-2">
        {t('translation.selectLanguageAndInput', '🧭请选择目标语言和输入你需要翻译的文本⬇')}
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

      <div className="flex justify-between items-center mt-4 mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {t('translation.dontKnowHowToInput', '💡 不知道如何输入？')}
        </span>
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setIsExampleModalOpen(true)}
          className="text-blue-500 hover:text-blue-600"
        >
          {t('translation.viewExample')}
        </Button>
      </div>

      <ExampleFormatModal
        open={isExampleModalOpen}
        onCancel={() => setIsExampleModalOpen(false)}
        title={EXAMPLE_FORMATS.text.title}
        description={EXAMPLE_FORMATS.text.description}
        example={EXAMPLE_FORMATS.text.example}
        mode="text"
      />

      <TextArea
        allowClear
        value={textData}
        onChange={(e) => setTextData(e.target.value)}
        placeholder={EXAMPLE_FORMATS.text.placeholder}
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
        {isLoading ? t('translation.translating') : t('translation.translate')}
      </Button>
             {isLoading && !transResult && (
         <div className="mt-4 text-center">
           <div className="text-lg">{t('translation.translatingText', '正在为你翻译文本模式请稍等...')}</div>
         </div>
       )}
      {transResult && (
        <>
          <div className="flex items-center justify-between mt-4">
            <Title level={5} className="mb-0">
              {t('translation.translationResult', '🧭翻译结果⬇')}
            </Title>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={handleCopyResult}
              className="flex items-center text-blue-500 hover:text-blue-600"
              size="small"
            >
              {t('translation.copyResult', '复制翻译结果')}
            </Button>
          </div>
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
