import { Config } from '../types';

export const defaultConfig: Config = {
  useAI: false,
  aiInterface: 'openai',
  openai: {
    apiKey: '',
    model: 'gpt-3.5-turbo',
    stylePrompt: 'Generate formal and technical logs',
  },
  claude: {
    apiKey: '',
    model: 'claude-3-opus-20240229',
  },
  gemini: {
    apiKey: '',
    model: 'gemini-pro',
  },
  kimi: {
    apiKey: '',
    model: 'moonshot-v1-128k',
  },
  logFormat: 'html',
  gitLogOptions: {
    maxCommits: 50,
    includeTags: false,
    groupSize: 0,
    groupByTag: false,
  },
  outputDirectory: './public',
};
