/**
 * 支持的语言列表
 * 百度翻译API支持的语言代码和名称映射
 */
export interface LanguageOption {
  value: string;
  label: string;
}

/**
 * 语言选项列表
 * 按使用频率排序，常用语言在前
 */
export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { value: "auto", label: "自动检测" },
  { value: "zh", label: "中文" },
  { value: "en", label: "英语" },
  { value: "jp", label: "日语" },
  { value: "kor", label: "韩语" },
  { value: "fra", label: "法语" },
  { value: "de", label: "德语" },
  { value: "ru", label: "俄语" },
  { value: "spa", label: "西班牙语" },
  { value: "it", label: "意大利语" },
  { value: "pt", label: "葡萄牙语" },
  { value: "ara", label: "阿拉伯语" },
  { value: "th", label: "泰语" },
  { value: "vie", label: "越南语" },
  { value: "cht", label: "繁体中文" },
  { value: "pl", label: "波兰语" },
  { value: "dan", label: "丹麦语" },
  { value: "nl", label: "荷兰语" },
  { value: "el", label: "希腊语" },
  { value: "cs", label: "捷克语" },
  { value: "swe", label: "瑞典语" },
  { value: "fin", label: "芬兰语" },
  { value: "rom", label: "罗马尼亚语" },
  { value: "hu", label: "匈牙利语" },
] as const;

/**
 * 常用语言对
 * 用于快速选择常见的翻译方向
 */
export const COMMON_LANGUAGE_PAIRS = [
  { from: "zh", to: "en", label: "中文 → 英语" },
  { from: "en", to: "zh", label: "英语 → 中文" },
  { from: "zh", to: "jp", label: "中文 → 日语" },
  { from: "jp", to: "zh", label: "日语 → 中文" },
  { from: "zh", to: "kor", label: "中文 → 韩语" },
  { from: "kor", to: "zh", label: "韩语 → 中文" },
] as const;

/**
 * 获取语言名称
 * @param code 语言代码
 * @returns 语言名称
 */
export function getLanguageName(code: string): string {
  const language = LANGUAGE_OPTIONS.find(lang => lang.value === code);
  return language?.label || code;
}

/**
 * 检查是否为有效的语言代码
 * @param code 语言代码
 * @returns 是否有效
 */
export function isValidLanguageCode(code: string): boolean {
  return LANGUAGE_OPTIONS.some(lang => lang.value === code);
}

/**
 * 获取除自动检测外的语言选项
 * @returns 语言选项列表（不包含自动检测）
 */
export function getTargetLanguageOptions(): readonly LanguageOption[] {
  return LANGUAGE_OPTIONS.filter(lang => lang.value !== "auto");
}
