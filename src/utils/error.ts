export class DevLogError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = "DevLogError";
  }
}

export function handleError(error: unknown): never {
  if (error instanceof DevLogError) {
    console.error(`Error [${error.code}]: ${error.message}`);
    if (error.details) {
      console.error("Details:", error.details);
    }
  } else {
    console.error("Unexpected error:", error);
  }
  process.exit(1);
}
