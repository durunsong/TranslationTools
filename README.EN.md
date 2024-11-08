<div align="center">
  <img alt="TranslationTools Logo" width="120" height="120" src="./public/logo.png">
  <h1>TranslationTools</h1>
  <span><a href="./README.md">English</a> | 中文</span>
</div>

## ⚡ Introduction

TranslationTools is a React-based application that automates text translation using the Baidu Translation API, designed to help users translate content with ease. It offers a range of features, including a text input box, translation button, translation result display, and language selector. Users can input text, select the target language, and click the translation button to get the result. The result is displayed in a card format, allowing users to view and copy it easily and download it in multiple file formats.

## 📺 Online Preview

| Deployment | network requirement    | Link                                                               |
| ---------- | ---------------------- | ------------------------------------------------------------------ |
| vercel     | Bypassing the mainland | [Click on the link to view](https://translation-tools.vercel.app/) |

## ❤️ Community Support

- **Free to use**: But please give it a star if you like it!
- **Super simple**: No complex wrappers, no type gymnastics, ready to use out of the box
- **Updated dependencies**: All third-party dependencies are regularly updated
- **Contact WX**: For full source code with complete copyrights, contact WX: DU2603948701

## 🧭 Features

- **React 18**: Built with React 18 + Antd + TailwindCSS + Zustand, leveraging the latest React 18 features
- **Ant Design 5.0**: Using version 5.x of Ant Design UI
- **Zustand**: Simple and clean state management tool for React
- **Vite**: Extremely fast
- **TSX Support**: Supports TSX syntax
- **PNPM**: A faster, disk space-efficient package manager
- **ESlint**: For code quality checks
- **TailwindCSS**: Latest CSS framework
- **SWC**: Compiling with SWC instead of Babel for improved build speed
- **Mobile Compatibility**: Responsive design for mobile resolutions

## ✨ Features

- **Text Translation**: Translate text with custom character length
- **Simple JSON Translation**: Suitable for basic JSON translation (2D JSON)
- **Complex JSON Translation**: Complex JSON patterns are suitable for JSON translation of nested structures and for multi-dimensional nested JSON

## 🚀 Development

### 🍇Project Setup

Ensure you have Node.js and npm (or pnpm/yarn) installed. Then, install the project dependencies by running the following commands:

```bash
# Setup
1. Install the recommended plugins in the .vscode folder with one click
2. Node version 20+
3. PNPM version 9.x or the latest

# Clone the project
git clone https://github.com/durunsong/TranslationTools.git

# Enter the project directory
cd TranslationTools

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

### 🥭How to Use the Online Version

1. Open [https://translation-tools.vercel.app/](https://translation-tools.vercel.app/)
2. Go to the Baidu Translation Developer Center to obtain your Baidu translation app ID and secret key. Refer to the [Baidu Translation API Documentation](https://api.fanyi.baidu.com/doc/21) for details.
3. Enter the app ID and key on the page, and click "Save to Local".
4. Input the text you want to translate and select the target language, then click "Translate".
5. The translation result will appear on the page. Click "Copy" to copy the result.
6. Click the "Translate and Download" button to customize your translation file and download the result.
7. Choose from three data structure options based on your needs: Simple JSON for 2D JSON, Complex JSON for multi-dimensional JSON, and Text Translation for plain text.

### 🍄 Supported Language Translations
- Support automatic detection of source language
- Support Chinese, English, German, French, Japanese, Korean, Russian, Polish, Danish, Latin, Dutch, Portuguese, Thai, Italian, Greek, Arabic, Spanish, Czech, Swedish, Traditional Chinese, Irish, Finnish, Romanian, Vietnamese, Hungarian, Indonesian, Hmong, Norwegian, Turkish Language Translation

### 🍅Supported file formats for downloading

- **JSON**
- **TS**
- **JS**
- **TEXT**
- **MARKDOWN**
- **TSX**
- **JSX**
- **Vue**
- **PHP**
- **JAVA**
- **GO**
- **YAML**
- **PY**

### 🌍Baidu Translation API

1. [Translation API](https://fanyi-api.baidu.com/api/trans/vip/translate)
2. [API Documentation](https://api.fanyi.baidu.com/doc/21)
3. [API Testing](https://fanyi-api.baidu.com/api/trans/product/index)

### 🌎Other Recommended APIs

[DeepL Translation API](https://www.deepl.com/zh/products/api)

### 🌏Notes

- For Asian countries, use Chinese as the source language for more accurate translations.
- For other regions, using English as the source language yields better accuracy.

## 💕 Thanks for the Star

It's not easy for small projects to get stars, so if you like this project, please support it with a star! It's the author’s primary motivation to keep maintaining it (whisper: after all, it’s free).
