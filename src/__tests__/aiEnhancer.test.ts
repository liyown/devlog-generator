import { enhanceWithAI } from '../services/aiEnhancer';
import { Config } from '../types';
import fetch from 'node-fetch';
import { Response } from 'node-fetch';

jest.mock('node-fetch', () => jest.fn());
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('AI Enhancer', () => {
  const mockConfig: Config = {
    useAI: true,
    aiInterface: 'openai',
    openai: {
      apiKey: 'test-key',
      model: 'gpt-3.5-turbo',
      stylePrompt: 'test prompt',
    },
    logFormat: 'markdown',
    gitLogOptions: {
      maxCommits: 50,
      includeTags: false,
      groupSize: 0,
      groupByTag: false,
    },
    outputDirectory: './public',
  };

  beforeEach(() => {
    mockedFetch.mockClear();
  });

  describe('OpenAI', () => {
    it('should enhance logs successfully', async () => {
      const mockResponse = new Response(
        JSON.stringify({
          choices: [{ message: { content: 'Enhanced log' } }],
        }),
        { status: 200 }
      );
      mockedFetch.mockResolvedValueOnce(mockResponse);

      const result = await enhanceWithAI('Original log', mockConfig);
      expect(result).toBe('Enhanced log');
    });

    it('should handle API errors', async () => {
      const mockResponse = new Response(
        JSON.stringify({ error: 'API Error' }),
        { status: 400 }
      );
      mockedFetch.mockResolvedValueOnce(mockResponse);

      await expect(enhanceWithAI('Original log', mockConfig)).rejects.toThrow();
    });
  });

  describe('Claude', () => {
    const claudeConfig: Config = {
      ...mockConfig,
      aiInterface: 'claude',
      claude: {
        apiKey: 'test-key',
        model: 'claude-3-opus-20240229',
      },
    };

    it('should enhance logs successfully', async () => {
      const mockResponse = new Response(
        JSON.stringify({
          content: [{ text: 'Enhanced log' }],
        }),
        { status: 200 }
      );
      mockedFetch.mockResolvedValueOnce(mockResponse);

      const result = await enhanceWithAI('Original log', claudeConfig);
      expect(result).toBe('Enhanced log');
    });
  });

  describe('Gemini', () => {
    const geminiConfig: Config = {
      ...mockConfig,
      aiInterface: 'gemini',
      gemini: {
        apiKey: 'test-key',
        model: 'gemini-pro',
      },
    };

    it('should enhance logs successfully', async () => {
      const mockResponse = new Response(
        JSON.stringify({
          candidates: [
            {
              content: {
                parts: [{ text: 'Enhanced log' }],
              },
            },
          ],
        }),
        { status: 200 }
      );
      mockedFetch.mockResolvedValueOnce(mockResponse);

      const result = await enhanceWithAI('Original log', geminiConfig);
      expect(result).toBe('Enhanced log');
    });
  });

  describe('Kimi', () => {
    const kimiConfig: Config = {
      ...mockConfig,
      aiInterface: 'kimi',
      kimi: {
        apiKey: 'test-key',
        model: 'moonshot-v1-128k',
      },
    };

    it('should enhance logs successfully', async () => {
      const mockResponse = new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: 'Enhanced log',
              },
            },
          ],
        }),
        { status: 200 }
      );
      mockedFetch.mockResolvedValueOnce(mockResponse);

      const result = await enhanceWithAI('Original log', kimiConfig);
      expect(result).toBe('Enhanced log');
    });

    it('should handle invalid response format', async () => {
      const mockResponse = new Response(
        JSON.stringify({ invalid: 'response' }),
        { status: 200 }
      );
      mockedFetch.mockResolvedValueOnce(mockResponse);

      await expect(enhanceWithAI('Original log', kimiConfig)).rejects.toThrow(
        'Invalid response format from Kimi API'
      );
    });
  });

  describe('Error handling', () => {
    it('should handle missing API key', async () => {
      const invalidConfig: Config = {
        ...mockConfig,
        openai: { ...mockConfig.openai!, apiKey: '' },
      };

      await expect(
        enhanceWithAI('Original log', invalidConfig)
      ).rejects.toThrow('OpenAI API key not configured');
    });

    it('should handle network errors', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(enhanceWithAI('Original log', mockConfig)).rejects.toThrow();
    });
  });
});
