import { loadConfig } from "../utils/config";
import { DevLogError } from "../utils/error";
import chalk from "chalk";
import ora from "ora";

export async function validate(): Promise<void> {
  const spinner = ora("Validating configuration...").start();

  try {
    const config = await loadConfig();

    // Validate AI settings
    if (config.useAI) {
      switch (config.aiInterface) {
        case "openai":
          if (!config.openai?.apiKey) {
            throw new DevLogError(
              "OpenAI API key is required when using OpenAI",
              "CONFIG_ERROR"
            );
          }
          break;
        case "claude":
          if (!config.claude?.apiKey) {
            throw new DevLogError(
              "Claude API key is required when using Claude",
              "CONFIG_ERROR"
            );
          }
          break;
        case "gemini":
          if (!config.gemini?.apiKey) {
            throw new DevLogError(
              "Gemini API key is required when using Gemini",
              "CONFIG_ERROR"
            );
          }
          break;
        case "kimi":
          if (!config.kimi?.apiKey) {
            throw new DevLogError(
              "Kimi API key is required when using Kimi",
              "CONFIG_ERROR"
            );
          }
          break;
      }
    }

    // Validate output settings
    if (!["markdown", "json", "html"].includes(config.logFormat)) {
      throw new DevLogError(
        "Invalid log format. Must be one of: markdown, json, html",
        "CONFIG_ERROR"
      );
    }

    // Validate Git settings
    if (config.gitLogOptions.maxCommits <= 0) {
      throw new DevLogError(
        "maxCommits must be greater than 0",
        "CONFIG_ERROR"
      );
    }

    spinner.succeed(chalk.green("Configuration is valid"));
  } catch (error) {
    spinner.fail(chalk.red("Configuration validation failed"));
    if (error instanceof DevLogError) {
      console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
