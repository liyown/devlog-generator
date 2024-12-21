# Contributing Guide

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/devlog-generator.git
cd devlog-generator
```

2. Install dependencies:

```bash
npm install
```

3. Run tests:

```bash
npm test
```

## Development Workflow

1. Create a new branch for your feature:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and ensure:

   - All tests pass
   - Linter shows no errors
   - Types are properly defined
   - Documentation is updated

3. Commit your changes:

```bash
git commit -m "feat: add your feature"
```

4. Push to your fork and submit a pull request

## Code Style

- Use TypeScript for all new code
- Follow the existing code style (Prettier + ESLint)
- Add JSDoc comments for public APIs
- Keep code modular and maintainable

## Testing

- Write unit tests for new features
- Run tests: `npm test`
- Run linter: `npm run lint`
- Run type check: `npm run type-check`
- Maintain test coverage

## Documentation

- Update README.md for user-facing changes
- Update API.md for API changes
- Add JSDoc comments for new functions
- Keep documentation clear and up-to-date

## Pull Request Guidelines

1. Branch Naming

   - feature/\* for new features
   - fix/\* for bug fixes
   - docs/\* for documentation changes

2. Commit Messages

   - Follow conventional commits format
   - Include clear descriptions
   - Reference issues if applicable

3. Before Submitting

   - Ensure all tests pass
   - Update documentation
   - Add tests for new features
   - Squash unnecessary commits

4. Review Process
   - Address review comments promptly
   - Keep discussions focused
   - Update PR based on feedback
   - Be responsive to questions

## Issue Guidelines

1. Bug Reports

   - Include reproduction steps
   - Specify environment details
   - Provide error messages
   - Add relevant code snippets

2. Feature Requests

   - Explain the use case
   - Describe expected behavior
   - Provide examples if possible

## Development Best Practices

1. Code Quality

   - Follow SOLID principles
   - Write self-documenting code
   - Keep functions small and focused
   - Use meaningful variable names

2. Performance

   - Consider memory usage
   - Optimize expensive operations
   - Use caching when appropriate
   - Profile code when needed

3. Security

   - Handle sensitive data carefully
   - Validate user inputs
   - Follow security best practices
   - Keep dependencies updated
