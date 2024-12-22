import { loadConfig } from '../utils/config';
import { getGitLogs } from '../utils/git';
import { generateLogs } from '../services/logGenerator';
import { enhanceWithAI } from '../services/aiEnhancer';
import { saveLog } from '../utils/fileWriter';
import { DevLogError } from '../utils/error';
import { GitCommit } from '../types';
import chalk from 'chalk';
import ora from 'ora';
import { PerformanceMonitor } from '../utils/performance';

interface BatchOptions {
  startDate?: string;
  endDate?: string;
  tags?: string[];
  format?: string;
  outputDir?: string;
}

export async function batchGenerate(options: BatchOptions): Promise<void> {
  const spinner = ora('Loading configuration...').start();
  let monitor: PerformanceMonitor;

  try {
    const config = await loadConfig();
    spinner.text = 'Reading Git commit history...';

    // Get all commits
    const commits = await getGitLogs({
      maxCommits: config.gitLogOptions.maxCommits,
      includeTags: true,
    });

    // Filter commits based on date range and tags
    const filteredCommits = commits.filter((commit: GitCommit) => {
      const commitDate = new Date(commit.date);
      const startDate = options.startDate ? new Date(options.startDate) : null;
      const endDate = options.endDate ? new Date(options.endDate) : null;

      // Check date range
      if (startDate && commitDate < startDate) return false;
      if (endDate && commitDate > endDate) return false;

      // Check tags
      if (options.tags && options.tags.length > 0) {
        return commit.tags?.some((tag: string) => options.tags?.includes(tag));
      }

      return true;
    });

    if (filteredCommits.length === 0) {
      spinner.info(chalk.yellow('No commits found matching the criteria'));
      return;
    }

    monitor = new PerformanceMonitor(filteredCommits.length);
    spinner.text = 'Generating logs...';

    // Generate logs
    let logs = await generateLogs(
      filteredCommits,
      options.format || config.logFormat
    );

    // Enhance with AI if enabled
    if (config.useAI) {
      spinner.text = 'Enhancing logs with AI...';
      const startTime = Date.now();
      try {
        logs = await enhanceWithAI(logs, config);
        monitor.recordAICall(Date.now() - startTime);
      } catch (error) {
        spinner.warn(
          chalk.yellow('AI enhancement failed, using original logs')
        );
        console.error(error);
      }
    }

    // Save logs
    spinner.text = 'Saving logs...';
    const outputPath = await saveLog(
      logs,
      options.format || config.logFormat,
      options.outputDir || config.outputDirectory
    );

    monitor.complete();
    const metrics = monitor.getMetrics();

    spinner.succeed(chalk.green('Logs generated successfully!'));
    console.log(chalk.blue(`Output saved to: ${outputPath}`));
    console.log(chalk.cyan('\nPerformance Metrics:'));
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
    spinner.fail(chalk.red('Failed to generate logs'));
    if (error instanceof DevLogError) {
      console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}
