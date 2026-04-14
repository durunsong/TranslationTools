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

const LanguageSelectOptions: React.FC<TextTranslationProps> = ({
  appid,
  apiKey,
}) => {
  const [fromLang, setFromLang] = useState<string>("auto");
  const [toLang, setToLang] = useState<string>("zh");
  const [textData, setTextData] = useState<string>("");
  const [transResult, setTransResult] = useState<{
    [key: string]: string;
  } | null>(null);
  const { isLoading, startLoading, stopLoading } = useTranslationLoading();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const [selectedSuffix, setSelectedSuffix] = useState<string>("");
  
  const EXAMPLE_FORMATS = getExampleFormats();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 确认按钮触发的事件
  const handleSuffixConfirm = (suffix: string, exportType: string) => {
    setSelectedSuffix(suffix);
    handleTranslate(true, suffix, exportType);
  };

  // 复制翻译结果到剪贴板
  const handleCopyResult = async () => {
    if (!transResult) {
      message.warning({
        content: "没有翻译结果可复制",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    const resultText = `{\n${Object.entries(transResult)
      .map(([key, value]) => `  "${key}": "${value}",`)
      .join("\n")
      .slice(0, -1)}\n}`;

    try {
      await navigator.clipboard.writeText(resultText);
      message.success({
        content: "翻译结果已复制到剪贴板",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } catch (error) {
      // 如果现代API失败，使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = resultText;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.success({
          content: "翻译结果已复制到剪贴板",
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      } catch (fallbackError) {
        message.error({
          content: "复制失败，请手动复制",
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const handleTranslate = async (
    isDownload: boolean,
    suffix?: string,
    exportType?: string
  ) => {
    if (!appid || !apiKey) {
      message.error({
        content: "请先配置 App ID 和 Key！",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }
    if (!textData.trim()) {
      message.error({
        content: "请输入需要翻译的JSON数据！",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }
    let data;
    /* JSON 标准格式转化 */
    // 1. 移除多余逗号
    let formattedText = textData.replace(/,(\s*[}\]])/g, "$1");
    // 2. 移除分号（;），以确保 JSON 格式合法
    formattedText = formattedText.replace(/;/g, "");
    // 3. 确保键名用双引号包裹，支持单引号键名的处理（支持格式2）
    formattedText = formattedText.replace(
      /([{,]\s*)(["']?)(\w+)\2(\s*:\s*)/g,
      '$1"$3"$4'
    );
    // 4. 将单引号包裹的字符串值改为双引号（支持格式3）
    formattedText = formattedText.replace(/:\s*'([^']*)'/g, ': "$1"');
    // 5. 确保字符串值使用双引号，防止非引号字符串（支持格式1）
    formattedText = formattedText.replace(
      /:\s*([a-zA-Z0-9_\s]+)(\s*[,}])/g,
      ': "$1"$2'
    );

    try {
      data = JSON.parse(formattedText);
    } catch {
      message.error({
        content: "输入的文本格式不正确，请确保是有效的 JSON 对象格式",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    const zhKeysArr = Object.keys(data);
    const valueArr = Object.values(data);
    const chunkSize = 10; // 每次翻译10个key-value对
    const chunks = [];

    for (let i = 0; i < valueArr.length; i += chunkSize) {
      chunks.push(valueArr.slice(i, i + chunkSize).join("\n"));
    }

    // 开始显示加载状态
    startLoading();
    
    try {
      // 为了避免频率限制，添加延迟处理
      const results = [];
      for (let i = 0; i < chunks.length; i++) {
        if (i > 0) {
          // 每个请求之间延迟300ms，避免频率限制
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        const result = await translateChunk(chunks[i]);
        results.push(result);
      }
      const translatedValues = results.flatMap(
        (result) => result.trans_result?.map((res: { dst: string }) => res.dst) || []
      );

      const translation = zhKeysArr.reduce((acc, key, index) => {
        acc[key] = translatedValues[index] || "";
        return acc;
      }, {} as Record<string, string>);

      setTransResult(translation);
      
      message.success({
        content: t('translation.simpleJSONTranslateSuccess', { count: translatedValues.length }),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      
      if (isDownload) {
        downloadTranslation(translation, suffix, exportType);
      }
    } catch (e) {
      message.error({
        content: t('translation.simpleJSONTranslateFailed'),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      console.error(e);
    } finally {
      stopLoading();
    }
  };

  const translateChunk = async (query: string) => {
    try {
      const response = await axios.post(config.api.proxyApiUrl, {
        query,
        from: fromLang,
        to: toLang,
        appid,
        apiKey,
      }, {
        timeout: config.api.timeout,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      
      if (!data.success || data.error) {
        throw new Error(data.error?.message || '翻译请求失败');
      }

      if (!data.data?.trans_result) {
        throw new Error('翻译结果为空');
      }

      console.log(data);
      return { trans_result: data.data.trans_result };
    } catch (error: unknown) {
      console.error('翻译请求失败:', error);
      throw error;
    }
  };

  //   下载文件功能 ---- js、json、txt、ts、tsx、md、txt 格式
  const downloadTranslation = (
    data: Record<string, string>,
    suffix?: string,
    exportType?: string
  ) => {
    if (!suffix) {
      message.error({
        content: "请选择文件后缀名",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }
    // 文件名+后缀名
    const filename = `${toLang}.${suffix}`;
    let content = "";
    // 根据后缀名生成文件内容
    if (exportType == "Yes") {
      content = `const ${toLang} = {\n${Object.entries(data)
        .map(
          ([key, value]) =>
            `  ${JSON.stringify(key)}: ${JSON.stringify(value)},\n`
        )
        .join("")}} \n\n export default ${toLang}; `;
    } else {
      content = `{\n${Object.entries(data)
        .map(
          ([key, value]) =>
            `  ${JSON.stringify(key)}: ${JSON.stringify(value)},\n`
        )
        .join("")}}`;
    }
    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Title level={5} className="mt-2">
        {t('translation.selectLanguageAndInputJSON', '🧭请选择目标语言和输入你需要转化的JSON⬇')}
      </Title>
      <Space>
        <LanguageSelect
          value={fromLang}
          onChange={setFromLang}
          showAutoDetect={true}
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
          {t('translation.dontKnowHowToInput')}
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
        title={EXAMPLE_FORMATS.simpleJSON.title}
        description={EXAMPLE_FORMATS.simpleJSON.description}
        example={EXAMPLE_FORMATS.simpleJSON.example}
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
        onChange={(e) => setTextData(e.target.value)}
        onKeyDown={(e) => {
          if (!shouldSubmitOnEnter(e)) {
            return;
          }

          e.preventDefault();
          if (!isLoading) {
            handleTranslate(false);
          }
        }}
        placeholder={EXAMPLE_FORMATS.simpleJSON.placeholder}
        autoSize={{ minRows: 6, maxRows: 10 }}
        className="mt-4"
        showCount
        maxLength={10000}
      />
      <div className="flex justify-start mt-1">
        <span className="text-xs text-gray-400 dark:text-gray-500 select-none">
          {t('translation.keyboardHint', '↵ Enter 提交翻译 · Shift + Enter 换行')}
        </span>
      </div>
      <Space>
        <Button
          type="primary"
          onClick={() => handleTranslate(false)}
          className="mt-4"
          loading={isLoading}
        >
          {isLoading ? t('translation.translating') : t('translation.directTranslate', '直接翻译')}
        </Button>
        <Button 
          type="primary" 
          onClick={openModal} 
          className="mt-4 ml-4"
          loading={isLoading}
        >
          {isLoading ? t('translation.translating') : `${t('translation.translateAndDownload', '翻译并且下载')} ${toLang}.${selectedSuffix || "js"}`}
        </Button>
      </Space>
      
       {isLoading && !transResult && (
         <div className="mt-4 text-center">
           <div className="text-lg">{t('translation.translatingSimpleJSON', '正在为你翻译简单JSON模式请稍等...')}</div>
         </div>
       )}
      
      {transResult && (
        <>
          <div className="flex items-center justify-between mt-4">
            <Title level={5} className="mb-0">
              {t('translation.translationResult')}
            </Title>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={handleCopyResult}
              className="flex items-center text-blue-500 hover:text-blue-600"
              size="small"
            >
              {t('translation.copyResult')}
            </Button>
          </div>
          <Paragraph
            copyable
            className="p-4 rounded mt-4 whitespace-pre-wrap font-mono"
          >
            {`{\n${Object.entries(transResult)
              .map(([key, value]) => `  "${key}": "${value}",`)
              .join("\n")}\n}`}
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
