# devlog-generator

- ![CI](https://github.com/yourusername/devlog-generator/workflows/CI/badge.svg)
- ![npm](https://img.shields.io/npm/v/devlog-generator)
- ![License](https://img.shields.io/npm/l/devlog-generator)
- 一个自动生成开发日志的 NPM 工具，支持从 Git 提交记录生成日志，并可通过 AI 增强内容。

## 特性

- 🚀 自动从 Git 提交记录生成开发日志
- 🤖 支持多个 AI 服务（OpenAI、Claude、Gemini、Kimi）
- 📝 多种输出格式（HTML、Markdown、JSON）
- 🎨 可自定义日志风格
- ⚙️ 灵活的配置管理
- 💾 智能缓存机制
- 🔄 批量生成支持

## 安装

```bash
npm install -g devlog-generator
# 或者
yarn global add devlog-generator
```

安装完成后会自动运行配置向导。如果需要重新配置，可以运行：

```bash
devlog init
```

## 快速开始

1. 初始化配置：

```bash
devlog init
```

2. 生成日志：

```bash
devlog generate
```

## 配置

配置文件 `devlog.config.json` 示例：

```json
{
  "useAI": true,
  "aiInterface": "openai",
  "openai": {
    "apiKey": "your-api-key",
    "model": "gpt-4",
    "stylePrompt": "Generate formal and technical logs"
  },
  "logFormat": "html",
  "outputDirectory": "./public",
  "gitLogOptions": {
    "maxCommits": 50,
    "includeTags": false
  }
}
```

## 环境变量

也可以通过环境变量配置：

```env
USE_AI=true
AI_INTERFACE=openai
OPENAI_API_KEY=your-api-key
LOG_FORMAT=html
OUTPUT_DIRECTORY=./public
```

## License

MIT
