<div align="center">
  <img alt="TranslationTools Logo" width="120" height="120" src="./public/logo.png">
  <h1>TranslationTools</h1>
  <span><a href="./README.EN.md">English</a> | 中文</span>
</div>

## ⚡ 简介

TranslationTools 是一个基于百度翻译 api 自动化翻译的 React 应用程序，旨在帮助用户轻松翻译文本内容、JSON 内容。它提供了一系列功能，包括文本输入框、翻译按钮、翻译结果展示和语言选择器。用户可以通过输入文本并选择目标语言，然后点击翻译按钮来获取翻译结果。翻译结果将以卡片的形式展示，用户可以方便地查看和复制翻译内容，支持多种文件格式下载。

## 📺 在线预览

| 部署   | 网络要求 | 链接                                              |
| ------ | -------- | ------------------------------------------------- |
| vercel | 绕过大陆 | [点击链接](https://translation-tools.vercel.app/) |

## ❤️ 用爱发电

- **目前这个程序免费**：但希望你点一个 star ！！！
- **非常简洁**：没有复杂的封装，没有复杂的类型体操，开箱即用
- **最新的依赖**: 定期更新所有三方依赖至最新版

## 🧭 特性

- **React18**：采用 React18 + Antd + Tailwindcss + zustand 最新的 React18 特性
- **Ant Design 5.0**：Antd UI 的 5x 版本
- **zustand**: 很简洁的 React 状态管理工具
- **Vite**：真的很快
- **Tsx**：支持 tsx 语法
- **PNPM**：更快速的，节省磁盘空间的包管理工具
- **ESlint**：代码校验
- **Tailwindcss**：最新的 CSS 框架，支持原子化 CSS
- **SWC**：使用 SWC 替代 Babel，提升编译速度
- **兼容移动端**: 布局兼容移动端页面分辨率

## ✨ 功能

- **文本翻译**：用于文本翻译，字符长度自定义
- **简单 JSON 翻译**：简单 JSON 模式适合基础的 JSON 翻译，适合二维 JSON
- **复杂 JSON 翻译**：复杂 JSON 模式适合嵌套结构的 JSON 翻译，适合多维嵌套 JSON

## 🚀 开发

#### 🍇 项目安装

确保你已经安装了 Node.js 和 npm（或者使用 pnpm/yarn）。然后运行以下命令安装项目的依赖项：

```bash
# 配置
1. 一键安装 .vscode 目录中推荐的插件
2. node 版本 20+
3. pnpm 版本 9.x 或最新版

# 克隆项目
git clone https://github.com/durunsong/TranslationTools.git

# 进入项目目录
cd TranslationTools

# 安装依赖
pnpm install

# 启动服务
pnpm run dev
```

### 🥭 线上版本使用方式

1. 打开 [https://translation-tools.vercel.app/](https://translation-tools.vercel.app/)
2. 进入百度翻译开发者中心页面获取百度翻译的 appid 和密钥，具体请看百度翻译 api 文档[翻译文档](https://api.fanyi.baidu.com/doc/21)
3. 将 appid 和密钥填入页面中，点击保存到本地
4. 输入需要翻译的文本，想要翻译成那种语言，点击翻译即可
5. 翻译结果会显示在页面上，点击复制即可复制翻译结果
6. 点击 翻译并且下载 按钮，即可自定义你的翻译文件，并且下载翻译结果
7. 三种数据结构选择，根据你的需求选择，简单 JSON 适合二维 JSON，复杂 JSON 适合多维 JSON，文本翻译适合文本翻译

### 🍅 支持下载的文件格式

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

### 🌍 百度翻译 api

1. [翻译 api](https://fanyi-api.baidu.com/api/trans/vip/translate)
2. [翻译文档](https://api.fanyi.baidu.com/doc/21)
3. [翻译 api 测试](https://fanyi-api.baidu.com/api/trans/product/index)

### 🌎 其他 api 推荐

[deepl 翻译 api](https://www.deepl.com/zh/products/api)

### 🌏 注意事项

- 亚洲国家为了翻译更加准确，使用中文去翻译
- 其他地区用英文翻译更加准确

## 💕 感谢 Star

小项目获取 star 不易，如果你喜欢这个项目的话，欢迎支持一个 star！这是作者持续维护的唯一动力（小声：毕竟是免费的）
