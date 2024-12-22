import { Config } from '../types';

export const defaultConfig: Config = {
  useAI: false,
  aiInterface: 'gemini',
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
    model: 'gemini-1.5-flash',
  },
  kimi: {
    apiKey: '',
    model: 'moonshot-v1-128k',
  },
  logFormat: 'html',
  gitLogOptions: {
    maxCommits: 50,
    groupSize: 5,
    groupByTag: false,
    from: undefined,
    to: undefined,
  },
  outputDirectory: './public',
};
