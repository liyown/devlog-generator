import { GitCommit } from '../types';
import fs from 'fs';
import path from 'path';

export async function generateLogs(
  commits: GitCommit[],
  format: string
): Promise<string> {
  switch (format) {
    case 'markdown':
      return generateMarkdown(commits);
    case 'json':
      return generateJSON(commits);
    case 'html':
      return generateHtmlLog(commits);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function generateMarkdown(commits: GitCommit[]): string {
  // 每组提交作为一个日志块
  let markdown = '';

  // 获取组的时间范围
  const startDate = new Date(commits[commits.length - 1].date);
  const endDate = new Date(commits[0].date);
  const dateRange =
    startDate.toLocaleDateString() === endDate.toLocaleDateString()
      ? startDate.toLocaleDateString()
      : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  // 添加日志块标题
  markdown += `## Development Log (${dateRange})\n\n`;

  // 添加提交信息
  commits.forEach(commit => {
    markdown += `- **${getCommitType(commit.message)}**: ${getCommitMessage(commit.message)}\n`;
    if (commit.tags?.length) {
      markdown += `  - Tags: ${commit.tags.join(', ')}\n`;
    }
  });

  markdown += '\n---\n';
  return markdown;
}

function generateJSON(commits: GitCommit[]): string {
  // 获取组的时间范围
  const startDate = new Date(commits[commits.length - 1].date);
  const endDate = new Date(commits[0].date);
  const dateRange =
    startDate.toLocaleDateString() === endDate.toLocaleDateString()
      ? startDate.toLocaleDateString()
      : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  // 构建日志块
  const logBlock = {
    dateRange,
    commits: commits.map(commit => ({
      type: getCommitType(commit.message),
      message: getCommitMessage(commit.message),
      tags: commit.tags || [],
    })),
  };

  return JSON.stringify(logBlock, null, 2);
}

function generateHtmlLog(commits: GitCommit[]): string {
  // 获取组的时间范围
  const startDate = new Date(commits[commits.length - 1].date);
  const endDate = new Date(commits[0].date);
  const dateRange =
    startDate.toLocaleDateString() === endDate.toLocaleDateString()
      ? startDate.toLocaleDateString()
      : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  const commitHtml = commits
    .map(
      commit => `
      <li class="commit">
        <span class="type">${getCommitType(commit.message)}</span>
        <span class="message">${getCommitMessage(commit.message)}</span>
        ${commit.tags?.length ? `<div class="tags">${commit.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
      </li>
    `
    )
    .join('\n');

  return `
    <div class="log-block">
      <h2>Development Log (${dateRange})</h2>
      <ul class="commit-list">
        ${commitHtml}
      </ul>
      <hr>
    </div>
  `;
}

// 辅助函数
function getCommitType(message: string): string {
  // 常见的提交类型及其关键词
  const COMMIT_TYPES = {
    feat: ['feat', 'feature', 'add', 'new', 'implement', 'added', 'support'],
    fix: [
      'fix',
      'bug',
      'bugfix',
      'patch',
      'fixed',
      'resolve',
      'solved',
      'repair',
      'hotfix',
    ],
    docs: [
      'docs',
      'doc',
      'document',
      'documentation',
      'readme',
      'api',
      'comment',
    ],
    style: [
      'style',
      'format',
      'ui',
      'css',
      'design',
      'layout',
      'visual',
      'theme',
    ],
    refactor: [
      'refactor',
      'refact',
      'restructure',
      'optimize',
      'cleanup',
      'improve',
      'enhancement',
    ],
    test: ['test', 'tests', 'testing', 'coverage', 'spec', 'unittest', 'e2e'],
    chore: [
      'chore',
      'build',
      'ci',
      'release',
      'version',
      'dep',
      'dependency',
      'config',
      'setup',
      'upgrade',
      'update',
    ],
    perf: ['perf', 'performance', 'optimize', 'speed', 'fast', 'benchmark'],
    revert: ['revert', 'rollback', 'undo', 'reset'],
    merge: ['merge', 'branch', 'pull request', 'pr'],
    init: ['init', 'initial', 'start', 'begin', 'create', 'first'],
  };

  // 如果消息为空，返回 other
  if (!message || typeof message !== 'string') {
    return 'other';
  }

  const lowerMessage = message.trim().toLowerCase();

  // 尝试从规范的提交消息中获取类型
  const conventionalMatch = lowerMessage.match(
    /^(feat|fix|docs|style|refactor|test|chore|perf|revert|merge|init)(?:\(.*?\))?:/
  );
  if (conventionalMatch) {
    return conventionalMatch[1];
  }

  // 检查是否是合并提交
  if (lowerMessage.startsWith('merge')) {
    return 'merge';
  }

  // 尝试从消息内容推断类型
  for (const [type, keywords] of Object.entries(COMMIT_TYPES)) {
    // 检查消息是否以任何关键词开头
    if (keywords.some(keyword => lowerMessage.startsWith(keyword))) {
      return type;
    }
    // 如果不是以关键词开头，检查消息中是否包含关键词
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return type;
    }
  }

  // 特殊情况处理
  if (lowerMessage.includes('wip')) return 'wip';
  if (lowerMessage.includes('breaking change')) return 'breaking';
  if (lowerMessage.match(/^\d+\.\d+\.\d+/)) return 'release'; // 版本号格式

  // 默认类型
  return 'other';
}

// 更新消息处理函数
function getCommitMessage(message: string): string {
  if (!message || typeof message !== 'string') {
    return 'No message';
  }

  // 移除常见的提交类型前缀
  const cleanMessage = message
    .replace(
      /^(feat|fix|docs|style|refactor|test|chore|perf|revert|merge|init)(?:\(.*?\))?:\s*/i,
      ''
    )
    .replace(
      /^(Merge\s+(branch|pull request|remote-tracking branch)).*$/i,
      'Merge changes'
    )
    .trim();

  return cleanMessage || 'No message';
}
