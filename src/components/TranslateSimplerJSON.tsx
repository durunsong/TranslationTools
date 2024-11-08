import React, { useState } from "react";
import { App, Button, Typography, Input, Space } from "antd";
import jsonp from "jsonp";
import MD5 from "md5";
import LanguageSelect from "./LanguageSelect";
import ShowFileModel from "./ShowFileModel";
import { TextTranslationProps } from "@/types/textTranslation";

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
  const { message } = App.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuffix, setSelectedSuffix] = useState<string>("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 确认按钮触发的事件
  const handleSuffixConfirm = (suffix: string, exportType: string) => {
    setSelectedSuffix(suffix);
    handleTranslate(true, suffix, exportType);
  };

  const handleTranslate = async (
    isDownload: Boolean,
    suffix?: string,
    exportType?: string
  ) => {
    if (!appid || !apiKey) {
      message.error("请先配置 App ID 和 Key！");
      return;
    }
    if (!textData.trim()) {
      message.error("请输入需要翻译的文本");
      return;
    }
    let data;
    /* JSON 标准格式转化 */
    // 1. 移除多余逗号
    let formattedText = textData.replace(/,(\s*[\]}])/g, "$1");
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
      /:\s*([a-zA-Z0-9_\s]+)(\s*[,\}])/g,
      ': "$1"$2'
    );

    try {
      data = JSON.parse(formattedText);
    } catch (error) {
      message.error("输入的文本格式不正确，请确保是有效的 JSON 对象格式");
      return;
    }

    const zhKeysArr = Object.keys(data);
    const valueArr = Object.values(data);
    const chunkSize = 8; // 每次翻译8个key-value对
    const chunks = [];

    for (let i = 0; i < valueArr.length; i += chunkSize) {
      chunks.push(valueArr.slice(i, i + chunkSize).join("\n"));
    }

    try {
      const transPromises = chunks.map((chunk) => translateChunk(chunk));
      const results = await Promise.all(transPromises);
      const translatedValues = results.flatMap(
        (result) => result.trans_result?.map((res: any) => res.dst) || []
      );

      const translation = zhKeysArr.reduce((acc, key, index) => {
        acc[key] = translatedValues[index] || "";
        return acc;
      }, {} as Record<string, string>);

      setTransResult(translation);
      if (isDownload) {
        downloadTranslation(translation, suffix, exportType);
      }
    } catch (error) {
      message.error("Translation failed");
      console.error(error);
    }
  };

  const translateChunk = (query: string) => {
    const salt = Date.now().toString();
    const sign = MD5(appid + query + salt + apiKey).toString();
    const url = `https://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(
      query
    )}&appid=${appid}&salt=${salt}&from=${fromLang}&to=${toLang}&sign=${sign}`;

    return new Promise<{ trans_result: Array<{ dst: string }> }>(
      (resolve, reject) => {
        jsonp(url, { param: "callback" }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
            console.log(data); // 打印翻译结果
          }
        });
      }
    );
  };

  //   下载文件功能 ---- js、json、txt、ts、tsx、md、txt 格式
  const downloadTranslation = (
    data: Record<string, string>,
    suffix?: string,
    exportType?: string
  ) => {
    if (!suffix) {
      message.error("请选择文件后缀名");
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
        placeholder="请输入待翻译的 JSON 格式数据"
        autoSize={{ minRows: 6, maxRows: 10 }}
        className="mt-4"
        showCount
        maxLength={2000}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleTranslate(false)}
          className="mt-4"
        >
          直接翻译
        </Button>
        <Button type="primary" onClick={openModal} className="mt-4 ml-4">
          翻译并且下载 {toLang}.{selectedSuffix || "js"}
        </Button>
      </Space>
      {transResult && (
        <>
          <Title level={5} className="mt-4">
            🧭翻译结果⬇
          </Title>
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
