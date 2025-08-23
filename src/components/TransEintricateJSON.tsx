import React, { useState } from "react";
import { App, Button, Typography, Input, Space } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import LanguageSelect from "./LanguageSelect";
import ShowFileModel from "./ShowFileModel";
import ExampleFormatModal from "./ExampleFormatModal";
import { TextTranslationProps } from "@/types/textTranslation";
import { useTranslationLoading } from "@/hooks/useTranslationLoading";
import { config } from "@/config/env";
import { EXAMPLE_FORMATS } from "@/constants/exampleFormats";

const { TextArea } = Input;
const { Paragraph, Title } = Typography;

const LanguageSelectOptions: React.FC<TextTranslationProps> = ({
  appid,
  apiKey,
}) => {
  const [fromLang, setFromLang] = useState<string>("auto");
  const [toLang, setToLang] = useState<string>("zh");
  const [textData, setTextData] = useState<string>("");
  const [transResult, setTransResult] = useState<Record<string, unknown> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const [selectedSuffix, setSelectedSuffix] = useState<string>("");

  const { isLoading, startLoading, stopLoading } = useTranslationLoading();
  const { message } = App.useApp();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    // JSON格式规范化
    let formattedText = textData;
    // 1. 去除多余的逗号，例如："button": "OK"，}
    // 需要去除 JSON 最后的多余逗号
    formattedText = formattedText.replace(/,(\s*[\]}])/g, "$1");
    // 2. 确保键名被双引号包裹，处理不带引号的键名（格式2）
    formattedText = formattedText.replace(
      /([{,]\s*)(["']?)(\w+)\2(\s*:\s*)/g,
      '$1"$3"$4'
    );
    // 3. 将单引号包裹的字符串值改为双引号（格式3）
    formattedText = formattedText.replace(/:\s*'([^']*)'/g, ': "$1"');
    // 4. 去除尾部多余的分号 (处理格式1和格式3中的末尾分号)
    formattedText = formattedText.replace(/;\s*([\]}])/g, "$1");
    formattedText = formattedText.replace(/\s*;\s*$/, "");
    // 5. 去除尾部的逗号和分号（针对结尾有逗号和分号的情况）
    formattedText = formattedText.replace(/[;,]\s*([\]}])/g, "$1");
    // 6. 处理多余的尾部符号，删除多余的分号（例如 "};"）
    formattedText = formattedText.replace(/\s*;(\s*[\]}])/g, "$1");
    // 7. 替换多余的引号对（当键名是双引号或单引号时）
    formattedText = formattedText.replace(/(["'])\s*\1/g, "$1");

    // 解析为对象
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

    // 开始显示加载状态
    startLoading();
    
    try {
      // 后续翻译
      const textToTranslate = collectText(data);
      const translatedTextArray = await translateTexts(textToTranslate);
      const translatedData = applyTranslations(data, translatedTextArray);
      setTransResult(translatedData);
      if (isDownload) {
        downloadTranslation(translatedData, suffix, exportType);
      }
    } catch (error) {
      message.error({
        content: "翻译失败, 请检查网络连接或API密钥是否正确",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      console.error(error);
    } finally {
      // 结束加载状态
      stopLoading();
    }
  };

  //   下载文件功能 ---- js、json、txt、ts、tsx、md、txt 格式
  const downloadTranslation = (
    data: Record<string, unknown>,
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

  // 收集 JSON 中的所有文本字段
  const collectText = (obj: Record<string, unknown>, texts: string[] = []): string[] => {
    Object.values(obj).forEach((value) => {
      if (typeof value === "string") {
        texts.push(value);
      } else if (typeof value === "object" && value !== null) {
        collectText(value as Record<string, unknown>, texts);
      }
    });
    return texts;
  };

  // 确认按钮触发的事件
  const handleSuffixConfirm = (suffix: string, exportType: string) => {
    setSelectedSuffix(suffix);
    handleTranslate(true, suffix, exportType);
  };

  // 将翻译后的文本填回嵌套 JSON
  const applyTranslations = (
    obj: Record<string, unknown>,
    translatedTexts: string[],
    index = { value: 0 }
  ): Record<string, unknown> => {
    let newObj: Record<string, unknown>;
    if (Array.isArray(obj)) {
      newObj = {} as Record<string, unknown>;
      obj.forEach((value, i) => {
        newObj[i.toString()] = value;
      });
    } else {
      newObj = {};
    }
    
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (typeof value === "string") {
        newObj[key] = translatedTexts[index.value++];
      } else if (typeof value === "object" && value !== null) {
        newObj[key] = applyTranslations(value as Record<string, unknown>, translatedTexts, index);
      } else {
        newObj[key] = value;
      }
    });

    if (Array.isArray(obj)) {
      return Object.values(newObj) as unknown as Record<string, unknown>;
    }

    return newObj;
  };

  const translateTexts = async (texts: string[]) => {
    try {
      // 使用分块处理，避免过多的API请求
      const chunkSize = 10; // 每次翻译10个文本
      const chunks = [];
      
      for (let i = 0; i < texts.length; i += chunkSize) {
        chunks.push(texts.slice(i, i + chunkSize).join("\n"));
      }
      
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
      
      // 将分块的结果重新组合
      const translatedValues = results.flatMap(
        (result) => result.trans_result?.map((res: { dst: string }) => res.dst) || []
      );
      
      return translatedValues;
    } catch (error) {
      message.error({
        content: "翻译失败, 请检查网络连接或API密钥是否正确",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      console.error(error);
      return [];
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
        timeout: 10000,
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

  return (
    <>
      <Title level={5} className="mt-2">
        🧭请选择目标语言和输入你需要转化的JSON⬇
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

      {/* 查看示例按钮 */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          💡 不知道如何输入？
        </span>
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => setIsExampleModalOpen(true)}
          className="text-blue-500 hover:text-blue-600"
        >
          点击查看案例格式
        </Button>
      </div>

      {/* 示例格式弹窗 */}
      <ExampleFormatModal
        open={isExampleModalOpen}
        onCancel={() => setIsExampleModalOpen(false)}
        title={EXAMPLE_FORMATS.complexJSON.title}
        description={EXAMPLE_FORMATS.complexJSON.description}
        example={EXAMPLE_FORMATS.complexJSON.example}
        mode="complexJSON"
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
        placeholder={EXAMPLE_FORMATS.complexJSON.placeholder}
        autoSize={{ minRows: 6, maxRows: 10 }}
        className="mt-4"
        showCount
        maxLength={10000}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleTranslate(false)}
          className="mt-4"
          loading={isLoading}
        >
          {isLoading ? "翻译中..." : "直接翻译"}
        </Button>
        <Button 
          type="primary" 
          onClick={openModal} 
          className="mt-4 ml-4"
          loading={isLoading}
        >
          {isLoading ? "翻译中..." : `翻译并且下载 ${toLang}.${selectedSuffix || "js"}`}
        </Button>
      </Space>
      
             {/* 如果正在加载中且没有结果，显示加载提示 */}
       {isLoading && !transResult && (
         <div className="mt-4 text-center">
           <div className="text-lg">正在为你翻译复杂JSON模式请稍等...</div>
         </div>
       )}
      
      {transResult && (
        <>
          <Title level={5} className="mt-4">
            🧭翻译结果⬇
          </Title>
          <Paragraph
            copyable
            className="p-4 rounded mt-4 whitespace-pre-wrap font-mono"
          >
            {JSON.stringify(transResult, null, 2)}
          </Paragraph>
        </>
      )}
    </>
  );
};

const TransEintricateJSON: React.FC<TextTranslationProps> = ({
  appid,
  apiKey,
}) => (
  <App>
    <LanguageSelectOptions appid={appid} apiKey={apiKey} />
  </App>
);

export default TransEintricateJSON;
