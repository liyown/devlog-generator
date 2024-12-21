import { program } from "commander";
import { generate } from "../commands/generate";
import { init } from "../commands/init";
import { showConfig } from "../commands/config";
import { validate } from "../commands/validate";
import { clean } from "../commands/clean";
import { batchGenerate } from "../commands/batch";

jest.mock("../commands/generate");
jest.mock("../commands/init");
jest.mock("../commands/config");
jest.mock("../commands/validate");
jest.mock("../commands/clean");
jest.mock("../commands/batch");

describe("CLI", () => {
  const mockGenerate = generate as jest.MockedFunction<typeof generate>;
  const mockInit = init as jest.MockedFunction<typeof init>;
  const mockShowConfig = showConfig as jest.MockedFunction<typeof showConfig>;
  const mockValidate = validate as jest.MockedFunction<typeof validate>;
  const mockClean = clean as jest.MockedFunction<typeof clean>;
  const mockBatchGenerate = batchGenerate as jest.MockedFunction<
    typeof batchGenerate
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    process.exitCode = undefined;
  });

  it("should handle generate command", async () => {
    process.argv = [
      "node",
      "cli.js",
      "generate",
      "--format",
      "html",
      "--output-dir",
      "./logs",
    ];

    await program.parseAsync(process.argv);

    expect(mockGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        format: "html",
        outputDir: "./logs",
      })
    );
  });

  it("should handle init command", async () => {
    process.argv = ["node", "cli.js", "init"];

    await program.parseAsync(process.argv);

    expect(mockInit).toHaveBeenCalled();
  });

  it("should handle config command", async () => {
    process.argv = ["node", "cli.js", "config"];

    await program.parseAsync(process.argv);

    expect(mockShowConfig).toHaveBeenCalled();
  });

  it("should handle validate command", async () => {
    process.argv = ["node", "cli.js", "validate"];

    await program.parseAsync(process.argv);

    expect(mockValidate).toHaveBeenCalled();
  });

  it("should handle clean command", async () => {
    process.argv = [
      "node",
      "cli.js",
      "clean",
      "--all",
      "--format",
      "html",
      "--before",
      "2024-03-20",
    ];

    await program.parseAsync(process.argv);

    expect(mockClean).toHaveBeenCalledWith(
      expect.objectContaining({
        all: true,
        format: "html",
        before: "2024-03-20",
      })
    );
  });

  it("should handle batch command", async () => {
    process.argv = [
      "node",
      "cli.js",
      "batch",
      "--start-date",
      "2024-01-01",
      "--end-date",
      "2024-03-20",
      "--format",
      "html",
      "--tags",
      "v1.0.0",
      "v1.1.0",
    ];

    await program.parseAsync(process.argv);

    expect(mockBatchGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        startDate: "2024-01-01",
        endDate: "2024-03-20",
        format: "html",
        tags: ["v1.0.0", "v1.1.0"],
      })
    );
  });

  it("should handle invalid commands", async () => {
    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
    const mockConsoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    process.argv = ["node", "cli.js", "invalid-command"];

    await program.parseAsync(process.argv);

    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalled();

    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });

  it("should handle command errors", async () => {
    const mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
    mockGenerate.mockRejectedValue(new Error("Test error"));

    process.argv = ["node", "cli.js", "generate"];

    await program.parseAsync(process.argv);

    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
  });
});
