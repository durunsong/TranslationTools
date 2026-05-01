<div align="center">
  <img alt="TranslationTools Logo" width="120" height="120" src="./public/logo.png">
  <h1>TranslationTools</h1>
  <span><a href="./README.md">中文</a> | English</span>
</div>

## Introduction

TranslationTools is a multi-format translation tool built with React, TypeScript, Vite, and Ant Design. It calls the Baidu Translate API through a proxy service and supports plain text, flat JSON, nested JSON, and PHP array translation. It also includes result copying, example format dialogs, file export, light/dark themes, and Chinese/English UI switching.

Online preview:

| Platform | Link |
| --- | --- |
| Vercel | [translation-tools.vercel.app](https://translation-tools.vercel.app/) |

## Current Stack

Main runtime dependencies:

- React 19.2
- React DOM 19.2
- Ant Design 6.3
- @ant-design/icons 6.1
- Axios 1.15
- Zustand 5.0
- i18next 26.0
- react-i18next 17.0
- Tailwind CSS 4.2

Main development dependencies:

- Vite 8.0
- TypeScript 6.0
- ESLint 10.2
- @vitejs/plugin-react 6.0
- @tailwindcss/postcss 4.2
- Terser 5.46

## Features

- Plain text translation for paragraphs, copy, and daily text.
- Simple JSON translation for flat key-value language files.
- Complex JSON translation that recursively translates strings in nested objects and arrays while preserving structure.
- PHP array translation that parses `return [...]` files, translates string values, and rebuilds PHP output.
- Chunked requests for JSON and PHP modes to reduce oversized single requests.
- File export for `js`, `ts`, `jsx`, `tsx`, `json`, `md`, `txt`, `php`, `go`, `java`, `py`, and `yaml`.
- Example dialogs for every translation mode.
- Keyboard submit: Enter submits, Shift + Enter inserts a new line.
- Light/dark theme switching and Chinese/English UI switching.
- Local credential persistence through Zustand persist and localStorage.

## Requirements

- Node.js 20 or later
- pnpm 9 or later

## Quick Start

```bash
git clone https://github.com/durunsong/TranslationTools.git
cd TranslationTools
pnpm install
pnpm run dev
```

The dev server defaults to `http://localhost:8000`. If the port is already in use, Vite will try another available port.

## Configuration

The app reads Vite environment variables from `src/config/env.ts`:

```bash
VITE_PROXY_API_URL=http://localhost:4500/api/translation/translate
VITE_DEFAULT_APPID=
VITE_DEFAULT_API_KEY=
```

Details:

- `VITE_PROXY_API_URL`: translation proxy URL. The default is `http://localhost:4500/api/translation/translate`.
- `VITE_DEFAULT_APPID`: optional default Baidu Translate App ID.
- `VITE_DEFAULT_API_KEY`: optional default Baidu Translate API key.

The frontend does not build the Baidu Translate signature directly. It sends `query`, `from`, `to`, `appid`, and `apiKey` to the proxy endpoint, and the proxy handles the actual Baidu request.

Proxy request example:

```json
{
  "query": "Hello world",
  "from": "auto",
  "to": "zh",
  "appid": "your-app-id",
  "apiKey": "your-api-key"
}
```

Expected response example:

```json
{
  "success": true,
  "data": {
    "from": "en",
    "to": "zh",
    "result": "你好，世界",
    "trans_result": [
      {
        "src": "Hello world",
        "dst": "你好，世界"
      }
    ]
  }
}
```

## Scripts

```bash
pnpm run dev
pnpm run build
pnpm run lint
pnpm run preview
```

## Usage

1. Enter your Baidu Translate App ID and Key at the top of the page, then save them.
2. Choose a translation mode: Text, Simple JSON, Complex JSON, or PHP Array.
3. Select source and target languages. Source language supports auto detect.
4. Enter the content to translate. Use the example button if you need format guidance.
5. Click direct translate, or use translate and download in JSON/PHP modes.

## Supported Languages

The source language supports auto detect. The current language list includes:

Chinese, English, Japanese, Korean, French, German, Russian, Spanish, Italian, Portuguese, Arabic, Thai, Vietnamese, Traditional Chinese, Polish, Danish, Dutch, Greek, Czech, Swedish, Finnish, Romanian, and Hungarian.

## Baidu Translate Links

- [Baidu Translate Open Platform](https://fanyi-api.baidu.com/)
- [General Translation API](https://fanyi-api.baidu.com/api/trans/vip/translate)
- [API Documentation](https://api.fanyi.baidu.com/doc/21)

## Notes

- Text mode input is limited to 2000 characters; the shared service validator allows up to 6000 characters.
- JSON mode input is limited to 10000 characters.
- PHP mode input is limited to 20000 characters.
- Proxy requests time out after 10 seconds.
- Large translations are still subject to Baidu Translate API rate, quota, and character limits.

## License

[MIT](./LICENSE)
