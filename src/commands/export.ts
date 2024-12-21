import fs from "fs";
import path from "path";
import { loadConfig } from "../utils/config";
import { DevLogError } from "../utils/error";
import chalk from "chalk";
import ora from "ora";

interface ExportOptions {
  output?: string;
  format?: "json" | "env";
}

export async function exportConfig(options: ExportOptions): Promise<void> {
  const spinner = ora("Loading configuration...").start();

  try {
    const config = await loadConfig();
    const outputPath = options.output || "./devlog-config-export";

    if (options.format === "env") {
      // 导出为 .env 格式
      const envContent = [
        `USE_AI=${config.useAI}`,
        `AI_INTERFACE=${config.aiInterface}`,
        config.openai?.apiKey && `OPENAI_API_KEY=${config.openai.apiKey}`,
        config.claude?.apiKey && `CLAUDE_API_KEY=${config.claude.apiKey}`,
        config.gemini?.apiKey && `GEMINI_API_KEY=${config.gemini.apiKey}`,
        config.kimi?.apiKey && `KIMI_API_KEY=${config.kimi.apiKey}`,
        `LOG_FORMAT=${config.logFormat}`,
        `OUTPUT_DIRECTORY=${config.outputDirectory}`,
        `MAX_COMMITS=${config.gitLogOptions.maxCommits}`,
        `INCLUDE_TAGS=${config.gitLogOptions.includeTags}`,
      ]
        .filter(Boolean)
        .join("\n");

      fs.writeFileSync(`${outputPath}.env`, envContent);
    } else {
      // 导出为 JSON 格式
      fs.writeFileSync(`${outputPath}.json`, JSON.stringify(config, null, 2));
    }

    spinner.succeed(
      chalk.green(
        `Configuration exported to: ${outputPath}.${options.format || "json"}`
      )
    );
  } catch (error) {
    spinner.fail(chalk.red("Failed to export configuration"));
    if (error instanceof DevLogError) {
      console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
