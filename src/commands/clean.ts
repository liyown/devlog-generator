import fs from "fs";
import path from "path";
import { loadConfig } from "../utils/config";
import { DevLogError } from "../utils/error";
import chalk from "chalk";
import ora from "ora";

interface CleanOptions {
  all?: boolean;
  format?: string;
  before?: string;
}

export async function clean(options: CleanOptions): Promise<void> {
  const spinner = ora("Loading configuration...").start();

  try {
    const config = await loadConfig();
    const outputDir = config.outputDirectory;

    if (!fs.existsSync(outputDir)) {
      spinner.info(chalk.yellow("Output directory does not exist"));
      return;
    }

    spinner.text = "Cleaning log files...";

    const files = fs.readdirSync(outputDir);
    let deletedCount = 0;

    for (const file of files) {
      if (!file.startsWith("devlog-")) continue;

      const filePath = path.join(outputDir, file);
      const stats = fs.statSync(filePath);

      // 如果指定了格式，只删除特定格式的文件
      if (options.format && !file.endsWith(`.${options.format}`)) {
        continue;
      }

      // 如果指定了日期，只删��该日期之前的文件
      if (options.before) {
        const beforeDate = new Date(options.before);
        if (stats.mtime > beforeDate) {
          continue;
        }
      }

      // 如果没有指定 --all，只删除超过30天的文件
      if (!options.all && !options.before) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (stats.mtime > thirtyDaysAgo) {
          continue;
        }
      }

      fs.unlinkSync(filePath);
      deletedCount++;
    }

    spinner.succeed(
      chalk.green(`Successfully cleaned ${deletedCount} log files`)
    );
  } catch (error) {
    spinner.fail(chalk.red("Failed to clean log files"));
    if (error instanceof DevLogError) {
      console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
