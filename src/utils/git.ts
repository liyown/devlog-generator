import { GitCommit } from '../types';
import simpleGit, { SimpleGit } from 'simple-git';
import { DevLogError } from './error';

export async function getGitLogs(options: {
  maxCommits: number;
  includeTags: boolean;
}): Promise<GitCommit[]> {
  const git = simpleGit();

  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      throw new DevLogError('Not a git repository', 'GIT_ERROR');
    }

    // 获取指定数量的提交
    const logs = await git.log(['--date=iso', `-n ${options.maxCommits}`]);

    const commits = logs.all.map(log => ({
      hash: log.hash,
      date: log.date,
      author: log.author_name,
      message: log.message,
      tags: [] as string[],
    }));

    // 如果需要包含标签
    if (options.includeTags) {
      const tags = await git.tags();
      for (const tag of tags.all) {
        try {
          const tagCommit = await git.revparse([tag]);
          const commit = commits.find(c => c.hash === tagCommit);
          if (commit) {
            if (!commit.tags) {
              commit.tags = [];
            }
            commit.tags.push(tag);
          }
        } catch (error) {
          console.warn(`Failed to get commit for tag ${tag}:`, error);
        }
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
