import React, { useState } from "react";
import { App, Button, Typography, Input, Space } from "antd";
import jsonp from "jsonp";
import MD5 from "md5";
import LanguageSelect from "./LanguageSelect";
import { TextTranslationProps } from "@/types/textTranslation";
import { useTranslationLoading } from "@/hooks/useTranslationLoading";

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

  const handleTranslate = async () => {
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
        content: "请输入需要翻译的文本",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    try {
      startLoading();
      const translatedText = await translateText(textData);
      setTransResult(translatedText);
    } catch (error) {
      message.error({
        content: "翻译失败",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const translateText = (query: string) => {
    const salt = Date.now().toString();
    const sign = MD5(appid + query + salt + apiKey).toString();
    const url = `https://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(
      query
    )}&appid=${appid}&salt=${salt}&from=${fromLang}&to=${toLang}&sign=${sign}`;

    return new Promise<string>((resolve, reject) => {
      jsonp(url, { param: "callback" }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const result = data.trans_result
            ?.map((res: { dst: string }) => res.dst)
            .join("\n");
          resolve(result);
        }
      });
    });
  };

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
