import { GitCommit } from '../types';
import fs from 'fs';
import path from 'path';

export async function generateLogs(
  commits: GitCommit[],
  format: string,
  enhancedLog?: string
): Promise<string> {
  switch (format) {
    case 'markdown':
      return generateMarkdown(commits, enhancedLog);
    case 'json':
      return generateJSON(commits, enhancedLog);
    case 'html':
      return generateHtmlLog(commits, enhancedLog);
    case 'plain':
      return generatePlainLog(commits, enhancedLog);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function generatePlainLog(commits: GitCommit[], enhancedLog?: string): string {
  return commits.map(commit => `${commit.message}`).join('\n');
}

function generateMarkdown(commits: GitCommit[], enhancedLog?: string): string {
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

  if (enhancedLog) {
    markdown += enhancedLog;
  } else {
    commits.forEach(commit => {
      markdown += `- **${getCommitType(commit.message)}**: ${getCommitMessage(commit.message)}\n`;
      if (commit.tags?.length) {
        markdown += `  - Tags: ${commit.tags.join(', ')}\n`;
      }
    });
  }

  markdown += '\n---\n';
  return markdown;
}

function generateJSON(commits: GitCommit[], enhancedLog?: string): string {
  // 获取组的时间范围
  const startDate = new Date(commits[commits.length - 1].date);
  const endDate = new Date(commits[0].date);
  const dateRange =
    startDate.toLocaleDateString() === endDate.toLocaleDateString()
      ? startDate.toLocaleDateString()
      : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  let devlog = '';

  if (enhancedLog) {
    devlog = enhancedLog;
  } else {
    commits.forEach(commit => {
      devlog += `- **${getCommitType(commit.message)}**: ${getCommitMessage(commit.message)}\n`;
    });
  }

  const logBlock = {
    dateRange,
    devlog: devlog,
  };

  return JSON.stringify(logBlock, null, 2);
}

function generateHtmlLog(commits: GitCommit[], enhancedLog?: string): string {
  if (commits.length === 0) {
    return '<div class="log-block"><h2>No commits found</h2></div>';
  }

  const startDate = new Date(commits[commits.length - 1].date);
  const endDate = new Date(commits[0].date);
  const dateRange =
    startDate.toLocaleDateString() === endDate.toLocaleDateString()
      ? startDate.toLocaleDateString()
      : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  let blockHtml = `
    <div class="log-block">
      <h2>Development Log (${dateRange})</h2>`;

  if (enhancedLog) {
    blockHtml += `
      <div class="enhanced-log">
        ${enhancedLog}
      </div>`;
  } else {
    blockHtml += commits
      .map(
        commit => `
          <article class="commit">
            <div class="commit-header">
              <div class="commit-type ${getCommitType(commit.message).toLowerCase()}">
                ${getCommitType(commit.message)}
              </div>
              <div class="commit-meta">
                <span class="hash" title="Commit Hash">
                  <svg class="icon" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"/>
                  </svg>
                  ${commit.hash.slice(0, 7)}
                </span>
                <span class="author" title="Author">
                  <svg class="icon" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" d="M8 8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm4.25 4.5H3.75a.75.75 0 010-1.5h8.5a.75.75 0 010 1.5z"/>
                  </svg>
                  ${commit.author}
                </span>
                <time class="date" title="Date" datetime="${commit.date}">
                  <svg class="icon" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" d="M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h8.5a.25.25 0 01.25.25V6h-11V3.75a.25.25 0 01.25-.25h2zm-2.25 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5h-11z"/>
                  </svg>
                  ${new Date(commit.date).toLocaleString()}
                </time>
              </div>
            </div>
            <div class="commit-content">
              <p class="commit-message">${getCommitMessage(commit.message)}</p>
              ${
                commit.tags && commit.tags.length > 0
                  ? `<div class="commit-tags">
                      ${commit.tags
                        .map(tag => `<span class="tag">${tag}</span>`)
                        .join('')}
                    </div>`
                  : ''
              }
            </div>
          </article>
        `
      )
      .join('\n');
  }

  blockHtml += `
    </div>`;

  return blockHtml;
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
