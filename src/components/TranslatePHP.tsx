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

/**
 * PHP数组解析器
 */
class PHPArrayParser {
  /**
   * 解析PHP数组字符串，提取需要翻译的值
   * @param phpContent PHP数组内容
   * @returns 解析结果
   */
  static parsePHPArray(phpContent: string): {
    keys: string[];
    values: string[];
    structure: any;
  } {
    const keys: string[] = [];
    const values: string[] = [];
    const structure: any = {};

    // 移除PHP标签和return语句
    let content = phpContent
      .replace(/<\?php/g, '')
      .replace(/\?>/g, '')
      .replace(/return\s+/g, '')
      .replace(/;?\s*$/, '')
      .trim();

    // 递归解析数组结构
    const parseLevel = (obj: any, prefix = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          parseLevel(value, fullKey);
        } else if (typeof value === 'string') {
          keys.push(fullKey);
          values.push(value);
        }
      }
    };

    try {
      // 使用正则表达式解析PHP数组语法
      const parsed = this.parsePhpArrayString(content);
      structure.parsed = parsed;
      parseLevel(parsed);
    } catch (error) {
      console.error('PHP数组解析失败:', error);
      throw new Error('PHP数组格式不正确，请检查语法');
    }

    return { keys, values, structure };
  }

  /**
   * 解析PHP数组字符串为JavaScript对象
   * @param phpArrayString PHP数组字符串
   * @returns JavaScript对象
   */
  private static parsePhpArrayString(phpArrayString: string): any {
    try {
      // 预处理PHP代码
      let content = phpArrayString
        .replace(/<\?php/g, '')
        .replace(/\?>/g, '')
        .replace(/return\s+/g, '')
        .replace(/;?\s*$/, '')
        .trim();

      // 移除外层的方括号
      if (content.startsWith('[') && content.endsWith(']')) {
        content = content.slice(1, -1);
      }

      return this.parseArrayContent(content);
    } catch (error) {
      console.error('PHP解析错误:', error);
      throw new Error('PHP数组格式解析失败，请检查语法是否正确');
    }
  }

  /**
   * 递归解析数组内容
   * @param content 数组内容字符串
   * @returns 解析后的对象
   */
  private static parseArrayContent(content: string): any {
    const result: any = {};
    let i = 0;
    
    while (i < content.length) {
      // 跳过空白字符和注释
      i = this.skipWhitespaceAndComments(content, i);
      if (i >= content.length) break;

      // 解析键
      const keyResult = this.parseKey(content, i);
      if (!keyResult) break;
      
      const key = keyResult.key;
      i = keyResult.endIndex;

      // 跳过 '=>'
      i = this.skipWhitespaceAndComments(content, i);
      if (content.substr(i, 2) === '=>') {
        i += 2;
        i = this.skipWhitespaceAndComments(content, i);
      }

      // 解析值
      const valueResult = this.parseValue(content, i);
      if (!valueResult) break;

      result[key] = valueResult.value;
      i = valueResult.endIndex;

      // 跳过逗号
      i = this.skipWhitespaceAndComments(content, i);
      if (content[i] === ',') {
        i++;
      }
    }

    return result;
  }

  /**
   * 跳过空白字符和注释
   */
  private static skipWhitespaceAndComments(content: string, index: number): number {
    while (index < content.length) {
      const char = content[index];
      if (/\s/.test(char)) {
        index++;
      } else if (content.substr(index, 2) === '//') {
        // 跳过单行注释
        while (index < content.length && content[index] !== '\n') {
          index++;
        }
      } else if (content.substr(index, 2) === '/*') {
        // 跳过多行注释
        index += 2;
        while (index < content.length - 1) {
          if (content.substr(index, 2) === '*/') {
            index += 2;
            break;
          }
          index++;
        }
      } else {
        break;
      }
    }
    return index;
  }

  /**
   * 解析键
   */
  private static parseKey(content: string, index: number): { key: string; endIndex: number } | null {
    const char = content[index];
    
    if (char === '"' || char === "'") {
      // 带引号的键
      const quote = char;
      let i = index + 1;
      let key = '';
      
      while (i < content.length && content[i] !== quote) {
        if (content[i] === '\\') {
          i++; // 跳过转义字符
          if (i < content.length) {
            key += content[i];
          }
        } else {
          key += content[i];
        }
        i++;
      }
      
      if (content[i] === quote) {
        i++; // 跳过结束引号
      }
      
      return { key, endIndex: i };
    } else {
      // 无引号的键（数字或标识符）
      let i = index;
      let key = '';
      
      while (i < content.length && /[a-zA-Z0-9_]/.test(content[i])) {
        key += content[i];
        i++;
      }
      
      return key ? { key, endIndex: i } : null;
    }
  }

  /**
   * 解析值
   */
  private static parseValue(content: string, index: number): { value: any; endIndex: number } | null {
    const char = content[index];
    
    if (char === '"' || char === "'") {
      // 字符串值
      const quote = char;
      let i = index + 1;
      let value = '';
      
      while (i < content.length && content[i] !== quote) {
        if (content[i] === '\\') {
          i++; // 跳过转义字符
          if (i < content.length) {
            value += content[i];
          }
        } else {
          value += content[i];
        }
        i++;
      }
      
      if (content[i] === quote) {
        i++; // 跳过结束引号
      }
      
      return { value, endIndex: i };
    } else if (char === '[') {
      // 嵌套数组
      let i = index + 1;
      let depth = 1;
      let arrayContent = '';
      
      while (i < content.length && depth > 0) {
        if (content[i] === '[') {
          depth++;
        } else if (content[i] === ']') {
          depth--;
        }
        
        if (depth > 0) {
          arrayContent += content[i];
        }
        i++;
      }
      
      const nestedValue = this.parseArrayContent(arrayContent);
      return { value: nestedValue, endIndex: i };
    } else {
      // 其他值类型（数字、布尔值等）
      let i = index;
      let value = '';
      
      while (i < content.length && content[i] !== ',' && content[i] !== ']' && content[i] !== '\n') {
        value += content[i];
        i++;
      }
      
      value = value.trim();
      
      // 尝试转换数字或布尔值
      if (/^\d+$/.test(value)) {
        return { value: parseInt(value), endIndex: i };
      } else if (value === 'true') {
        return { value: true, endIndex: i };
      } else if (value === 'false') {
        return { value: false, endIndex: i };
      } else {
        return { value, endIndex: i };
      }
    }
  }

  /**
   * 将翻译结果重新组装成PHP数组格式
   * @param structure 原始结构
   * @param translations 翻译结果映射
   * @returns PHP数组字符串
   */
  static buildPHPArray(structure: any, translations: Record<string, string>): string {
    const buildLevel = (obj: any, prefix = '', indent = 1): string => {
      const indentStr = '    '.repeat(indent);
      const items: string[] = [];

      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          const nestedContent = buildLevel(value, fullKey, indent + 1);
          items.push(`${indentStr}'${key}' => [\n${nestedContent}\n${indentStr}]`);
        } else if (typeof value === 'string') {
          const translatedValue = translations[fullKey] || value;
          items.push(`${indentStr}'${key}' => '${translatedValue}'`);
        }
      }

      return items.join(',\n');
    };

    const content = buildLevel(structure.parsed);
    return `<?php\nreturn [\n${content}\n];\n?>`;
  }
}

