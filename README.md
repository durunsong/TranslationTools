<div align="center">
  <img alt="TranslationTools Logo" width="120" height="120" src="./public/logo.png">
  <h1>TranslationTools</h1>
  <span>中文 | <a href="./README.EN.md">English</a></span>
</div>

## 简介

TranslationTools 是一个面向多格式内容的翻译工具，基于 React、TypeScript、Vite 和 Ant Design 构建。它通过代理服务调用百度翻译 API，支持普通文本、扁平 JSON、嵌套 JSON 和 PHP 数组的翻译，并提供复制结果、示例格式查看、文件导出、浅色/深色主题和中英文界面切换。

在线预览：

| 部署平台 | 链接 |
| --- | --- |
| Vercel | [translation-tools.vercel.app](https://translation-tools.vercel.app/) |

## 当前技术栈

主要运行依赖：

- React 19.2
- React DOM 19.2
- Ant Design 6.3
- @ant-design/icons 6.1
- Axios 1.15
- Zustand 5.0
- i18next 26.0
- react-i18next 17.0
- Tailwind CSS 4.2

主要开发依赖：

- Vite 8.0
- TypeScript 6.0
- ESLint 10.2
- @vitejs/plugin-react 6.0
- @tailwindcss/postcss 4.2
- Terser 5.46

## 功能

- 普通文本翻译：适合段落、文案和日常文本。
- 简单 JSON 翻译：适合扁平 key-value 结构的语言包。
- 复杂 JSON 翻译：递归翻译嵌套对象和数组中的字符串，保留原始结构。
- PHP 数组翻译：解析 PHP return array 结构，翻译字符串值后重建 PHP 数组。
- 分块请求：JSON 和 PHP 模式会按文本条目分块请求，降低单次请求过大的风险。
- 文件导出：支持 `js`、`ts`、`jsx`、`tsx`、`json`、`md`、`txt`、`php`、`go`、`java`、`py`、`yaml`。
- 示例格式：每种模式都可以打开示例弹窗查看输入格式。
- 快捷提交：输入框内按 Enter 提交，Shift + Enter 换行。
- 主题与语言：支持浅色/深色主题，以及中文/英文界面切换。
- 本地凭据保存：App ID 和 Key 使用 Zustand persist 保存到 localStorage。

## 环境要求

- Node.js 20 或更高版本
- pnpm 9 或更高版本

## 快速开始

```bash
git clone https://github.com/durunsong/TranslationTools.git
cd TranslationTools
pnpm install
pnpm run dev
```

开发服务默认运行在 `http://localhost:8000`。如果端口被占用，Vite 会自动尝试其他可用端口。

## 配置

项目通过 `src/config/env.ts` 读取 Vite 环境变量：

```bash
VITE_PROXY_API_URL=http://localhost:4500/api/translation/translate
VITE_DEFAULT_APPID=
VITE_DEFAULT_API_KEY=
```

说明：

- `VITE_PROXY_API_URL`：翻译代理服务地址。未设置时默认使用 `http://localhost:4500/api/translation/translate`。
- `VITE_DEFAULT_APPID`：可选的默认百度翻译 App ID。
- `VITE_DEFAULT_API_KEY`：可选的默认百度翻译 Key。

前端不会直接拼接百度翻译签名，而是把 `query`、`from`、`to`、`appid` 和 `apiKey` 发送到代理接口，由代理服务完成实际请求。

代理接口请求示例：

```json
{
  "query": "Hello world",
  "from": "auto",
  "to": "zh",
  "appid": "your-app-id",
  "apiKey": "your-api-key"
}
```

期望响应示例：

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

## 可用脚本

```bash
pnpm run dev
pnpm run build
pnpm run lint
pnpm run preview
```

## 使用流程

1. 在页面顶部输入百度翻译 App ID 和 Key，并点击保存。
2. 选择翻译模式：文本、简单 JSON、复杂 JSON 或 PHP 数组。
3. 选择源语言和目标语言。源语言可使用自动检测。
4. 输入要翻译的内容，必要时点击示例按钮查看格式。
5. 点击直接翻译，或在 JSON/PHP 模式中选择翻译并下载。

## 支持语言

源语言支持自动检测。当前语言列表包括：

中文、英文、日文、韩文、法文、德文、俄文、西班牙文、意大利文、葡萄牙文、阿拉伯文、泰文、越南文、繁体中文、波兰文、丹麦文、荷兰文、希腊文、捷克文、瑞典文、芬兰文、罗马尼亚文、匈牙利文。

## 百度翻译相关链接

- [百度翻译开放平台](https://fanyi-api.baidu.com/)
- [通用翻译 API](https://fanyi-api.baidu.com/api/trans/vip/translate)
- [API 文档](https://api.fanyi.baidu.com/doc/21)

## 注意事项

- 文本模式输入上限为 2000 字符；底层参数校验上限为 6000 字符。
- JSON 模式输入上限为 10000 字符。
- PHP 模式输入上限为 20000 字符。
- 代理请求超时时间为 10 秒。
- 大量文本翻译会受到百度翻译 API 的频率、额度和字符数限制影响。

## License

[MIT](./LICENSE)
