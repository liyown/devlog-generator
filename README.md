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

### 配置选项说明

#### 基础配置

- `useAI`: (boolean) 是否启用 AI 增强
- `aiInterface`: ("openai" | "claude" | "gemini" | "kimi") AI 服务提供商
- `logFormat`: ("markdown" | "json" | "html") 日志输出格式
- `outputDirectory`: (string) 日志输出目录

#### Git 配置

- `gitLogOptions`:
  - `maxCommits`: (number) 最大提交数量
  - `includeTags`: (boolean) 是否包含标签信息

#### AI 服务配置

##### OpenAI

- `openai`:
  - `apiKey`: OpenAI API 密钥
  - `model`: 可选值：
    - "gpt-4"
    - "gpt-4-turbo-preview"
    - "gpt-3.5-turbo"
  - `stylePrompt`: 自定义提示词

##### Claude

- `claude`:
  - `apiKey`: Claude API 密钥
  - `model`: 可选值：
    - "claude-3-opus-20240229"
    - "claude-3-sonnet-20240229"
    - "claude-3-haiku-20240307"

##### Gemini

- `gemini`:
  - `apiKey`: Gemini API 密钥
  - `model`: 可选值：
    - "gemini-pro"
    - "gemini-pro-vision"

##### Kimi

- `kimi`:
  - `apiKey`: Kimi API 密钥
  - `model`: 可选值：
    - "moonshot-v1-8k"
    - "moonshot-v1-32k"
    - "moonshot-v1-128k"

#### 日志样式

可以通过 `stylePrompt` 自定义生成的日志风格：

- "Generate formal and technical logs"（默认）
- "Generate concise and clear logs"
- "Generate detailed and comprehensive logs"
- "Generate logs with examples and explanations"
- 或者自定义提示词

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
