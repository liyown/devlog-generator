import { GitCommit } from '../types';
import simpleGit, { SimpleGit, LogResult } from 'simple-git';
import { DevLogError } from './error';

interface GitLogEntry {
  hash: string;
  date: string;
  author_name: string;
  message: string;
  refs: string;
}

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

    // Get commit logs
    const logOptions = ['--pretty=format:%H|%aI|%an|%s'];
    if (options.includeTags) {
      logOptions.push('--tags');
    }

    const logs: LogResult = await git.log([
      ...logOptions,
      `-n ${options.maxCommits}`,
    ]);

    // Transform git logs to GitCommit objects
    return logs.all.map((commit: GitLogEntry) => ({
      hash: commit.hash,
      date: commit.date,
      author: commit.author_name,
      message: commit.message,
      tags: commit.refs
        ? commit.refs.split(',').map((ref: string) => ref.trim())
        : [],
    }));
  } catch (error) {
    throw new DevLogError(
      `Failed to get git logs: ${error}`,
      'GIT_ERROR',
      error
    );
  }
}
