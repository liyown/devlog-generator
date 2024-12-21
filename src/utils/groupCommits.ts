import { GitCommit } from '../types';

export function groupCommits(
  commits: GitCommit[],
  groupSize: number,
  groupByTag: boolean
): GitCommit[][] {
  if (groupByTag) {
    // 按标签分组
    const groups = new Map<string, GitCommit[]>();
    commits.forEach(commit => {
      const tag = commit.tags?.[0] || 'untagged';
      if (!groups.has(tag)) {
        groups.set(tag, []);
      }
      groups.get(tag)!.push(commit);
    });
    return Array.from(groups.values());
  } else if (groupSize > 0) {
    // 按数量分组
    const groups: GitCommit[][] = [];
    for (let i = 0; i < commits.length; i += groupSize) {
      groups.push(commits.slice(i, i + groupSize));
    }
    return groups;
  }

  // 不分组
  return [commits];
}
