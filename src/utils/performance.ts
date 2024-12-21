interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  totalCommits: number;
  processedCommits: number;
  aiCalls: number;
  aiResponseTime: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;

  constructor(totalCommits: number) {
    this.metrics = {
      startTime: Date.now(),
      totalCommits,
      processedCommits: 0,
      aiCalls: 0,
      aiResponseTime: 0,
    };
  }

  incrementProcessedCommits(): void {
    this.metrics.processedCommits++;
  }

  recordAICall(responseTime: number): void {
    this.metrics.aiCalls++;
    this.metrics.aiResponseTime += responseTime;
  }

  complete(): void {
    this.metrics.endTime = Date.now();
  }

  getProgress(): number {
    return (this.metrics.processedCommits / this.metrics.totalCommits) * 100;
  }

  getMetrics(): {
    totalTime: number;
    averageAIResponseTime: number;
    commitsPerSecond: number;
  } {
    const totalTime =
      (this.metrics.endTime || Date.now()) - this.metrics.startTime;
    return {
      totalTime,
      averageAIResponseTime:
        this.metrics.aiCalls > 0
          ? this.metrics.aiResponseTime / this.metrics.aiCalls
          : 0,
      commitsPerSecond: (this.metrics.processedCommits / totalTime) * 1000,
    };
  }
}
