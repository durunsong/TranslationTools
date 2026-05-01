import React from "react";
import { Select } from "antd";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const ChineseIcon: React.FC = () => (
  <span
    className="mr-1.5 inline-flex shrink-0 items-center justify-center text-base leading-none"
    aria-hidden
  >
    🇨🇳
  </span>
);

const EnglishIcon: React.FC = () => (
  <span
    className="mr-1.5 inline-flex shrink-0 items-center justify-center text-base leading-none"
    aria-hidden
  >
    🇺🇸
  </span>
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
      className="language-switcher"
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
