import fs from "fs";
import path from "path";
import crypto from "crypto";
import { GitCommit } from "../types";

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
  private readonly MAX_CACHE_SIZE = 100; // 最大缓存条目数

  constructor() {
    this.cachePath = path.join(process.cwd(), ".devlog-cache.json");
    this.loadCache();
  }

  private loadCache(): void {
    if (fs.existsSync(this.cachePath)) {
      try {
        const data = fs.readFileSync(this.cachePath, "utf-8");
        this.cacheData = JSON.parse(data);
        this.cleanExpiredEntries();
      } catch (error) {
        // 如果缓存文件损坏，重置缓存
        this.cacheData = {};
        this.saveCache();
      }
    }
  }

  private cleanExpiredEntries(): void {
    const now = Date.now();
    let hasExpired = false;

    // 删除过期条目
    Object.keys(this.cacheData).forEach((key) => {
      if (now - this.cacheData[key].timestamp > this.CACHE_EXPIRY) {
        delete this.cacheData[key];
        hasExpired = true;
      }
    });

    // 如果缓存条目过多，删除最旧的条目
    const entries = Object.entries(this.cacheData);
    if (entries.length > this.MAX_CACHE_SIZE) {
      entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
      const toDelete = entries.length - this.MAX_CACHE_SIZE;
      entries.slice(0, toDelete).forEach(([key]) => {
        delete this.cacheData[key];
      });
      hasExpired = true;
    }

    if (hasExpired) {
      this.saveCache();
    }
  }

  private saveCache(): void {
    try {
      fs.writeFileSync(this.cachePath, JSON.stringify(this.cacheData, null, 2));
    } catch (error) {
      console.error("Failed to save cache:", error);
    }
  }

  private generateKey(commits: GitCommit[], format: string): string {
    const content = JSON.stringify({ commits, format });
    return crypto.createHash("md5").update(content).digest("hex");
  }

  get(commits: GitCommit[], format: string): string | null {
    const key = this.generateKey(commits, format);
    const entry = this.cacheData[key];

    if (!entry) return null;

    // Check if cache has expired
    if (Date.now() - entry.timestamp > this.CACHE_EXPIRY) {
      delete this.cacheData[key];
      this.saveCache();
      return null;
    }

    return entry.content;
  }

  set(commits: GitCommit[], format: string, content: string): void {
    const key = this.generateKey(commits, format);
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
