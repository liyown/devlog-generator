import { generateLogs } from "../services/logGenerator";
import { GitCommit } from "../types";

describe("Log Generator", () => {
  const mockCommits: GitCommit[] = [
    {
      hash: "abc123",
      date: "2024-03-20T10:00:00Z",
      author: "Test User",
      message: "feat: add new feature",
      tags: ["v1.0.0"],
    },
    {
      hash: "def456",
      date: "2024-03-21T11:00:00Z",
      author: "Another User",
      message: "fix: bug fix",
      tags: [],
    },
  ];

  describe("HTML format", () => {
    it("should generate HTML logs", async () => {
      const logs = await generateLogs(mockCommits, "html");
      expect(logs).toContain("<!DOCTYPE html>");
      expect(logs).toContain("feat: add new feature");
      expect(logs).toContain("fix: bug fix");
      expect(logs).toContain("Test User");
      expect(logs).toContain("v1.0.0");
    });
  });

  describe("Markdown format", () => {
    it("should generate Markdown logs", async () => {
      const logs = await generateLogs(mockCommits, "markdown");
      expect(logs).toContain("# Development Log");
      expect(logs).toContain("## 2024-03-20");
      expect(logs).toContain("feat: add new feature");
      expect(logs).toContain("Test User");
      expect(logs).toContain("v1.0.0");
    });
  });

  describe("JSON format", () => {
    it("should generate JSON logs", async () => {
      const logs = await generateLogs(mockCommits, "json");
      const parsed = JSON.parse(logs);
      expect(parsed.commits).toHaveLength(2);
      expect(parsed.commits[0].message).toBe("feat: add new feature");
      expect(parsed.commits[0].tags).toContain("v1.0.0");
    });
  });

  describe("Error handling", () => {
    it("should handle empty commits", async () => {
      const logs = await generateLogs([], "html");
      expect(logs).toContain("No commits found");
    });

    it("should handle invalid format", async () => {
      await expect(generateLogs(mockCommits, "xml" as any)).rejects.toThrow(
        "Unsupported format",
      );
    });
  });
});
