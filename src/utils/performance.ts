interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  totalCommits: number;
  processedCommits: number;
  aiCalls: number;
  aiResponseTime: number;
}

export class PerformanceMonitor {
  private startTime: number;
  private endTime: number = 0;
  private totalCommits: number;
  private aiCallTimes: number[];

  constructor(totalCommits: number) {
    this.startTime = Date.now();
    this.totalCommits = totalCommits || 1; // 避免除以零
    this.aiCallTimes = [];
  }

  recordAICall(duration: number): void {
    this.aiCallTimes.push(duration);
  }

  complete(): void {
    this.endTime = Date.now();
  }

  getMetrics() {
    const totalTime = (this.endTime || Date.now()) - this.startTime || 1; // 如果 endTime 未设置，使用当前时间
    return {
      totalTime,
      commitsPerSecond: (this.totalCommits * 1000) / totalTime,
      averageAIResponseTime:
        this.aiCallTimes.length > 0
          ? this.aiCallTimes.reduce((a, b) => a + b, 0) /
            this.aiCallTimes.length
          : 0,
    };
  }

  setTotalCommits(count: number): void {
    this.totalCommits = count || 1; // 避免除以零
  }
}
