import { Config } from "../types";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { defaultConfig } from "../templates/defaultConfig";

export async function loadConfig(): Promise<Config> {
  // Load environment variables
  dotenv.config();

  // Default config location in project root
  const configPath = path.join(process.cwd(), "devlog.config.json");

  let config: Config;

  // Check if config file exists
  if (!fs.existsSync(configPath)) {
    config = { ...defaultConfig };
  } else {
    // Read and parse config file
    const configFile = fs.readFileSync(configPath, "utf-8");
    config = { ...defaultConfig, ...JSON.parse(configFile) };
  }

  // Override with environment variables if present
  if (process.env.USE_AI) {
    config.useAI = process.env.USE_AI === "true";
  }
  if (process.env.AI_INTERFACE) {
    config.aiInterface = process.env.AI_INTERFACE as Config["aiInterface"];
  }
  if (process.env.OPENAI_API_KEY && config.openai) {
    config.openai = {
      apiKey: process.env.OPENAI_API_KEY,
      model: config.openai.model || "gpt-4",
      stylePrompt:
        config.openai.stylePrompt || "Generate formal and technical logs",
    };
  }
  if (process.env.CLAUDE_API_KEY && config.claude) {
    config.claude = {
      apiKey: process.env.CLAUDE_API_KEY,
      model: config.claude.model || "claude-3",
    };
  }
  if (process.env.GEMINI_API_KEY && config.gemini) {
    config.gemini = {
      apiKey: process.env.GEMINI_API_KEY,
      model: config.gemini.model || "gemini-pro",
    };
  }
  if (process.env.KIMI_API_KEY && config.kimi) {
    config.kimi = {
      apiKey: process.env.KIMI_API_KEY,
      model: config.kimi.model || "moonshot-v1-8k",
    };
  }

  return config;
}
