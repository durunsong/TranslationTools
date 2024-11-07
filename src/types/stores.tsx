// store中翻译appId 和 apiKey
export interface CredentialsStore {
  appid: string | undefined;
  apiKey: string | undefined;
  setCredentials: (appid: string, apiKey: string) => void;
}

// store中主题模式字段
export interface ThemeStore {
  themeMode: string;
  setThemeMode: (mode: string) => void;
}

