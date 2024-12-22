# devlog-generator

[![CI](https://github.com/yourusername/devlog-generator/workflows/CI/badge.svg)](https://github.com/yourusername/devlog-generator/actions)
[![npm](https://img.shields.io/npm/v/devlog-generator)](https://www.npmjs.com/package/devlog-generator)
[![License](https://img.shields.io/npm/l/devlog-generator)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

An NPM tool that automatically generates development logs from Git commit history with AI enhancement capabilities.

English | [简体中文](README.md)

## Project Structure

```
devlog-generator/
├── src/                # Source code
│   ├── commands/       # Command implementations
│   ├── services/       # Service implementations (AI, Git, etc.)
│   ├── templates/      # Template files
│   ├── types/         # Type definitions
│   ├── utils/         # Utility functions
│   ├── __tests__/     # Test files
│   └── cli.ts         # CLI entry point
├── bin/               # Executable files
├── dist/              # Build output
├── public/            # Log output directory
└── docs/              # Documentation
```

## Features

- 🚀 Automatic development log generation from Git commits
- 🤖 Multiple AI service support:
  - OpenAI (GPT-3.5/4)
  - Claude (Anthropic)
  - Gemini (Google)
  - Kimi (Moonshot)
- 📝 Multiple output formats (HTML, Markdown, JSON)
- 🎨 Customizable log styles
- ⚙️ Flexible configuration management
- 💾 Smart caching mechanism
- 🔄 Batch generation support
- 📊 Commit statistics and visualization
- 🌐 Multi-language support
- 🔒 Secure credential management

// ... existing code ...
