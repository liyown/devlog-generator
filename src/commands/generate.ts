import { GenerateOptions } from "../types";
import { loadConfig } from "../utils/config";
import { getGitLogs } from "../utils/git";
import { generateLogs } from "../services/logGenerator";
import { enhanceWithAI } from "../services/aiEnhancer";
import { saveLog } from "../utils/fileWriter";
import { LogCache } from "../utils/cache";
import { PerformanceMonitor } from "../utils/performance";
import ora from "ora";
import chalk from "chalk";

export async function generate(options: GenerateOptions): Promise<void> {
  const spinner = ora("Loading configuration...").start();
  const cache = new LogCache();

  try {
    const config = await loadConfig();
    spinner.text = "Reading Git commit history...";

    const commits = await getGitLogs({
      maxCommits: parseInt(options.maxCommits),
      includeTags: options.includeTags,
    });

    const monitor = new PerformanceMonitor(commits.length);

    // Check cache first
    const cacheKey = commits.map((c) => c.hash).join(",") + options.format;
    const cachedLogs = cache.get(commits, options.format);

    if (cachedLogs) {
      spinner.succeed(chalk.green("Logs retrieved from cache"));
      const outputPath = await saveLog(
        cachedLogs,
        options.format,
        options.outputDir
      );
      console.log(chalk.blue(`Output saved to: ${outputPath}`));
      return;
    }

    spinner.text = "Generating logs...";

    // Generate base logs
    let logs = await generateLogs(commits, options.format);

    // Enhance with AI if enabled
    if (config.useAI) {
      spinner.text = "Enhancing logs with AI...";
      const startTime = Date.now();
      try {
        logs = await enhanceWithAI(logs, config);
        monitor.recordAICall(Date.now() - startTime);
      } catch (error) {
        spinner.warn(
          chalk.yellow("AI enhancement failed, using original logs")
        );
        console.error(error);
      }
    }

    // Cache the generated logs
    cache.set(commits, options.format, logs);

    // Save logs
    spinner.text = "Saving logs...";
    const outputPath = await saveLog(logs, options.format, options.outputDir);

    monitor.complete();
    const metrics = monitor.getMetrics();

    spinner.succeed(chalk.green("Logs generated successfully!"));
    console.log(chalk.blue(`Output saved to: ${outputPath}`));
    console.log(chalk.cyan("\nPerformance Metrics:"));
    console.log(`Total time: ${(metrics.totalTime / 1000).toFixed(2)}s`);
    if (config.useAI) {
      console.log(
        `Average AI response time: ${(metrics.averageAIResponseTime / 1000).toFixed(2)}s`
      );
    }
    console.log(
      `Commits processed per second: ${metrics.commitsPerSecond.toFixed(2)}`
    );
  } catch (error) {
    spinner.fail(chalk.red("Error generating logs"));
    console.error(error);
    process.exit(1);
  }
}
