import { loadConfig } from "../utils/config";
import chalk from "chalk";
import ora from "ora";

export async function showConfig(): Promise<void> {
  const spinner = ora("Loading configuration...").start();

  try {
    const config = await loadConfig();
    spinner.stop();

    console.log(chalk.bold("\nCurrent Configuration:"));
    console.log(chalk.cyan("AI Settings:"));
    console.log(`  Enabled: ${config.useAI}`);
    console.log(`  Provider: ${config.useAI ? config.aiInterface : "N/A"}`);

    console.log(chalk.cyan("\nOutput Settings:"));
    console.log(`  Format: ${config.logFormat}`);
    console.log(`  Directory: ${config.outputDirectory}`);

    console.log(chalk.cyan("\nGit Settings:"));
    console.log(`  Max Commits: ${config.gitLogOptions.maxCommits}`);
    console.log(`  Include Tags: ${config.gitLogOptions.includeTags}`);
  } catch (error) {
    spinner.fail(chalk.red("Failed to load configuration"));
    console.error(error);
    process.exit(1);
  }
}
