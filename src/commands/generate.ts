import { Config, GitCommit } from '../types';
import { loadConfig } from '../utils/config';
import { getGitLogs } from '../utils/git';
import { generateLogs } from '../services/logGenerator';
import { enhanceWithAI } from '../services/aiEnhancer';
import { saveLog } from '../utils/fileWriter';
import { PerformanceMonitor } from '../utils/performance';
import ora from 'ora';
import chalk from 'chalk';
import { groupCommits } from '../utils/groupCommits';

export async function generate(): Promise<void> {
  const spinner = ora('Loading configuration...').start();
  const monitor = new PerformanceMonitor(0);

  try {
    const finalOptions = loadConfig();

    spinner.text = 'Reading Git commit history...';

    // 获取提交历史
    const commits = await getGitLogs({
      maxCommits: finalOptions.gitLogOptions.maxCommits,
      from: finalOptions.gitLogOptions.from,
      to: finalOptions.gitLogOptions.to,
    });

    monitor.setTotalCommits(commits.length);

    // 先分组
    const allGroups = groupCommits(
      commits,
      finalOptions.gitLogOptions.groupSize,
      finalOptions.gitLogOptions.groupByTag
    );

    // 然后截取需要的组数
    const commitGroups = allGroups.slice(
      0,
      Math.ceil(
        finalOptions.gitLogOptions.maxCommits /
          finalOptions.gitLogOptions.groupSize
      )
    );

    spinner.text = 'Generating and enhancing logs...';

    // 先生成原始日志并进行AI增强
    const totalGroups = commitGroups.length;
    const enhancedGroups = await Promise.all(
      commitGroups.map(async (group, index) => {
        // 更新进度
        spinner.text = `Processing group ${index + 1}/${totalGroups}...`;

        var groupLog = undefined;

        try {
          // 如果启用了AI，使用AI增强日志
          if (finalOptions.useAI) {
            // 先生成原始日志
            let groupLog = await generateLogs(group, 'plain'); // 使用markdown格式作为中间格式

            spinner.text = `Enhancing group ${index + 1}/${totalGroups} with AI...`;
            const startTime = Date.now();
            try {
              groupLog = await enhanceWithAI(groupLog, finalOptions);
              monitor.recordAICall(Date.now() - startTime);
            } catch (error) {
              console.warn(
                chalk.yellow(
                  `AI enhancement failed for group ${index + 1}, using original log`
                )
              );
              console.error(error);
            }
          }

          // 将增强后的日志转换为目标格式
          spinner.text = `Converting group ${index + 1}/${totalGroups} to ${finalOptions.logFormat} format...`;
          const formattedLog = await generateLogs(
            group,
            finalOptions.logFormat,
            groupLog
          );

          return { group, formattedLog, success: true };
        } catch (error) {
          console.error(`Error processing group ${index + 1}:`, error);
          return { group, formattedLog: '', success: false };
        }
      })
    );

    // 过滤掉处理失败的组
    const successfulGroups = enhancedGroups.filter(group => group.success);

    if (successfulGroups.length === 0) {
      throw new Error('No groups were successfully processed');
    }

    spinner.text = 'Combining logs...';

    // 根据不同格式生成最终日志
    let logs = '';
    if (finalOptions.logFormat === 'html') {
      // HTML 格式需要特殊处理
      const blocks = successfulGroups
        .map(({ formattedLog }) => formattedLog)
        .filter(log => log.length > 0);

      if (blocks.length === 0) {
        throw new Error('Failed to generate any valid HTML blocks');
      }

      logs = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Development Log</title>
  <style>
    :root {
      color-scheme: light dark;
      
      /* Light theme */
      --bg-color-light: #f8f9fa;
      --card-bg-light: #ffffff;
      --text-color-light: #1f2328;
      --border-color-light: #d0d7de;
      --hover-bg-light: #f3f4f6;
      --meta-color-light: #656d76;
      
      /* Dark theme */
      --bg-color-dark: #0d1117;
      --card-bg-dark: #161b22;
      --text-color-dark: #c9d1d9;
      --border-color-dark: #30363d;
      --hover-bg-dark: #1c2128;
      --meta-color-dark: #8b949e;
      
      /* Common */
      --shadow: 0 1px 3px rgba(0,0,0,0.1);
      --radius: 8px;
      --transition: all 0.2s ease;
      
      /* Commit types */
      --feat-color: #2da44e;
      --fix-color: #cf222e;
      --docs-color: #0969da;
      --style-color: #8250df;
      --refactor-color: #bf3989;
      --test-color: #1a7f37;
      --chore-color: #6e7781;
      --perf-color: #d4a72c;
      
      /* Apply theme */
      --bg-color: var(--bg-color-light);
      --card-bg: var(--card-bg-light);
      --text-color: var(--text-color-light);
      --border-color: var(--border-color-light);
      --hover-bg: var(--hover-bg-light);
      --meta-color: var(--meta-color-light);
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-color: var(--bg-color-dark);
        --card-bg: var(--card-bg-dark);
        --text-color: var(--text-color-dark);
        --border-color: var(--border-color-dark);
        --hover-bg: var(--hover-bg-dark);
        --meta-color: var(--meta-color-dark);
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Helvetica, Arial, sans-serif;
      max-width: min(90vw, 1000px);
      margin: 2rem auto;
      padding: 0 1rem;
      background: var(--bg-color);
      color: var(--text-color);
      line-height: 1.6;
    }

    .log-block {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .log-block + .log-block {
      margin-top: 3rem;
      position: relative;
    }

    .log-block + .log-block::before {
      content: '';
      position: absolute;
      top: -1.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 4px;
      background: var(--border-color);
      border-radius: 2px;
    }

    .log-block h2 {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      font-size: clamp(1.1rem, 2.5vw, 1.25rem);
      font-weight: 600;
    }

    .commit {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      transition: var(--transition);
    }

    .commit:last-child {
      border-bottom: none;
    }

    .commit:hover {
      background: var(--hover-bg);
    }

    .commit-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .commit-type {
      padding: 0.25em 0.75em;
      border-radius: 2em;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #fff;
      letter-spacing: 0.05em;
      white-space: nowrap;
    }

    .commit-type.feat { background: var(--feat-color); }
    .commit-type.fix { background: var(--fix-color); }
    .commit-type.docs { background: var(--docs-color); }
    .commit-type.style { background: var(--style-color); }
    .commit-type.refactor { background: var(--refactor-color); }
    .commit-type.test { background: var(--test-color); }
    .commit-type.chore { background: var(--chore-color); }
    .commit-type.perf { background: var(--perf-color); }

    .commit-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: var(--meta-color);
      font-size: 0.875rem;
    }

    .commit-meta span {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .icon {
      flex-shrink: 0;
      vertical-align: text-bottom;
      fill: currentColor;
    }

    .hash {
      font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace;
    }

    .commit-message {
      font-size: 1rem;
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }

    .enhanced-log {
      margin-top: 1rem;
      padding: 1rem;
      background: var(--hover-bg);
      border-radius: var(--radius);
    }

    .commit-tags {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.2em 0.6em;
      background: var(--hover-bg);
      border: 1px solid var(--border-color);
      border-radius: 2em;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-color);
    }

    @media (max-width: 768px) {
      .commit-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .commit-meta {
        flex-wrap: wrap;
        gap: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      body {
        margin: 1rem auto;
      }

      .commit {
        padding: 1rem;
      }

      .log-block h2 {
        padding: 1rem;
      }

      .log-block {
        margin-bottom: 1.5rem;
      }

      .log-block + .log-block {
        margin-top: 2rem;
      }

      .log-block + .log-block::before {
        top: -1rem;
        width: 30px;
        height: 3px;
      }
    }
  </style>
</head>
<body>
  ${blocks.join('\n')}
</body>
</html>
      `;
    } else if (finalOptions.logFormat === 'json') {
      // JSON 格式处理
      logs = JSON.stringify(
        successfulGroups
          .map(({ formattedLog }) => JSON.parse(formattedLog))
          .filter(log => log),
        null,
        2
      );

      if (!logs) {
        throw new Error('Failed to generate any valid JSON logs');
      }
    } else {
      // 其他格式处理
      logs = successfulGroups
        .map(({ formattedLog }) => formattedLog)
        .filter(log => log.length > 0)
        .join('\n\n')
        .trim();

      if (!logs) {
        throw new Error('Failed to generate any valid logs');
      }
    }

    // 保存日志
    spinner.text = 'Saving logs...';
    const outputPath = await saveLog(
      logs,
      finalOptions.logFormat,
      finalOptions.outputDirectory,
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
      if (finalOptions.useAI && metrics.averageAIResponseTime > 0) {
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
