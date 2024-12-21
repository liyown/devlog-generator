import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { Config } from '../types';
import { defaultConfig } from '../templates/defaultConfig';
import { DevLogError } from '../utils/error';
import chalk from 'chalk';
import ora from 'ora';

const CONFIG_LOCATIONS = {
  PROJECT: 'Project directory (devlog.config.json)',
  HOME: 'User home directory (~/.config/devlog-generator/config.json)',
  CUSTOM: 'Custom location',
};

const AI_PROVIDERS = {
  OPENAI: 'OpenAI',
  CLAUDE: 'Claude',
  GEMINI: 'Gemini',
  KIMI: 'Kimi',
};

const LOG_STYLES = {
  FORMAL: 'Generate formal and technical logs',
  CONCISE: 'Generate concise and informal logs',
  DETAILED: 'Generate detailed and explanatory logs',
  HUMOROUS: 'Generate humorous logs',
  CUSTOM: 'Custom prompt',
};

export async function init(): Promise<void> {
  const spinner = ora('Initializing configuration...').start();

  try {
    // 1. 配置文件位置
    const { configLocation } = await inquirer.prompt([
      {
        type: 'list',
        name: 'configLocation',
        message: 'Where would you like to save the configuration file?',
        default: CONFIG_LOCATIONS.PROJECT,
        choices: Object.values(CONFIG_LOCATIONS),
      },
    ]);

    let configPath = 'devlog.config.json';
    if (configLocation === CONFIG_LOCATIONS.HOME) {
      configPath = path.join(
        process.env.HOME || '~',
        '.config',
        'devlog-generator',
        'config.json'
      );
    } else if (configLocation === CONFIG_LOCATIONS.CUSTOM) {
      const { customPath } = await inquirer.prompt([
        {
          type: 'input',
          name: 'customPath',
          message: 'Enter the path for the configuration file:',
        },
      ]);
      configPath = customPath;
    }

    // 2. AI 启用选项
    const { useAI } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useAI',
        message: 'Enable AI for log generation?',
        default: false,
      },
    ]);

    let aiConfig = {};
    if (useAI) {
      // 3. AI 提供商配置
      const { aiProvider } = await inquirer.prompt([
        {
          type: 'list',
          name: 'aiProvider',
          message: 'Choose AI provider:',
          choices: Object.values(AI_PROVIDERS),
        },
      ]);

      const { apiKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: `Enter your ${aiProvider} API Key:`,
        },
      ]);

      const providerKey = aiProvider.toLowerCase() as
        | 'openai'
        | 'claude'
        | 'gemini'
        | 'kimi';
      const defaultModel =
        defaultConfig[providerKey] && 'model' in defaultConfig[providerKey]
          ? (defaultConfig[providerKey] as { model: string }).model
          : '';

      const { model } = await inquirer.prompt([
        {
          type: 'input',
          name: 'model',
          message: `Enter your ${aiProvider} model:`,
          default: defaultModel,
        },
      ]);

      // 4. 日志风格
      const { logStyle } = await inquirer.prompt([
        {
          type: 'list',
          name: 'logStyle',
          message: 'Choose log style for AI generation:',
          choices: Object.values(LOG_STYLES),
        },
      ]);

      const stylePrompt =
        logStyle === LOG_STYLES.CUSTOM
          ? (
              await inquirer.prompt([
                {
                  type: 'input',
                  name: 'customPrompt',
                  message: 'Enter your custom prompt:',
                },
              ])
            ).customPrompt
          : logStyle;

      aiConfig = {
        useAI: true,
        aiInterface: aiProvider.toLowerCase() as Config['aiInterface'],
        [aiProvider.toLowerCase() as keyof Config]: {
          apiKey,
          model,
          stylePrompt,
        },
      };
    }

    // 5. 日志格式
    const { logFormat } = await inquirer.prompt([
      {
        type: 'list',
        name: 'logFormat',
        message: 'Select the log output format:',
        choices: ['markdown', 'json', 'html'],
        default: 'html',
      },
    ]);

    // 6. 输出目录
    const { outputDir } = await inquirer.prompt([
      {
        type: 'input',
        name: 'outputDirectory',
        message: 'Enter the output directory:',
        default: './public',
      },
    ]);

    // 创建配置
    const config: Config = {
      ...defaultConfig,
      ...aiConfig,
      logFormat,
      outputDirectory: outputDir,
    };

    // 确保目录存在
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // 保存配置
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    spinner.succeed(chalk.green(`Configuration saved to: ${configPath}`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize configuration'));
    if (error instanceof DevLogError) {
      console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
