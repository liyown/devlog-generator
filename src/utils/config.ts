import { Config } from '../types';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { defaultConfig } from '../templates/defaultConfig';

export function loadConfig(): Config {
  // 1. 加载环境变量（最低优先级）
  dotenv.config();
  let config = { ...defaultConfig };

  // 从环境变量加载配置
  if (process.env.USE_AI !== undefined) {
    config.useAI = process.env.USE_AI === 'true';
  }
  if (process.env.AI_INTERFACE) {
    config.aiInterface = process.env.AI_INTERFACE as Config['aiInterface'];
  }
  if (process.env.LOG_FORMAT) {
    config.logFormat = process.env.LOG_FORMAT as Config['logFormat'];
  }
  if (process.env.OUTPUT_DIRECTORY) {
    config.outputDirectory = process.env.OUTPUT_DIRECTORY;
  }
  if (process.env.MAX_COMMITS) {
    config.gitLogOptions.maxCommits = Number(process.env.MAX_COMMITS);
  }
  if (process.env.INCLUDE_TAGS !== undefined) {
    config.gitLogOptions.includeTags = process.env.INCLUDE_TAGS === 'true';
  }

  // AI 服务配置
  if (process.env.OPENAI_API_KEY && config.openai) {
    config.openai = {
      apiKey: process.env.OPENAI_API_KEY,
      model: config.openai.model || 'gpt-3.5-turbo',
      stylePrompt:
        config.openai.stylePrompt || 'Generate formal and technical logs',
    };
  }
  if (process.env.OPENAI_MODEL && config.openai) {
    config.openai = {
      apiKey: config.openai.apiKey || '',
      model: process.env.OPENAI_MODEL,
      stylePrompt:
        config.openai.stylePrompt || 'Generate formal and technical logs',
    };
  }
  if (process.env.CLAUDE_API_KEY && config.claude) {
    config.claude = {
      apiKey: process.env.CLAUDE_API_KEY,
      model: config.claude.model || 'claude-3-opus-20240229',
    };
  }
  if (process.env.CLAUDE_MODEL && config.claude) {
    config.claude = {
      apiKey: config.claude.apiKey || '',
      model: process.env.CLAUDE_MODEL,
    };
  }
  if (process.env.GEMINI_API_KEY && config.gemini) {
    config.gemini = {
      apiKey: process.env.GEMINI_API_KEY,
      model: config.gemini.model || 'gemini-pro',
    };
  }
  if (process.env.GEMINI_MODEL && config.gemini) {
    config.gemini = {
      apiKey: config.gemini.apiKey || '',
      model: process.env.GEMINI_MODEL,
    };
  }
  if (process.env.KIMI_API_KEY && config.kimi) {
    config.kimi = {
      apiKey: process.env.KIMI_API_KEY,
      model: config.kimi.model || 'moonshot-v1-128k',
    };
  }
  if (process.env.KIMI_MODEL && config.kimi) {
    config.kimi = {
      apiKey: config.kimi.apiKey || '',
      model: process.env.KIMI_MODEL,
    };
  }

  // 2. 加载配置文件（覆盖环境变量）
  const configPath = path.join(process.cwd(), 'devlog.config.json');
  try {
    if (fs.existsSync(configPath)) {
      const configFile = fs.readFileSync(configPath, 'utf-8');
      const fileConfig = JSON.parse(configFile);
      config = { ...config, ...fileConfig };
    }
  } catch (error) {
    console.warn('Failed to load config file');
  }

  return config;
}
