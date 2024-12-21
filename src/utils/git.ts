import { GitCommit } from '../types';
import simpleGit, { SimpleGit } from 'simple-git';
import { DevLogError } from './error';

export async function getGitLogs(options: {
  maxCommits: number;
  includeTags: boolean;
}): Promise<GitCommit[]> {
  try {
    const git = simpleGit();
    const isRepo = await git.checkIsRepo();

    if (!isRepo) {
      throw new DevLogError('Not a git repository', 'GIT_ERROR');
    }

    // 获取提交日志
    const logs = await git.log([
      `--max-count=${options.maxCommits}`,
      '--date=iso',
    ]);

    // 获取所有标签
    const tags = options.includeTags ? await git.tags() : { all: [] };

    // 转换为 GitCommit 对象
    return logs.all.map(commit => ({
      hash: commit.hash,
      date: commit.date,
      author: commit.author_name,
      message: commit.message,
      tags: tags.all.filter(tag => commit.refs?.includes(tag)),
    }));
  } catch (error) {
    throw new DevLogError(
      `Failed to get git logs: ${error}`,
      'GIT_ERROR',
      error
    );
  }
}
