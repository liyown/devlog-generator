# Contributing to DevLog Generator

First off, thank you for considering contributing to DevLog Generator! It's people like you that make DevLog Generator such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps which reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain which behavior you expected to see instead
- Explain why this enhancement would be useful

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Follow the JavaScript/TypeScript styleguides
- Include screenshots in your pull request whenever possible
- End all files with a newline
- Avoid platform-dependent code

## Development Process

1. Fork the repo
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the tests
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/devlog-generator.git

# Navigate to the project directory
cd devlog-generator

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

### Coding Style

- Use 2 spaces for indentation
- Use semicolons
- Use meaningful variable names
- Write comments for complex logic
- Follow ESLint rules

## Project Structure

```
devlog-generator/
├── src/                # Source code
│   ├── cli/           # Command line interface
│   ├── core/          # Core functionality
│   ├── ai/            # AI service integrations
│   └── utils/         # Utility functions
├── tests/             # Test files
├── docs/              # Documentation
└── examples/          # Example configurations and usage
```

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Add integration tests for complex features
- Test edge cases

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage
```

## Documentation

- Update README.md with details of changes to the interface
- Update API documentation for new features
- Add examples for new features
- Keep the style consistent with existing documentation

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

Example:

```
feat: add support for Gemini AI service

- Implement Gemini API client
- Add configuration options
- Update documentation
- Add tests

Closes #123
```

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create a new release on GitHub
4. Publish to npm

## Questions?

Feel free to open an issue with your question or contact the maintainers directly.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
