# API Documentation

## Core Functions

### Git Operations

#### `getGitLogs(options: { maxCommits: number; includeTags: boolean }): Promise<GitCommit[]>`

Retrieves git commit logs with specified options.

### Log Generation

#### `generateLogs(commits: GitCommit[], format: string): Promise<string>`

Generates formatted logs from git commits.

### AI Enhancement

#### `enhanceWithAI(logs: string, config: Config): Promise<string>`

Enhances logs using configured AI service.

### Configuration

#### `loadConfig(): Promise<Config>`

Loads configuration from file or environment variables.

#### `validateConfig(config: Config): void`

Validates configuration settings.

## Types

### `Config`

```typescript
interface Config {
  useAI: boolean;
  aiInterface: "openai" | "claude" | "gemini" | "kimi";
  openai?: {
    apiKey: string;
    model: string;
    stylePrompt: string;
  };
  // ... other AI service configs
  logFormat: "markdown" | "json" | "html";
  gitLogOptions: {
    maxCommits: number;
    includeTags: boolean;
  };
  outputDirectory: string;
}
```

### `GitCommit`

```typescript
interface GitCommit {
  hash: string;
  date: string;
  author: string;
  message: string;
  tags?: string[];
}
```

## Error Handling

The library uses custom `DevLogError` class for error handling:

```typescript
class DevLogError extends Error {
  constructor(message: string, code: string, details?: any);
}
```

Common error codes:

- `CONFIG_ERROR`: Configuration related errors
- `API_ERROR`: AI service API errors
- `GIT_ERROR`: Git operation errors
- `INVALID_FORMAT`: Invalid log format errors
