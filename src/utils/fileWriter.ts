import fs from 'fs';
import path from 'path';

export async function saveLog(
  content: string,
  format: string,
  outputDir: string,
  fileName?: string
): Promise<string> {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const name = fileName || 'devlog';
  const filePath = path.join(outputDir, `${name}.${format}`);

  fs.writeFileSync(filePath, content);
  return filePath;
}
