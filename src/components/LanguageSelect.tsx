import React, { useMemo } from "react";
import { Select, Typography, Space } from "antd";
import { LanguageSelectProps } from "@/types/textTranslation";
import { LANGUAGE_OPTIONS } from "@/constants/languages";

const { Text } = Typography;
const { Option } = Select;

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  label,
  showAutoDetect = true, // 默认显示自动检测
}) => {
  // 使用useMemo优化选项过滤
  const filteredOptions = useMemo(() => {
    return LANGUAGE_OPTIONS.filter((option) => showAutoDetect || option.value !== "auto");
  }, [showAutoDetect]);

  return (
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
        optionFilterProp="title"
        virtual={false} // 对于小列表，禁用虚拟滚动以提高性能
      >
        {filteredOptions.map((option) => (
          <Option key={option.value} value={option.value} title={option.label}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Space>
  );
};

export default LanguageSelect;
