import { GitCommit } from '../types';
import simpleGit, { SimpleGit } from 'simple-git';
import { DevLogError } from './error';

export async function getGitLogs(options: {
  maxCommits: number;
  from?: string;
  to?: string;
}): Promise<GitCommit[]> {
  const git = simpleGit();

  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new DevLogError('Not a git repository', 'GIT_ERROR');
    }

    // 构建git log命令参数
    const logOptions = ['--date=iso'];

    // 格式化日期字符串，确保包含完整的时间范围
    const formatDate = (dateStr: string, isEndDate: boolean) => {
      try {
        const date = new Date(dateStr);
        if (isEndDate) {
          // 结束日期设置为当天的 23:59:59
          date.setHours(23, 59, 59, 999);
        } else {
          // 开始日期设置为当天的 00:00:00
          date.setHours(0, 0, 0, 0);
        }
        return date.toISOString();
      } catch (error) {
        return dateStr;
      }
    };

    // 只有传入日期时才添加日期范围过滤
    if (options.from && options.from.trim()) {
      logOptions.push(`--since=${formatDate(options.from, false)}`);
    }
    if (options.to && options.to.trim()) {
      logOptions.push(`--until=${formatDate(options.to, true)}`);
    }

    // 添加最大提交数限制
    if (options.maxCommits > 0) {
      logOptions.push(`-n ${options.maxCommits}`);
    }
    // 获取指定范围和数量的提交
    const logs = await git.log(logOptions);
    if (!logs.all || logs.all.length === 0) {
      console.warn('No commits found in the specified range');
      return [];
    }
    const commits = logs.all.map(log => ({
      hash: log.hash,
      date: log.date,
      author: log.author_name,
      message: log.message,
      tags: [] as string[],
    }));

    // 获取所有标签信息
    const tags = await git.tags();

    for (const tag of tags.all) {
      try {
        const tagCommit = await git.revparse([tag]);
        const commit = commits.find(c => c.hash === tagCommit);
        if (commit) {
          commit.tags.push(tag);
        }
      } catch (error) {
        console.warn(`Failed to get commit for tag ${tag}:`, error);
      }
    }

    return commits;
  } catch (error) {
    throw new DevLogError(
      `Failed to get git logs: ${error}`,
      'GIT_ERROR',
      error
    );
  }
}
