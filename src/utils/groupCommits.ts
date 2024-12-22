import { GitCommit } from '../types';

export function groupCommits(
  commits: GitCommit[],
  groupSize: number,
  groupByTag: boolean
): GitCommit[][] {
  if (groupByTag) {
    // 按标签分组
    const groups = new Map<string, GitCommit[]>();
    // 按时间排序，最早的在前
    const sortedCommits = [...commits].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 打印日志检查排序
    console.log(
      'Sorted commits:',
      sortedCommits.map(c => ({
        date: c.date,
        message: c.message,
      }))
    );

    // 遍历提交，根据标签分组
    sortedCommits.forEach(commit => {
      if (commit.tags && commit.tags.length > 0) {
        commit.tags.forEach(tag => {
          if (!groups.has(tag)) {
            groups.set(tag, []);
          }
          groups.get(tag)!.push(commit);
        });
      } else {
        if (!groups.has('untagged')) {
          groups.set('untagged', []);
        }
        groups.get('untagged')!.push(commit);
      }
    });

    // 过滤掉空组并转换为数组
    const result = Array.from(groups.values()).filter(
      group => group.length > 0
    );
    // 反转顺序，使最新的组在前面（用于显示）
    return result.reverse();
  } else {
    const groups: GitCommit[][] = [];

    // 按时间排序，最早的在前
    const sortedCommits = [...commits].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // 从最早的提交开始分组
    for (let i = 0; i < sortedCommits.length; i += groupSize) {
      const group = sortedCommits.slice(
        i,
        Math.min(i + groupSize, sortedCommits.length)
      );
      if (group.length > 0) {
        groups.push(group);
      }
    }

    // 打印分组结果检查
    console.log(
      'Groups before reverse:',
      groups.map(group => ({
        size: group.length,
        dates: group.map(c => c.date),
      }))
    );

    // 反转顺序，使最新的组在前面（用于显示）
    return groups.reverse();
  }
}
