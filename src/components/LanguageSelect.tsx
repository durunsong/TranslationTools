import React, { useMemo } from "react";
import { Select, Typography, Space } from "antd";
import { useTranslation } from "react-i18next";
import { LanguageSelectProps } from "@/types/textTranslation";

const { Text } = Typography;
const { Option } = Select;

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  label,
  showAutoDetect = true, // 默认显示自动检测
}) => {
  const { t } = useTranslation();
  
  // 动态获取国际化的语言选项，并使用useMemo优化选项过滤
  const filteredOptions = useMemo(() => {
    // 定义语言代码映射
    const languageCodes = [
      { value: "auto", key: 'languages.auto' },
      { value: "zh", key: 'languages.zh' },
      { value: "en", key: 'languages.en' },
      { value: "jp", key: 'languages.jp' },
      { value: "kor", key: 'languages.kor' },
      { value: "fra", key: 'languages.fra' },
      { value: "de", key: 'languages.de' },
      { value: "ru", key: 'languages.ru' },
      { value: "spa", key: 'languages.spa' },
      { value: "it", key: 'languages.it' },
      { value: "pt", key: 'languages.pt' },
      { value: "ara", key: 'languages.ara' },
      { value: "th", key: 'languages.th' },
      { value: "vie", key: 'languages.vie' },
      { value: "cht", key: 'languages.cht' },
      { value: "pl", key: 'languages.pl' },
      { value: "dan", key: 'languages.dan' },
      { value: "nl", key: 'languages.nl' },
      { value: "el", key: 'languages.el' },
      { value: "cs", key: 'languages.cs' },
      { value: "swe", key: 'languages.swe' },
      { value: "fin", key: 'languages.fin' },
      { value: "rom", key: 'languages.rom' },
      { value: "hu", key: 'languages.hu' },
    ];
    
    const languageOptions = languageCodes.map(({ value, key }) => ({
      value,
      label: t(key)
    }));
    return languageOptions.filter((option) => showAutoDetect || option.value !== "auto");
  }, [showAutoDetect, t]); // t 函数会在语言切换时更新

  return (
    <Space className="mb-4">
      <Text>{label === '源语言' ? t('translation.sourceLanguage') : t('translation.targetLanguage')}:</Text>
      <Select
        showSearch
        value={value}
        onChange={onChange}
        className="w-[120px] ml-2"
        filterOption={(input, option) =>
          (option?.title as string)?.toLowerCase().includes(input.toLowerCase())
        }
        placeholder={t('translation.selectLanguage')}
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
