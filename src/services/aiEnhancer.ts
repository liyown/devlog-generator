import { log } from 'console';
import { Config } from '../types';
import { DevLogError } from '../utils/error';
import fetch from 'node-fetch';

export async function enhanceWithAI(
  logs: string,
  config: Config
): Promise<string> {
  try {
    switch (config.aiInterface) {
      case 'openai':
        return await enhanceWithOpenAI(logs, config);
      case 'claude':
        return await enhanceWithClaude(logs, config);
      case 'gemini':
        return await enhanceWithGemini(logs, config);
      case 'kimi':
        return await enhanceWithKimi(logs, config);
      default:
        throw new DevLogError(
          `Unsupported AI interface: ${config.aiInterface}`,
          'INVALID_AI_INTERFACE'
        );
    }
  } catch (error) {
    if (error instanceof DevLogError) {
      throw error;
    }
    throw new DevLogError(
      'Failed to enhance logs with AI',
      'AI_ENHANCEMENT_ERROR',
      error
    );
  }
}

async function enhanceWithOpenAI(
  logs: string,
  config: Config
): Promise<string> {
  if (!config.openai?.apiKey) {
    throw new DevLogError('OpenAI API key not configured', 'MISSING_API_KEY');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.openai.model,
        messages: [
          {
            role: 'system',
            content:
              config.openai.stylePrompt || 'Generate formal and technical logs',
          },
          {
            role: 'user',
            content: `Enhance the following development log:\n\n${logs}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || logs;
  } catch (error) {
    throw new DevLogError('OpenAI API call failed', 'API_ERROR', error);
  }
}

async function enhanceWithClaude(
  logs: string,
  config: Config
): Promise<string> {
  if (!config.claude?.apiKey) {
    throw new DevLogError('Claude API key not configured', 'MISSING_API_KEY');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.claude.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.claude.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `Enhance the following development log:\n\n${logs}`,
          },
        ],
        system: 'Generate formal and technical logs',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0]?.text || logs;
  } catch (error) {
    throw new DevLogError('Claude API call failed', 'API_ERROR', error);
  }
}

async function enhanceWithGemini(
  logs: string,
  config: Config
): Promise<string> {
  if (!config.gemini?.apiKey) {
    throw new DevLogError('Gemini API key not configured', 'MISSING_API_KEY');
  }

  console.log('当前组的日志：', logs);

  // Mock implementation that returns enhanced logs
  const enhancedLogs = logs
    .split('\n')
    .map(line => {
      if (line.includes('feat')) {
        return line.replace('feat', 'Feature:') + ' - Added new functionality';
      }
      if (line.includes('fix')) {
        return line.replace('fix', 'Bugfix:') + ' - Resolved issue';
      }
      if (line.includes('docs')) {
        return line.replace('docs', 'Documentation:') + ' - Updated docs';
      }
      if (line.includes('chore')) {
        return line.replace('chore', 'Maintenance:') + ' - General updates';
      }
      if (line.includes('refactor')) {
        return (
          line.replace('refactor', 'Code Improvement:') +
          ' - Enhanced code structure'
        );
      }
      return line;
    })
    .join('\n');

  console.log('增强后的日志：', enhancedLogs);

  return enhancedLogs;
}

async function enhanceWithKimi(logs: string, config: Config): Promise<string> {
  if (!config.kimi?.apiKey) {
    throw new DevLogError('Kimi API key not configured', 'MISSING_API_KEY');
  }

  try {
    const response = await fetch(
      'https://api.moonshot.cn/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.kimi.apiKey}`,
        },
        body: JSON.stringify({
          model: config.kimi.model,
          messages: [
            {
              role: 'system',
              content: 'Generate formal and technical logs',
            },
            {
              role: 'user',
              content: `Enhance the following development log:\n\n${logs}`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Kimi API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    throw new DevLogError('Kimi API call failed', 'API_ERROR', error);
  }
}

// ... 实现其他 AI 服务的增强函数
