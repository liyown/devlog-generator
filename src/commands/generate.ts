import { GenerateOptions } from '../types';
import { loadConfig } from '../utils/config';
import { getGitLogs } from '../utils/git';
import { generateLogs } from '../services/logGenerator';
import { enhanceWithAI } from '../services/aiEnhancer';
import { saveLog } from '../utils/fileWriter';
import { LogCache } from '../utils/cache';
import { PerformanceMonitor } from '../utils/performance';
import ora from 'ora';
import chalk from 'chalk';
import { groupCommits } from '../utils/groupCommits';

export async function generate(options: GenerateOptions): Promise<void> {
  const spinner = ora('Loading configuration...').start();
  const cache = new LogCache();

  try {
    const config = loadConfig();
    const finalOptions = {
      format: options.format ?? config.logFormat,
      outputDir: options.outputDir ?? config.outputDirectory,
      maxCommits:
        options.maxCommits !== undefined
          ? Number(options.maxCommits)
          : config.gitLogOptions.maxCommits,
      includeTags: options.includeTags ?? config.gitLogOptions.includeTags,
      useAI: config.useAI,
      aiInterface: config.aiInterface,
      aiConfig: config[config.aiInterface],
      groupSize: options.groupSize ?? config.gitLogOptions.groupSize,
      groupByTag: options.groupByTag ?? config.gitLogOptions.groupByTag,
    };

    console.log('Using configuration:', {
      ...finalOptions,
      aiConfig: finalOptions.aiConfig
        ? { ...finalOptions.aiConfig, apiKey: '***' }
        : undefined,
    });

    spinner.text = 'Reading Git commit history...';

    const commits = await getGitLogs({
      maxCommits: finalOptions.maxCommits,
      includeTags: finalOptions.includeTags,
    });

    const commitGroups = groupCommits(
      commits,
      finalOptions.groupSize,
      finalOptions.groupByTag
    );

    const monitor = new PerformanceMonitor(commits.length);

    // Check cache first
    const cachedLogs = cache.get(commits, finalOptions.format);
    if (cachedLogs) {
      spinner.succeed(chalk.green('Using cached logs'));
      const outputPath = await saveLog(
        cachedLogs,
        finalOptions.format,
        finalOptions.outputDir
      );
      console.log(chalk.blue(`Output saved to: ${outputPath}`));
      return;
    }

    // Generate new logs
    let logs = '';
    for (const group of commitGroups) {
      const groupLog = await generateLogs(group, finalOptions.format);
      logs += groupLog + '\n\n';
    }

    // 移除末尾多余的换行
    logs = logs.trim();

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
      finalOptions.format,
      finalOptions.outputDir,
      'devlog'
    );

    monitor.complete();
    const metrics = monitor.getMetrics();

    spinner.succeed(chalk.green('Logs generated successfully!'));
    console.log(chalk.blue(`Output saved to: ${outputPath}`));

    if (commits.length > 0) {
      // 只在有提交时显示性能指标
      console.log(chalk.cyan('\nPerformance Metrics:'));
      console.log(`Total time: ${(metrics.totalTime / 1000).toFixed(2)}s`);
      console.log(`Total commits: ${commits.length}`);
      if (metrics.commitsPerSecond > 0) {
        console.log(
          `Commits processed per second: ${metrics.commitsPerSecond.toFixed(2)}`
        );
      }
      if (config.useAI && metrics.averageAIResponseTime > 0) {
        console.log(
          `Average AI response time: ${(metrics.averageAIResponseTime / 1000).toFixed(2)}s`
        );
      }
    }
  } catch (error) {
    spinner.fail(chalk.red('Error generating logs'));
    console.error(error);
    process.exit(1);
  }
}
