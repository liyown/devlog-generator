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

# 初始化配置（首次使用需要运行）
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
    "groupByTag": false
  },
  "outputDirectory": "./public"
}
```

### 配置选项说明

#### 基础配置

- `useAI`: (boolean) 是否启用 AI 增强
- `aiInterface`: ("openai" | "claude" | "gemini" | "kimi") AI 服务提供商
- `logFormat`: ("markdown" | "json" | "html") 日志输出格式
- `outputDirectory`: (string) 日志输出目录

#### Git 配置

- `gitLogOptions`:
  - `maxCommits`: (number) 最大提交数量
  - `groupSize`: (number) 分组大小，每组包含的分组单位
  - `groupByTag`: (boolean) 是否按标签分组

#### AI 服务配置

支持的 AI 服务及其配置选项：

##### OpenAI

```json
{
  "openai": {
    "apiKey": "",
    "model": "gpt-3.5-turbo",
    "stylePrompt": "Generate formal and technical logs"
  }
}
```

##### Claude

```json
{
  "claude": {
    "apiKey": "",
    "model": "claude-3-opus-20240229"
  }
}
```

##### Gemini

```json
{
  "gemini": {
    "apiKey": "your-gemini-api-key",
    "model": "gemini-1.5-flash"
  }
}
```

##### Kimi

```json
{
  "kimi": {
    "apiKey": "",
    "model": "moonshot-v1-128k"
  }
}
```

### 环境变量

支持通过环境变量进行配置：

```env
USE_AI=true
AI_INTERFACE=gemini
GEMINI_API_KEY=your-gemini-api-key
LOG_FORMAT=markdown
OUTPUT_DIRECTORY=./public
```

## License

MIT
