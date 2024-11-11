// 翻译appId 和 apiKey
export interface TextTranslationProps {
  appid?: string | null;
  apiKey?: string | null;
}

// 语言选择器
export interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  showAutoDetect?: boolean; // 是否显示自动检测选项
}

// 文件展示弹窗
export interface ShowFileModelProps {
  open: boolean;
  onCancel: () => void;
  onSuffixSelect: (suffix: string, exportType: string) => void; // 父组件事件，通过确认按钮触发
  toLang?: string; // 选择的目标语言
}
