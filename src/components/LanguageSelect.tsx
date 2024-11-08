import React from "react";
import { Select, Typography, Space } from "antd";

const { Text } = Typography;
const { Option } = Select;

// 百度翻译中对应的语言key
const languageOptions = [
  { value: "auto", label: "自动检测" },
  { value: "zh", label: "中文" },
  { value: "en", label: "英语" },
  { value: "de", label: "德语" },
  { value: "fra", label: "法语" },
  { value: "jp", label: "日语" },
  { value: "kor", label: "韩语" },
  { value: "ru", label: "俄语" },
  { value: "pl", label: "波兰语" },
  { value: "dan", label: "丹麦语" },
  { value: "lat", label: "拉丁语" },
  { value: "nl", label: "荷兰语" },
  { value: "pt", label: "葡萄牙语" },
  { value: "th", label: "泰语" },
  { value: "it", label: "意大利语" },
  { value: "el", label: "希腊语" },
  { value: "ara", label: "阿拉伯语" },
  { value: "spa", label: "西班牙语" },
  { value: "cs", label: "捷克语" },
  { value: "swe", label: "瑞典语" },
  { value: "cht", label: "繁体中文" },
  { value: "gle", label: "爱尔兰语" },
  { value: "fin", label: "芬兰语" },
  { value: "rom", label: "罗马尼亚语" },
  { value: "vie", label: "越南语" },
  { value: "hu", label: "匈牙利语" },
  { value: "id", label: "印尼语" },
  { value: "hmn", label: "苗语" },
  { value: "nor", label: "挪威语" },
  { value: "tr", label: "土耳其语	" },
];

interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  showAutoDetect?: boolean; // 是否显示自动检测选项
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  label,
  showAutoDetect = true, // 默认显示自动检测
}) => (
  <Space className="mb-4">
    <Text>{label}:</Text>
    <Select
      showSearch
      value={value}
      onChange={onChange}
      className="w-[120px] ml-2"
      filterOption={(input, option) =>
        (option?.title as string)?.toLowerCase().includes(input.toLowerCase())
      }
      placeholder="请选择语言"
    >
      {languageOptions
        .filter((option) => showAutoDetect || option.value !== "auto") // 根据条件过滤
        .map((option) => (
          <Option key={option.value} value={option.value} title={option.label}>
            {option.label}
          </Option>
        ))}
    </Select>
  </Space>
);

export default LanguageSelect;
