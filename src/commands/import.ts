import fs from "fs";
import path from "path";
import { Config } from "../types";
import { defaultConfig } from "../templates/defaultConfig";
import { DevLogError } from "../utils/error";
import chalk from "chalk";
import ora from "ora";
import dotenv from "dotenv";

interface ImportOptions {
  file: string;
  merge?: boolean;
}

export async function importConfig(options: ImportOptions): Promise<void> {
  const spinner = ora("Importing configuration...").start();

  try {
    let importedConfig: Partial<Config> = {};
    const configPath = path.join(process.cwd(), "devlog.config.json");

    // 根据文件扩展名决定如何解析
    if (options.file.endsWith(".env")) {
      const envConfig = dotenv.parse(fs.readFileSync(options.file));
      importedConfig = {
        useAI: envConfig.USE_AI === "true",
        aiInterface: envConfig.AI_INTERFACE as Config["aiInterface"],
        openai: envConfig.OPENAI_API_KEY
          ? {
              apiKey: envConfig.OPENAI_API_KEY,
              model: envConfig.OPENAI_MODEL || "gpt-4",
              stylePrompt:
                envConfig.STYLE_PROMPT || "Generate formal and technical logs",
            }
          : undefined,
        claude: envConfig.CLAUDE_API_KEY
          ? {
              apiKey: envConfig.CLAUDE_API_KEY,
              model: envConfig.CLAUDE_MODEL || "claude-3",
            }
          : undefined,
        gemini: envConfig.GEMINI_API_KEY
          ? {
              apiKey: envConfig.GEMINI_API_KEY,
              model: envConfig.GEMINI_MODEL || "gemini-pro",
            }
          : undefined,
        kimi: envConfig.KIMI_API_KEY
          ? {
              apiKey: envConfig.KIMI_API_KEY,
              model: envConfig.KIMI_MODEL || "moonshot-v1-8k",
            }
          : undefined,
        logFormat: envConfig.LOG_FORMAT as Config["logFormat"],
        outputDirectory: envConfig.OUTPUT_DIRECTORY,
        gitLogOptions: {
          maxCommits: parseInt(envConfig.MAX_COMMITS || "50"),
          includeTags: envConfig.INCLUDE_TAGS === "true",
        },
      };
    } else {
      // 假设是 JSON 文件
      const fileContent = fs.readFileSync(options.file, "utf-8");
      importedConfig = JSON.parse(fileContent);
    }

    // 合并或覆盖配置
    const finalConfig = options.merge
      ? { ...defaultConfig, ...importedConfig }
      : importedConfig;

    // 保存配置
    fs.writeFileSync(configPath, JSON.stringify(finalConfig, null, 2));

    spinner.succeed(chalk.green("Configuration imported successfully"));
  } catch (error) {
    spinner.fail(chalk.red("Failed to import configuration"));
    if (error instanceof DevLogError) {
      console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
