import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { Config } from '../types';
import { defaultConfig } from '../templates/defaultConfig';
import { DevLogError } from '../utils/error';
import chalk from 'chalk';

// 添加类型定义
type LogFormat = 'markdown' | 'json' | 'html';
type AIProvider = 'OpenAI' | 'Claude' | 'Gemini' | 'Kimi';
type LogStyle = 'Formal' | 'Concise' | 'Detailed' | 'Custom';

export async function init(): Promise<void> {
  // 在函数开始时设置环境变量
  process.env.NODE_NO_WARNINGS = '1';

  try {
    console.log(chalk.cyan('Initializing configuration...\n'));

    // 1. 配置文件路径
    const configPath = 'devlog.config.json';

    // 2. AI 配置
    const useAI = await confirmPrompt('Enable AI for log generation?');

    let aiConfig = {};
    if (useAI) {
      // 选择 AI 提供商
      const aiProvider = await selectPrompt<AIProvider>('Choose AI provider:', [
        'OpenAI',
        'Claude',
        'Gemini',
        'Kimi',
      ]);

      // 输入 API Key
      const apiKey = await inputPrompt(
        `Enter your ${aiProvider} API Key:`,
        true
      );

      // 选择模型
      const model = await inputPrompt(
        `Enter your ${aiProvider} model:`,
        false,
        getDefaultModel(aiProvider)
      );

      // 选择日志风格
      const logStyle = await selectPrompt<LogStyle>('Choose log style:', [
        'Formal',
        'Concise',
        'Detailed',
        'Custom',
      ]);

      const stylePrompt =
        logStyle === 'Custom'
          ? await inputPrompt('Enter your custom prompt:', false)
          : getDefaultPrompt(logStyle);

      aiConfig = {
        useAI: true,
        aiInterface: aiProvider.toLowerCase(),
        [aiProvider.toLowerCase()]: {
          apiKey,
          model,
          stylePrompt,
        },
      };
    }

    // 3. 日志格式
    const logFormat = await selectPrompt<LogFormat>(
      'Select log output format:',
      ['markdown', 'json', 'html'],
      'html'
    );

    // 4. 输出目录
    const outputDir = await inputPrompt(
      'Enter output directory:',
      false,
      './public'
    );

    // 创建配置
    const config: Config = {
      ...defaultConfig,
      ...aiConfig,
      logFormat,
      outputDirectory: outputDir,
    };

    // 保存配置
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(chalk.green(`\nConfiguration saved to: ${configPath}`));
  } catch (error) {
    console.error(chalk.red('\nFailed to initialize configuration'));
    if (error instanceof DevLogError) {
      console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// 辅助函数
async function confirmPrompt(message: string): Promise<boolean> {
  const { value } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'value',
      message,
      default: false,
      prefix: ' ',
      suffix: ' ',
    },
  ]);
  return value;
}

async function selectPrompt<T extends string>(
  message: string,
  choices: T[],
  defaultValue?: T
): Promise<T> {
  const { value } = await inquirer.prompt([
    {
      type: 'list',
      name: 'value',
      message,
      choices,
      default: defaultValue,
    },
  ]);
  return value;
}

async function inputPrompt(
  message: string,
  isPassword: boolean,
  defaultValue?: string
): Promise<string> {
  const { value } = await inquirer.prompt([
    {
      type: isPassword ? 'password' : 'input',
      name: 'value',
      message,
      default: defaultValue,
    },
  ]);
  return value;
}

function getDefaultModel(provider: AIProvider): string {
  const models: Record<AIProvider, string> = {
    OpenAI: 'gpt-3.5-turbo',
    Claude: 'claude-3-opus-20240229',
    Gemini: 'gemini-pro',
    Kimi: 'moonshot-v1-128k',
  };
  return models[provider];
}

function getDefaultPrompt(style: Exclude<LogStyle, 'Custom'>): string {
  const prompts: Record<Exclude<LogStyle, 'Custom'>, string> = {
    Formal: 'Generate formal and technical logs',
    Concise: 'Generate concise and clear logs',
    Detailed: 'Generate detailed and comprehensive logs',
  };
  return prompts[style];
}
