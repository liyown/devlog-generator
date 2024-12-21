import { getGitLogs } from '../utils/git';
import simpleGit, { SimpleGit, LogResult, DefaultLogFields } from 'simple-git';
import { DevLogError } from '../utils/error';

jest.mock('simple-git');
const mockedSimpleGit = simpleGit as jest.MockedFunction<typeof simpleGit>;

describe('Git Utils', () => {
  const mockGit = {
    checkIsRepo: jest.fn(),
    log: jest.fn(),
  } as unknown as jest.Mocked<SimpleGit>;

  beforeEach(() => {
    mockedSimpleGit.mockReturnValue(mockGit);
    mockGit.checkIsRepo.mockClear();
    mockGit.log.mockClear();
  });

  it('should get git logs successfully', async () => {
    const mockLogs: LogResult<DefaultLogFields> = {
      all: [
        {
          hash: 'abc123',
          date: '2024-03-20T10:00:00Z',
          author_name: 'Test User',
          author_email: 'test@example.com',
          message: 'test commit',
          body: '',
          refs: 'tag: v1.0.0',
        },
      ],
      total: 1,
      latest: {
        hash: 'abc123',
        date: '2024-03-20T10:00:00Z',
        author_name: 'Test User',
        author_email: 'test@example.com',
        message: 'test commit',
        body: '',
        refs: 'tag: v1.0.0',
      },
    };

    mockGit.checkIsRepo.mockResolvedValue(true);
    mockGit.log.mockResolvedValue(mockLogs);

    const logs = await getGitLogs({
      maxCommits: 10,
      includeTags: true,
    });

    expect(logs).toHaveLength(1);
    expect(logs[0]).toEqual({
      hash: 'abc123',
      date: '2024-03-20T10:00:00Z',
      author: 'Test User',
      message: 'test commit',
      tags: ['tag: v1.0.0'],
    });
  });

  it('should handle non-git repository', async () => {
    mockGit.checkIsRepo.mockResolvedValue(false);

    await expect(
      getGitLogs({ maxCommits: 10, includeTags: false })
    ).rejects.toThrow(DevLogError);
  });

  it('should handle git errors', async () => {
    mockGit.checkIsRepo.mockResolvedValue(true);
    mockGit.log.mockRejectedValue(new Error('Git error'));

    await expect(
      getGitLogs({ maxCommits: 10, includeTags: false })
    ).rejects.toThrow(DevLogError);
  });

  it('should handle empty git logs', async () => {
    mockGit.checkIsRepo.mockResolvedValue(true);
    mockGit.log.mockResolvedValue({
      all: [],
      total: 0,
      latest: null,
    } as LogResult<DefaultLogFields>);

    const logs = await getGitLogs({
      maxCommits: 10,
      includeTags: false,
    });

    expect(logs).toHaveLength(0);
  });
});
