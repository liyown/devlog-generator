# DevLog Generator 使用指南

## 介绍

DevLog Generator 是一个强大的开发日志生成工具，它能够自动从 Git 提交记录生成结构化的开发日志，并通过多种 AI 服务增强内容质量。本文将详细介绍其使用方法和最佳实践。

## 项目结构

```
devlog-generator/
├── src/                # 源代码
│   ├── commands/       # 命令实现
│   ├── services/       # 服务实现（AI、Git等）
│   ├── templates/      # 模板文件
│   ├── types/         # 类型定义
│   ├── utils/         # 工具函数
│   ├── __tests__/     # 测试文件
│   └── cli.ts         # CLI入口
├── bin/               # 可执行文件
├── dist/              # 编译输出
├── public/            # 日志输出目录
└── docs/              # 文档
```

## 使用场景

1. **项目进度报告**

   - 自动生成每日/每周开发进度报告
   - 整理版本发布说明
   - 生成项目里程碑总结

2. **团队协作**

   - 跟踪团队成员贡献
   - 记录重要技术决策
   - 生成团队周报

3. **文档维护**
   - 自动更新 CHANGELOG
   - 生成技术文档初稿
   - 维护项目进展记录

## 使用示例

### 基础用法

1. **生成简单日志**

```bash
devlog generate
```

2. **指定时间范围**

```bash
devlog generate --since 2024-01-01 --until 2024-03-31
```

3. **指定输出格式**

```bash
devlog generate --format html --output ./reports
```

### 高级用法

1. **使用 AI 增强**

```bash
# 使用 OpenAI
devlog generate --use-ai --ai-interface openai

# 使用 Claude
devlog generate --use-ai --ai-interface claude

# 使用 Gemini
devlog generate --use-ai --ai-interface gemini

# 使用 Kimi
devlog generate --use-ai --ai-interface kimi
```

2. **自定义日志风格**

```bash
# 正式技术风格
devlog generate --style-prompt "Generate formal and technical logs with code examples"

# 简洁风格
devlog generate --style-prompt "Generate concise and clear logs"

# 详细风格
devlog generate --style-prompt "Generate detailed logs with explanations"

# 团队风格
devlog generate --style-prompt "Generate logs in team's preferred style"
```

3. **批量生成**

```bash
devlog generate-batch --config batch-config.json
```

## 最佳实践

### 1. Git 提交规范

为了生成更有意义的日志，建议遵循以下提交规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

- **type**: feat, fix, docs, style, refactor, test, chore
- **scope**: 影响范围
- **subject**: 简短描述
- **body**: 详细描述
- **footer**: 破坏性变更说明

### 2. AI 提示词优化

根据不同场景选择合适的提示词：

- 技术文档：`Generate formal and technical logs with code examples`
- 项目进度：`Generate concise progress reports with key achievements`
- 版本发布：`Generate detailed release notes with features and bug fixes`
- 团队周报：`Generate weekly team progress report with highlights`

### 3. 缓存管理

定期清理缓存以优化性能：

```bash
# 清理所有缓存
devlog clean-cache

# 清理特定时间之前的缓存
devlog clean-cache --before 2024-01-01

# 清理特定AI服务的缓存
devlog clean-cache --ai-interface openai
```

### 4. 配置模板

针对不同项目类型的配置模板：

#### 开源项目

```json
{
  "useAI": true,
  "aiInterface": "gemini",
  "openai": {
    "apiKey": "",
    "model": "gpt-3.5-turbo",
    "stylePrompt": "Generate formal and technical logs"
  },
  "gemini": {
    "apiKey": "your-gemini-api-key",
    "model": "gemini-1.5-flash"
  },
  "logFormat": "markdown",
  "gitLogOptions": {
    "maxCommits": 50,
    "groupSize": 5,
    "groupByTag": true
  },
  "outputDirectory": "./public"
}
```

#### 企业项目

```json
{
  "useAI": true,
  "aiInterface": "claude",
  "claude": {
    "apiKey": "your-claude-api-key",
    "model": "claude-3-opus-20240229"
  },
  "logFormat": "html",
  "gitLogOptions": {
    "maxCommits": 100,
    "groupSize": 10,
    "groupByTag": false
  },
  "outputDirectory": "./reports"
}
```

## 常见问题解答

1. **如何处理大型仓库？**

   - 使用 `maxCommits` 限制提交数量
   - 启用智能缓存
   - 考虑使用批量生成模式
   - 使用时间范围过滤提交记录

2. **如何优化 AI 生成质量？**

   - 提供详细的上下文信息
   - 使用自定义提示词
   - 选择合适的 AI 模型
   - 根据场景选择不同的 AI 服务商

3. **如何集成到 CI/CD？**

   - 使用环境变量配置
   - 设置自动化触发条件
   - 配置输出目录
   - 使用无交互模式运行

4. **如何处理多语言项目？**
   - 配置 `language` 选项
   - 使用适合的 AI 模型
   - 根据需要调整提示词
   - 考虑使用多语言模板

## 贡献指南

我们欢迎社区贡献，您可以通过以下方式参与：

1. 提交 Issue 报告问题
2. 提交 Pull Request 改进代码
3. 完善文档和示例
4. 分享使用经验和最佳实践

详细信息请查看 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 更新日志

请查看 [CHANGELOG.md](CHANGELOG.md) 了解详细的更新历史。
