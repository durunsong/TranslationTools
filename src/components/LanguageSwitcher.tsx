import React from "react";
import { Select } from "antd";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const ChineseIcon: React.FC = () => (
  <span style={{ fontSize: '16px', marginRight: '6px' }}>🇨🇳</span>
);

const EnglishIcon: React.FC = () => (
  <span style={{ fontSize: '16px', marginRight: '6px' }}>🇺🇸</span>
);

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();
  const { themeMode } = useThemeStore();
  const { t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <Select
      value={language}
      onChange={handleLanguageChange}
      style={{ 
        width: 110,
      }}
      dropdownStyle={{
        backgroundColor: themeMode === "light" ? "#ffffff" : "#1f1f1f",
        border: `1px solid ${themeMode === "light" ? "#d9d9d9" : "#434343"}`,
      }}
    >
      <Option value="zh" title={t('languages.zh')}>
        <ChineseIcon />
        {t('languages.zh')}
      </Option>
      <Option value="en" title={t('languages.en')}>
        <EnglishIcon />
        {t('languages.en')}
      </Option>
    </Select>
  );
};

export default LanguageSwitcher;
