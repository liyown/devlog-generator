import { Config } from '../types';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { defaultConfig } from '../templates/defaultConfig';

export function loadConfig(): Config {
  // 1. 加载环境变量（最低优先级）
  let config = { ...defaultConfig };
  const configPath = path.join(process.cwd(), 'devlog.config.json');
  try {
    if (fs.existsSync(configPath)) {
      const configFile = fs.readFileSync(configPath, 'utf-8');
      const fileConfig = JSON.parse(configFile);

      // 合并配置，处理嵌套对象
      config = {
        ...config,
        ...fileConfig,
        openai: {
          ...config.openai,
          ...fileConfig.openai,
        },
        claude: {
          ...config.claude,
          ...fileConfig.claude,
        },
        gemini: {
          ...config.gemini,
          ...fileConfig.gemini,
        },
        kimi: {
          ...config.kimi,
          ...fileConfig.kimi,
        },
        gitLogOptions: {
          ...config.gitLogOptions,
          ...fileConfig.gitLogOptions,
        },
      };
    }
  } catch (error) {
    console.warn('Failed to load config file');
  }

  return config;
}
