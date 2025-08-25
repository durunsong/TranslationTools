<div align="center">
  <img alt="TranslationTools Logo" width="120" height="120" src="./public/logo.png">
  <h1>TranslationTools</h1>
  <span><a href="./README.EN.md">English</a> | 中文</span>
</div>

## ⚡ 简介

TranslationTools 是一个现代化的多格式翻译工具，基于 React 18 + TypeScript 构建，支持文本、JSON、PHP 数组等多种格式的智能翻译。采用百度翻译 API 提供高质量翻译服务，具备直观的用户界面、丰富的格式支持和便捷的文件导出功能。无论是开发者的国际化需求，还是日常的文本翻译工作，都能提供高效的解决方案。

## 📺 在线预览

| 部署   | 网络要求 | 链接                                              |
| ------ | -------- | ------------------------------------------------- |
| vercel | 绕过大陆 | [点击链接](https://translation-tools.vercel.app/) |

## ❤️ 用爱发电

- **目前这个程序免费**：但希望你点一个 star ！！！
- **非常简洁**：没有复杂的封装，没有复杂的类型体操，开箱即用
- **最新的依赖**: 定期更新所有三方依赖至最新版

## 🧭 技术特性

### 🎯 前端架构
- **React 18**：采用最新的 React 18 特性，支持并发渲染和自动批处理
- **TypeScript**：完整的类型安全支持，提升开发体验和代码质量
- **Ant Design 5.24**：现代化的 UI 组件库，支持主题定制和暗色模式
- **Zustand**：轻量级状态管理，简洁高效的全局状态解决方案
- **TailwindCSS**：原子化 CSS 框架，快速构建响应式界面

### ⚡ 构建工具
- **Vite 5.4**：极速的开发服务器和构建工具
- **SWC**：使用 SWC 替代 Babel，显著提升编译速度
- **ESLint**：代码质量检查和规范统一
- **PNPM**：高效的包管理工具，节省磁盘空间

### 📱 用户体验
- **响应式设计**：完美适配桌面端、平板和移动端
- **暗色主题**：支持明暗主题切换，保护视力
- **国际化支持**：界面支持多语言切换
- **无障碍访问**：遵循 WCAG 标准，支持键盘导航和屏幕阅读器

## ✨ 核心功能

### 📝 多格式翻译支持
- **文本翻译**：支持纯文本翻译，自定义字符长度限制，适合日常文本处理
- **简单 JSON 翻译**：专为扁平结构 JSON 设计，适合基础的键值对翻译
- **复杂 JSON 翻译**：支持多层嵌套 JSON 结构，智能解析和重构复杂数据
- **PHP 数组翻译**：原生支持 PHP 数组语法，自动检测格式并保持结构完整性

### 🎨 智能用户界面
- **示例格式查看**：每种模式都提供详细的格式示例和使用说明
- **实时输入提示**：智能的 placeholder 提示，降低学习成本
- **一键复制功能**：翻译结果支持一键复制，提升工作效率
- **格式自动检测**：智能识别输入格式，自动选择最佳翻译模式

### 📁 文件导出功能
- **多格式下载**：支持 JSON、JS、TS、PHP、YAML 等 13 种文件格式
- **自定义导出**：可选择是否使用 ES6 模块语法导出
- **批量处理**：支持大文件分块翻译，避免 API 限制
- **格式保持**：翻译后保持原有的数据结构和格式

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

### 🍉后端代理服务 Nodejs+express
  后端地址： https://kilyicms-server.vercel.app
```json
接口：/api/translation/translate
请求方式：post
请求body参数：
{
    "query": "This is a translation program that can translate various languages.\nIt supports text translation in multiple formats.\nHello World!\nWelcome to our application.",
    "from": "auto",
    "to": "zh",
    "appid": "xxxxxx",
    "apiKey": "xxxxxxxx"
}
```

### 🥭 使用指南

#### 🔧 快速开始
1. **访问应用**：打开 [https://translation-tools.vercel.app/](https://translation-tools.vercel.app/)
2. **配置 API**：
   - 访问 [百度翻译开发者中心](https://fanyi-api.baidu.com/manage/developer)
   - 创建应用获取 App ID 和密钥
   - 在页面顶部输入 App ID 和密钥，点击"保存到本地"

#### 📋 翻译流程
1. **选择模式**：根据内容类型选择合适的翻译模式
   - 📝 **文本模式**：适合纯文本、段落、文章翻译
   - 📄 **简单 JSON**：适合扁平结构的配置文件、语言包
   - 🔗 **复杂 JSON**：适合多层嵌套的 API 响应、配置文件
   - 🐘 **PHP 数组**：适合 PHP 语言包、配置数组

2. **查看示例**：点击"👁 点击查看案例格式"了解输入格式要求

3. **输入内容**：在文本框中输入待翻译内容，支持：
   - 自动格式检测和修正
   - 实时字符计数
   - 语法错误提示

4. **选择语言**：
   - 源语言支持自动检测
   - 目标语言支持 20+ 种主流语言

5. **执行翻译**：
   - **直接翻译**：在页面查看结果
   - **翻译并下载**：选择文件格式并下载

#### 💡 高级功能
- **批量翻译**：大文件自动分块处理，避免 API 限制
- **格式保持**：翻译后保持原有缩进和结构
- **错误处理**：智能的错误提示和格式修复建议
- **主题切换**：支持明暗主题，适应不同使用环境

### 🍄 支持的语言翻译

- 支持源语言的自动检测
- 支持中文、英语、德语、法语、日语、韩语、俄语、波兰语、丹麦语、拉丁语、荷兰语、葡萄牙语、泰语、意大利语、希腊语、阿拉伯语、西班牙语、捷克语、瑞典语、繁体中文、爱尔兰语、芬兰语、罗马尼亚语、越南语、匈牙利语、印尼语、苗语、挪威语、土耳其语 语言翻译

### 🍅 支持的文件格式

#### 📁 前端开发
- **JSON** - 标准 JSON 格式，适合配置文件和数据交换
- **JS** - JavaScript 模块，支持 ES6 导出语法
- **TS** - TypeScript 模块，包含类型定义
- **JSX** - React JSX 组件格式
- **TSX** - TypeScript JSX 组件格式
- **Vue** - Vue.js 单文件组件格式

#### 🔧 后端开发
- **PHP** - PHP 数组格式，保持原生语法
- **JAVA** - Java Properties 或 Map 格式
- **GO** - Go 语言 Map 或 Struct 格式
- **PY** - Python 字典格式

#### 📄 通用格式
- **TEXT** - 纯文本格式
- **MARKDOWN** - Markdown 文档格式
- **YAML** - YAML 配置文件格式

### 🌍 百度翻译 api

1. [翻译 api](https://fanyi-api.baidu.com/api/trans/vip/translate)
2. [翻译文档](https://api.fanyi.baidu.com/doc/21)
3. [翻译 api 测试](https://fanyi-api.baidu.com/api/trans/product/index)

### 🌎 其他 api 推荐

[deepl 翻译 api](https://www.deepl.com/zh/products/api)

### 🌏 使用技巧

#### 🎯 翻译质量优化
- **源语言选择**：
  - 亚洲地区内容：建议使用中文作为源语言
  - 欧美地区内容：建议使用英文作为源语言
  - 不确定时：选择"自动检测"让系统智能识别

#### 📝 格式处理技巧
- **JSON 格式规范化**：
  ```js
  // ❌ 非标准格式（会自动修复）
  const data = {
    name: '张三',    // 单引号
    age: 18,        // 数字
    gender: "男",   // 混合引号
  };
  
  // ✅ 标准格式（推荐）
  {
    "name": "张三",
    "age": "18",
    "gender": "男"
  }
  ```

- **PHP 数组格式**：
  ```php
  <?php
  return [
      'user' => [
          'name' => '用户名',
          'email' => '邮箱地址'
      ]
  ];
  ?>
  ```

#### ⚡ 性能优化建议
- **大文件处理**：超过 1000 行的文件会自动分块处理
- **网络优化**：建议在网络稳定的环境下使用
- **API 限制**：注意百度翻译 API 的调用频率限制

#### 🔧 常见问题解决
- **格式错误**：使用"查看案例格式"功能了解正确格式
- **翻译失败**：检查网络连接和 API 密钥配置
- **结果异常**：尝试调整源语言设置或分段翻译

## 💕 感谢 Star

小项目获取 star 不易，如果你喜欢这个项目的话，欢迎支持一个 star！这是作者持续维护的唯一动力（小声：毕竟是免费的）
