<div align="center">
  <img alt="TranslationTools Logo" width="120" height="120" src="./public/logo.png">
  <h1>TranslationTools</h1>
  <span><a href="./README.EN.md">English</a> | <a href="./README.md">中文</a></span>
</div>

## ⚡ Introduction

TranslationTools is a modern multi-format translation tool built with React 18 + TypeScript, supporting intelligent translation for text, JSON, PHP arrays, and more. Powered by Baidu Translation API for high-quality translation services, it features an intuitive user interface, rich format support, and convenient file export functionality. Whether for developers' internationalization needs or daily text translation tasks, it provides efficient solutions.

## 📺 Online Preview

| Deployment | network requirement    | Link                                                               |
| ---------- | ---------------------- | ------------------------------------------------------------------ |
| vercel     | Bypassing the mainland | [Click on the link to view](https://translation-tools.vercel.app/) |

## ❤️ Community Support

- **Free to use**: But please give it a star if you like it!
- **Super simple**: No complex wrappers, no type gymnastics, ready to use out of the box
- **Updated dependencies**: All third-party dependencies are regularly updated
- **Contact WX**: For full source code with complete copyrights, contact WX: DU2603948701

## 🧭 Technical Features

### 🎯 Frontend Architecture
- **React 18**: Built with the latest React 18 features, supporting concurrent rendering and automatic batching
- **TypeScript**: Complete type safety support, enhancing development experience and code quality
- **Ant Design 5.24**: Modern UI component library with theme customization and dark mode support
- **Zustand**: Lightweight state management, clean and efficient global state solution
- **TailwindCSS**: Atomic CSS framework for rapid responsive interface development

### ⚡ Build Tools
- **Vite 5.4**: Lightning-fast development server and build tool
- **SWC**: Using SWC instead of Babel for significantly improved compilation speed
- **ESLint**: Code quality checks and standard enforcement
- **PNPM**: Efficient package manager that saves disk space

### 📱 User Experience
- **Responsive Design**: Perfect adaptation for desktop, tablet, and mobile devices
- **Dark Theme**: Support for light/dark theme switching to protect eyesight
- **Internationalization**: Interface supports multiple language switching
- **Accessibility**: Follows WCAG standards, supports keyboard navigation and screen readers

## ✨ Core Features

### 📝 Multi-Format Translation Support
- **Text Translation**: Support for plain text translation with customizable character length limits, suitable for daily text processing
- **Simple JSON Translation**: Designed for flat-structure JSON, perfect for basic key-value pair translation
- **Complex JSON Translation**: Support for multi-level nested JSON structures with intelligent parsing and reconstruction
- **PHP Array Translation**: Native support for PHP array syntax with automatic format detection and structure integrity

### 🎨 Intelligent User Interface
- **Example Format Viewer**: Each mode provides detailed format examples and usage instructions
- **Real-time Input Hints**: Smart placeholder prompts to reduce learning curve
- **One-click Copy**: Translation results support one-click copying for improved efficiency
- **Automatic Format Detection**: Intelligently recognizes input format and selects optimal translation mode

### 📁 File Export Features
- **Multi-format Download**: Support for 13 file formats including JSON, JS, TS, PHP, YAML
- **Custom Export**: Optional ES6 module syntax export
- **Batch Processing**: Support for large file chunked translation to avoid API limitations
- **Format Preservation**: Maintain original data structure and formatting after translation

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

### 🍉后端代理服务 Nodejs+express
 后端地址： https://kilyicms-server.vercel.app
``json
接口：/api/translation/translate
请求方式：post
请求body参数：
{
 "query"： "This is a translation program that can translate various languages./nit supports text translation in multiple formats./nHello World!/nWelcome to our application.",
 "from"： "auto",
 "to"： "zh",
 "appid"： "xxxxxxx",
 "apiKey"： "xxxxxxxx".
}
```

### 🥭 User Guide

#### 🔧 Quick Start
1. **Access Application**: Open [https://translation-tools.vercel.app/](https://translation-tools.vercel.app/)
2. **Configure API**:
   - Visit [Baidu Translation Developer Center](https://fanyi-api.baidu.com/manage/developer)
   - Create an application to get App ID and secret key
   - Enter App ID and key at the top of the page, click "Save to Local"

#### 📋 Translation Process
1. **Select Mode**: Choose appropriate translation mode based on content type
   - 📝 **Text Mode**: Suitable for plain text, paragraphs, articles
   - 📄 **Simple JSON**: Suitable for flat-structure config files, language packs
   - 🔗 **Complex JSON**: Suitable for multi-level nested API responses, config files
   - 🐘 **PHP Array**: Suitable for PHP language packs, configuration arrays

2. **View Examples**: Click "👁 View Example Format" to understand input format requirements

3. **Input Content**: Enter content to be translated in the text box, supporting:
   - Automatic format detection and correction
   - Real-time character counting
   - Syntax error prompts

4. **Select Languages**:
   - Source language supports automatic detection
   - Target language supports 20+ mainstream languages

5. **Execute Translation**:
   - **Direct Translation**: View results on the page
   - **Translate and Download**: Select file format and download

#### 💡 Advanced Features
- **Batch Translation**: Large files automatically chunked to avoid API limitations
- **Format Preservation**: Maintain original indentation and structure after translation
- **Error Handling**: Smart error prompts and format correction suggestions
- **Theme Switching**: Support light/dark themes for different usage environments

### 🍄 Supported Language Translations

- Support automatic detection of source language
- Support Chinese, English, German, French, Japanese, Korean, Russian, Polish, Danish, Latin, Dutch, Portuguese, Thai, Italian, Greek, Arabic, Spanish, Czech, Swedish, Traditional Chinese, Irish, Finnish, Romanian, Vietnamese, Hungarian, Indonesian, Hmong, Norwegian, Turkish Language Translation

### 🍅 Supported File Formats

#### 📁 Frontend Development
- **JSON** - Standard JSON format, suitable for config files and data exchange
- **JS** - JavaScript modules with ES6 export syntax support
- **TS** - TypeScript modules with type definitions
- **JSX** - React JSX component format
- **TSX** - TypeScript JSX component format
- **Vue** - Vue.js single file component format

#### 🔧 Backend Development
- **PHP** - PHP array format, maintaining native syntax
- **JAVA** - Java Properties or Map format
- **GO** - Go language Map or Struct format
- **PY** - Python dictionary format

#### 📄 Universal Formats
- **TEXT** - Plain text format
- **MARKDOWN** - Markdown document format
- **YAML** - YAML configuration file format

### 🌍Baidu Translation API

1. [Translation API](https://fanyi-api.baidu.com/api/trans/vip/translate)
2. [API Documentation](https://api.fanyi.baidu.com/doc/21)
3. [API Testing](https://fanyi-api.baidu.com/api/trans/product/index)

### 🌎Other Recommended APIs

[DeepL Translation API](https://www.deepl.com/zh/products/api)

### 🌏 Usage Tips

#### 🎯 Translation Quality Optimization
- **Source Language Selection**:
  - Asian region content: Recommend using Chinese as source language
  - European/American region content: Recommend using English as source language
  - When uncertain: Choose "Auto Detect" for intelligent recognition

#### 📝 Format Processing Tips
- **JSON Format Standardization**:
  ```js
  // ❌ Non-standard format (will be auto-fixed)
  const data = {
    name: 'John',      // Single quotes
    age: 18,           // Number
    gender: "male",    // Mixed quotes
  };
  
  // ✅ Standard format (recommended)
  {
    "name": "John",
    "age": "18",
    "gender": "male"
  }
  ```

- **PHP Array Format**:
  ```php
  <?php
  return [
      'user' => [
          'name' => 'Username',
          'email' => 'Email Address'
      ]
  ];
  ?>
  ```

#### ⚡ Performance Optimization Tips
- **Large File Processing**: Files over 1000 lines will be automatically chunked
- **Network Optimization**: Recommend using in stable network environment
- **API Limitations**: Be aware of Baidu Translation API call frequency limits

#### 🔧 Common Issue Solutions
- **Format Errors**: Use "View Example Format" feature to understand correct format
- **Translation Failures**: Check network connection and API key configuration
- **Abnormal Results**: Try adjusting source language settings or segmented translation

## 💕 Thanks for the Star

It's not easy for small projects to get stars, so if you like this project, please support it with a star! It's the author's primary motivation to keep maintaining it (whisper: after all, it's free).
