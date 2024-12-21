import fs from "fs";
import path from "path";

export async function saveLog(
  content: string,
  format: string,
  outputDir: string
): Promise<string> {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `devlog-${timestamp}.${format}`;
  const filePath = path.join(outputDir, fileName);

  await fs.promises.writeFile(filePath, content, "utf-8");
  return filePath;
}
