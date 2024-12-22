<h1 align="center">devlog-generator</h1>

<div align="center">

[![Version](https://img.shields.io/badge/version-0.1.0-blue?style=flat-square)](https://github.com/liyown/devlog-generator)
[![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen?style=flat-square)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[![Markdown](https://img.shields.io/badge/Markdown-000000?style=flat-square&logo=markdown&logoColor=white)](https://www.markdownguide.org/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JSON](https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white)](https://www.json.org/)

<h3>🚀 将 Git 提交记录转化为优雅的开发日志，支持 AI 增强和多种输出格式</h3>
</div>

## 📖 简介

`devlog-generator` 是一个强大的开发日志生成工具，它可以：

- 🎯 自动分析 Git 提交记录，生成结构化的开发日志
- 🤖 通过多个 AI 模型优化日志内容，使其更专业、更易读
- 🎨 支持多种输出格式，满足不同场景需求
- ⚡ 简单易用，一键生成，告别手写日志的烦恼

## ✨ 特性

- 🔄 **智能提交分析**
  - 自动识别提交类型（feat/fix/docs等）
  - 智能分组和归类
  - 支持按时间/标签/版本分组
- 🤖 **AI 增强**
  - 支持多个主流 AI 服务
    - OpenAI (GPT-3.5/4)
    - Claude
    - Gemini
    - Kimi
  - 智能优化描述内容
  - 自动补充技术细节
- 📝 **多格式输出**
  - Markdown（适合文档和 Git 仓库）
  - HTML（美观的网页展示）
  - JSON（便于程序处理）
- ⚙️ **高度可定制**
  - 灵活的配置选项
  - 自定义输出模板
  - 支持输出样式定制

## 🚀 快速开始

### 安装

```bash
# 使用 npm
npm install -g devlog-generator

# 使用 yarn
yarn global add devlog-generator

# 使用 pnpm
pnpm add -g devlog-generator
```

### 基础使用

1. 初始化配置：

```bash
devlog init
```

2. 生成日志：

```bash
devlog generate
```

## 📝 输出示例

支持三种格式输出，点击查看示例：

- [📘 Markdown 格式](./public/devlog.markdown)
- [🌐 HTML 格式](./public/devlog.html)
- [📊 JSON 格式](./public/devlog.json)

## ⚙️ 配置

### 配置文件

默认配置文件 `devlog.config.json` 示例：

```json
{
  "useAI": true,
  "aiInterface": "gemini",
  "openai": {
    "apiKey": "",
    "model": "gpt-3.5-turbo",
    "stylePrompt": "Generate formal and technical logs"
  },
  "claude": {
    "apiKey": "",
    "model": "claude-3-opus-20240229"
  },
  "gemini": {
    "apiKey": "your-gemini-api-key",
    "model": "gemini-1.5-flash"
  },
  "kimi": {
    "apiKey": "",
    "model": "moonshot-v1-128k"
  },
  "logFormat": "markdown",
  "gitLogOptions": {
    "maxCommits": 50,
    "groupSize": 5,
    "groupByTag": false,
    "includeTags": false,
    "from": "2024-01-01",
    "to": "2024-12-31"
  },
  "outputDirectory": "./public"
}
```

### 环境变量

也支持通过环境变量进行配置：

```env
USE_AI=true
AI_INTERFACE=gemini
GEMINI_API_KEY=your-gemini-api-key
LOG_FORMAT=markdown
OUTPUT_DIRECTORY=./public
```

## 🤝 贡献

欢迎提交 PR 和 Issue！

## 📄 许可证

[MIT](./LICENSE)

## 🙏 鸣谢

- [OpenAI](https://openai.com/)
- [Anthropic](https://www.anthropic.com/)
- [Google](https://deepmind.google/)
- [Moonshot AI](https://www.moonshot.cn/)
