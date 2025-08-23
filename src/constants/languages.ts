import i18n from '@/i18n';

export interface LanguageOption {
  value: string;
  label: string;
}
const LANGUAGE_CODES = [
  { value: "auto", defaultLabel: "自动检测", key: 'languages.auto' },
  { value: "zh", defaultLabel: "中文", key: 'languages.zh' },
  { value: "en", defaultLabel: "英语", key: 'languages.en' },
  { value: "jp", defaultLabel: "日语", key: 'languages.jp' },
  { value: "kor", defaultLabel: "韩语", key: 'languages.kor' },
  { value: "fra", defaultLabel: "法语", key: 'languages.fra' },
  { value: "de", defaultLabel: "德语", key: 'languages.de' },
  { value: "ru", defaultLabel: "俄语", key: 'languages.ru' },
  { value: "spa", defaultLabel: "西班牙语", key: 'languages.spa' },
  { value: "it", defaultLabel: "意大利语", key: 'languages.it' },
  { value: "pt", defaultLabel: "葡萄牙语", key: 'languages.pt' },
  { value: "ara", defaultLabel: "阿拉伯语", key: 'languages.ara' },
  { value: "th", defaultLabel: "泰语", key: 'languages.th' },
  { value: "vie", defaultLabel: "越南语", key: 'languages.vie' },
  { value: "cht", defaultLabel: "繁体中文", key: 'languages.cht' },
  { value: "pl", defaultLabel: "波兰语", key: 'languages.pl' },
  { value: "dan", defaultLabel: "丹麦语", key: 'languages.dan' },
  { value: "nl", defaultLabel: "荷兰语", key: 'languages.nl' },
  { value: "el", defaultLabel: "希腊语", key: 'languages.el' },
  { value: "cs", defaultLabel: "捷克语", key: 'languages.cs' },
  { value: "swe", defaultLabel: "瑞典语", key: 'languages.swe' },
  { value: "fin", defaultLabel: "芬兰语", key: 'languages.fin' },
  { value: "rom", defaultLabel: "罗马尼亚语", key: 'languages.rom' },
  { value: "hu", defaultLabel: "匈牙利语", key: 'languages.hu' },
] as const;

/**
 * 获取国际化的语言选项列表
 * 每次调用时动态获取当前语言的翻译
 */
export const getLanguageOptions = (): readonly LanguageOption[] => {
  return LANGUAGE_CODES.map(({ value, defaultLabel, key }) => ({
    value,
    label: i18n.isInitialized ? i18n.t(key, defaultLabel) : defaultLabel
  }));
};

// 为了向后兼容，保留静态的 LANGUAGE_OPTIONS
export const LANGUAGE_OPTIONS = getLanguageOptions();

/**
 * 常用语言对
 * 用于快速选择常见的翻译方向
 */
export const getCommonLanguagePairs = () => [
  { from: "zh", to: "en", label: i18n.isInitialized ? i18n.t('languagePairs.zhToEn', '中文 → 英语') : '中文 → 英语' },
  { from: "en", to: "zh", label: i18n.isInitialized ? i18n.t('languagePairs.enToZh', '英语 → 中文') : '英语 → 中文' },
  { from: "zh", to: "jp", label: i18n.isInitialized ? i18n.t('languagePairs.zhToJp', '中文 → 日语') : '中文 → 日语' },
  { from: "jp", to: "zh", label: i18n.isInitialized ? i18n.t('languagePairs.jpToZh', '日语 → 中文') : '日语 → 中文' },
  { from: "zh", to: "kor", label: i18n.isInitialized ? i18n.t('languagePairs.zhToKor', '中文 → 韩语') : '中文 → 韩语' },
  { from: "kor", to: "zh", label: i18n.isInitialized ? i18n.t('languagePairs.korToZh', '韩语 → 中文') : '韩语 → 中文' },
] as const;

export const COMMON_LANGUAGE_PAIRS = getCommonLanguagePairs();

/**
 * 获取语言名称
 * @param code 语言代码
 * @returns 语言名称
 */
export const getLanguageName = (code: string): string => {
  const options = getLanguageOptions();
  const option = options.find(opt => opt.value === code);
  return option?.label || code;
};