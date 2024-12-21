export interface GenerateOptions {
  format: "markdown" | "json" | "html";
  outputDir: string;
  maxCommits: string;
  includeTags: boolean;
}

export interface Config {
  useAI: boolean;
  aiInterface: "openai" | "claude" | "gemini" | "kimi";
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
  logFormat: "markdown" | "json" | "html";
  gitLogOptions: {
    maxCommits: number;
    includeTags: boolean;
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