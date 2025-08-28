/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROXY_API_URL: string
  readonly VITE_DEFAULT_APPID: string
  readonly VITE_DEFAULT_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
