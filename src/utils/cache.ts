import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { GitCommit } from '../types';

interface CacheEntry {
  timestamp: number;
  content: string;
}

interface CacheData {
  [key: string]: CacheEntry;
}

export class LogCache {
  private cachePath: string;
  private cacheData: CacheData = {};
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.cachePath = path.join(process.cwd(), '.devlog-cache.json');
    this.loadCache();
  }

  private loadCache(): void {
    if (fs.existsSync(this.cachePath)) {
      try {
        const data = fs.readFileSync(this.cachePath, 'utf-8');
        this.cacheData = JSON.parse(data);
      } catch (error) {
        // 如果缓存文件损坏，重置缓存
        this.cacheData = {};
        this.saveCache();
      }
    }
  }

  private saveCache(): void {
    try {
      fs.writeFileSync(this.cachePath, JSON.stringify(this.cacheData, null, 2));
    } catch (error) {
      console.error('Failed to save cache:', error);
    }
  }

  generateCacheKey(commit: GitCommit): string {
    return `${commit.hash}-${commit.date}-${commit.message}`;
  }

  get(commits: GitCommit[], format: string): string | null {
    // 检查所有提交是否都已缓存
    const uncachedCommits = commits.filter(commit => {
      const key = this.generateCacheKey(commit);
      const entry = this.cacheData[key];
      return !entry || Date.now() - entry.timestamp > this.CACHE_EXPIRY;
    });

    if (uncachedCommits.length > 0) {
      return null;
    }

    // 按原始顺序合并日志
    return commits
      .map(commit => this.cacheData[this.generateCacheKey(commit)].content)
      .join('\n');
  }

  set(commit: GitCommit, content: string): void {
    const key = this.generateCacheKey(commit);
    this.cacheData[key] = {
      timestamp: Date.now(),
      content,
    };
    this.saveCache();
  }

  clear(): void {
    this.cacheData = {};
    this.saveCache();
  }
}
