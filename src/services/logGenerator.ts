import { GitCommit } from "../types";
import fs from "fs";
import path from "path";

export async function generateLogs(
  commits: GitCommit[],
  format: string
): Promise<string> {
  switch (format) {
    case "markdown":
      return generateMarkdown(commits);
    case "json":
      return generateJSON(commits);
    case "html":
      return generateHTML(commits);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function generateMarkdown(commits: GitCommit[]): string {
  let markdown = "# Development Log\n\n";

  commits.forEach((commit) => {
    markdown += `## ${new Date(commit.date).toLocaleDateString()}\n\n`;
    markdown += `**Author:** ${commit.author}\n\n`;
    markdown += `**Commit:** ${commit.hash}\n\n`;
    markdown += `${commit.message}\n\n`;
    if (commit.tags && commit.tags.length > 0) {
      markdown += `**Tags:** ${commit.tags.join(", ")}\n\n`;
    }
    markdown += "---\n\n";
  });

  return markdown;
}

function generateJSON(commits: GitCommit[]): string {
  return JSON.stringify({ commits }, null, 2);
}

function generateHTML(commits: GitCommit[]): string {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Development Log</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .commit { border-bottom: 1px solid #eee; padding: 20px 0; }
    .date { color: #666; }
    .author { color: #333; }
    .hash { color: #999; font-family: monospace; }
    .tags { color: #0066cc; }
  </style>
</head>
<body>
  <h1>Development Log</h1>
`;

  commits.forEach((commit) => {
    html += `
  <div class="commit">
    <div class="date">${new Date(commit.date).toLocaleDateString()}</div>
    <div class="author">Author: ${commit.author}</div>
    <div class="hash">Commit: ${commit.hash}</div>
    <p>${commit.message}</p>
    ${commit.tags && commit.tags.length > 0 ? `<div class="tags">Tags: ${commit.tags.join(", ")}</div>` : ""}
  </div>`;
  });

  html += `
</body>
</html>`;

  return html;
}