const PHPTranslationComponent: React.FC<TextTranslationProps> = ({
  appid,
  apiKey,
}) => {
  const [fromLang, setFromLang] = useState<string>("auto");
  const [toLang, setToLang] = useState<string>("zh");
  const [textData, setTextData] = useState<string>("");
  const [transResult, setTransResult] = useState<string | null>(null);
  const { isLoading, startLoading, stopLoading } = useTranslationLoading();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
  const [selectedSuffix, setSelectedSuffix] = useState<string>("php");
  
  const EXAMPLE_FORMATS = getExampleFormats();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 确认按钮触发的事件
  const handleSuffixConfirm = (suffix: string) => {
    setSelectedSuffix(suffix);
    handleTranslate(true, suffix);
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

    try {
      await navigator.clipboard.writeText(transResult);
      message.success({
        content: "翻译结果已复制到剪贴板",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } catch (error) {
      // 如果现代API失败，使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = transResult;
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

  // 检测输入格式
  const detectInputFormat = (input: string): 'php' | 'json' => {
    const trimmed = input.trim();
    if (trimmed.includes('<?php') || trimmed.includes('return [') || trimmed.includes('=>')) {
      return 'php';
    }
    return 'json';
  };

  const handleTranslate = async (
    isDownload: boolean = false,
    suffix?: string
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
        content: "请输入需要翻译的PHP数组数据！",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    try {
      startLoading();

      // 解析PHP数组
      const { keys, values, structure } = PHPArrayParser.parsePHPArray(textData);
      
      if (values.length === 0) {
        message.warning({
          content: "未找到需要翻译的文本内容",
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
        return;
      }

      // 分批翻译
      const chunkSize = 10;
      const chunks = [];
      for (let i = 0; i < values.length; i += chunkSize) {
        chunks.push(values.slice(i, i + chunkSize).join("\n"));
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
      
      const translatedValues = results.flatMap(
        (result) => result.trans_result?.map((res: { dst: string }) => res.dst) || []
      );

      // 构建翻译映射
      const translations: Record<string, string> = {};
      keys.forEach((key, index) => {
        translations[key] = translatedValues[index] || values[index];
      });

      // 自动检测输入格式并生成对应输出
      const detectedFormat = detectInputFormat(textData);
      let output = "";
      
      if (detectedFormat === "php") {
        output = PHPArrayParser.buildPHPArray(structure, translations);
        // 自动设置下载格式为php
        if (!selectedSuffix || selectedSuffix !== "php") {
          setSelectedSuffix("php");
        }
      } else {
        const jsonObj: any = {};
        keys.forEach((key, index) => {
          jsonObj[key] = translatedValues[index] || values[index];
        });
        output = JSON.stringify(jsonObj, null, 2);
        // 自动设置下载格式为json
        if (!selectedSuffix || selectedSuffix !== "json") {
          setSelectedSuffix("json");
        }
      }

      setTransResult(output);

      if (isDownload) {
        downloadTranslation(output, suffix || selectedSuffix);
      }

      message.success({
        content: t('translation.phpTranslateSuccess', { count: translatedValues.length }),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });

    } catch (error: any) {
      message.error({
        content: error.message || t('translation.phpTranslateFailed'),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      console.error("PHP翻译错误:", error);
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

      return { trans_result: data.data.trans_result };
    } catch (error: any) {
      console.error('翻译请求失败:', error);
      throw error;
    }
  };

  // 下载文件功能
  const downloadTranslation = (
    data: string,
    suffix?: string
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

    const filename = `${toLang}_translation.${suffix}`;
    const blob = new Blob([data], { 
      type: suffix === 'php' ? 'application/x-php' : 'application/json' 
    });
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
        {t('translation.selectLanguageAndInputPHP', '🧭请选择目标语言和输入你需要翻译的PHP数组⬇')}
      </Title>
      <Space wrap>
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
        title={EXAMPLE_FORMATS.php.title}
        description={EXAMPLE_FORMATS.php.description}
        example={EXAMPLE_FORMATS.php.example}
        mode="php"
      />

      <ShowFileModel
        open={isModalOpen}
        onCancel={closeModal}
        onSuffixSelect={handleSuffixConfirm}
        toLang={toLang}
        defaultSuffix={detectInputFormat(textData) === 'php' ? 'php' : 'json'}
        defaultExport="No"
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
        placeholder={EXAMPLE_FORMATS.php.placeholder}
        autoSize={{ minRows: 8, maxRows: 15 }}
        className="mt-4"
        showCount
        maxLength={20000}
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
          {isLoading ? t('translation.translating') : t('translation.directTranslate')}
        </Button>
        <Button 
          type="primary" 
          onClick={openModal} 
          className="mt-4"
          loading={isLoading}
        >
          {isLoading ? t('translation.translating') : `${t('translation.translateAndDownload')} ${toLang}.${selectedSuffix}`}
        </Button>
      </Space>
      
       {isLoading && !transResult && (
         <div className="mt-4 text-center">
           <div className="text-lg">{t('translation.translatingPHP', '正在为你翻译PHP数组模式请稍等...')}</div>
         </div>
       )}
      
      {/* 翻译结果 */}
      {transResult && (
        <>
          <div className="flex items-center justify-between mt-4">
            <Title level={5} className="mb-0">
              {t('translation.translationResultWithFormat', '🧭翻译结果 ({format})⬇', { format: detectInputFormat(textData).toUpperCase() })}
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
            className="p-4 rounded mt-4 whitespace-pre-wrap font-mono text-sm"
            style={{ 
              backgroundColor: document.documentElement.classList.contains("dark") 
                ? "#1f1f1f" 
                : "#f5f5f5",
              maxHeight: "400px",
              overflowY: "auto"
            }}
          >
            {transResult}
          </Paragraph>
        </>
      )}
    </>
  );
};

const TranslatePHP: React.FC<TextTranslationProps> = ({
  appid,
  apiKey,
}) => (
  <App>
    <PHPTranslationComponent appid={appid} apiKey={apiKey} />
  </App>
);

export default TranslatePHP;
