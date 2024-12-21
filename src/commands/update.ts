import { loadConfig } from "../utils/config";
import { Config } from "../types";
import { parseBoolean, parseNumber } from "../utils/options";
import { DevLogError } from "../utils/error";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

interface UpdateOptions {
  useAI?: string;
  aiInterface?: Config["aiInterface"];
  format?: Config["logFormat"];
  maxCommits?: string;
  includeTags?: string;
  outputDir?: string;
}

export async function update(options: UpdateOptions): Promise<void> {
  const spinner = ora("Loading configuration...").start();

  try {
    const config = await loadConfig();
    const configPath = path.join(process.cwd(), "devlog.config.json");

    // Validate options before updating
    if (options.aiInterface && !isValidAIInterface(options.aiInterface)) {
      throw new DevLogError(
        `Invalid AI interface: ${options.aiInterface}`,
        "INVALID_OPTION"
      );
    }

    if (options.format && !isValidLogFormat(options.format)) {
      throw new DevLogError(
        `Invalid log format: ${options.format}`,
        "INVALID_OPTION"
      );
    }

    // Update configuration with type conversion
    if (options.useAI !== undefined) {
      try {
        config.useAI = parseBoolean(options.useAI);
      } catch (error) {
        throw new DevLogError(
          `Invalid useAI value: ${options.useAI}`,
          "INVALID_OPTION"
        );
      }
    }

    if (options.aiInterface) {
      config.aiInterface = options.aiInterface;
    }

    if (options.format) {
      config.logFormat = options.format;
    }

    if (options.maxCommits) {
      try {
        config.gitLogOptions.maxCommits = parseNumber(options.maxCommits);
        if (config.gitLogOptions.maxCommits <= 0) {
          throw new DevLogError(
            "maxCommits must be greater than 0",
            "INVALID_OPTION"
          );
        }
      } catch (error) {
        throw new DevLogError(
          `Invalid maxCommits value: ${options.maxCommits}`,
          "INVALID_OPTION"
        );
      }
    }

    if (options.includeTags !== undefined) {
      try {
        config.gitLogOptions.includeTags = parseBoolean(options.includeTags);
      } catch (error) {
        throw new DevLogError(
          `Invalid includeTags value: ${options.includeTags}`,
          "INVALID_OPTION"
        );
      }
    }

    if (options.outputDir) {
      config.outputDirectory = options.outputDir;
    }

    // Save updated configuration
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    spinner.succeed(chalk.green("Configuration updated successfully"));
  } catch (error) {
    spinner.fail(chalk.red("Failed to update configuration"));
    if (error instanceof DevLogError) {
      console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

function isValidAIInterface(value: string): value is Config["aiInterface"] {
  return ["openai", "claude", "gemini", "kimi"].includes(value);
}

function isValidLogFormat(value: string): value is Config["logFormat"] {
  return ["markdown", "json", "html"].includes(value);
}
