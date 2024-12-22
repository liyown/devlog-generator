export interface Config {
  useAI: boolean;
  aiInterface: 'openai' | 'claude' | 'gemini' | 'kimi';
  openai?: {
    apiKey: string;
    model: string;
    stylePrompt: string;
  };
  claude?: {
    apiKey: string;
    model: string;
  };
  gemini?: {
    apiKey: string;
    model: string;
  };
  kimi?: {
    apiKey: string;
    model: string;
  };
  logFormat: 'markdown' | 'json' | 'html';
  gitLogOptions: {
    maxCommits: number;
    groupSize: number;
    groupByTag: boolean;
    from?: string;
    to?: string;
  };
  outputDirectory: string;
}

export interface GitCommit {
  hash: string;
  date: string;
  author: string;
  message: string;
  tags?: string[];
}

export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
}
