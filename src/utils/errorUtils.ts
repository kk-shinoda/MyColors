/**
 * Error handling utilities with consistent error types
 */

/**
 * Custom error types for the application
 */
export class ColorValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ColorValidationError";
  }
}

export class FileOperationError extends Error {
  constructor(
    message: string,
    public readonly filePath?: string,
  ) {
    super(message);
    this.name = "FileOperationError";
  }
}

export class ColorNotFoundError extends Error {
  constructor(identifier: string | number) {
    super(`Color not found: ${identifier}`);
    this.name = "ColorNotFoundError";
  }
}

export class DuplicateColorError extends Error {
  constructor(colorName: string) {
    super(`A color with the name "${colorName}" already exists`);
    this.name = "DuplicateColorError";
  }
}

export class MaxColorsReachedError extends Error {
  constructor(maxColors: number) {
    super(
      `Cannot add more colors. Maximum limit of ${maxColors} colors reached`,
    );
    this.name = "MaxColorsReachedError";
  }
}

/**
 * Wraps async operations with consistent error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage, error);

    // Re-throw known error types
    if (
      error instanceof ColorValidationError ||
      error instanceof FileOperationError ||
      error instanceof ColorNotFoundError ||
      error instanceof DuplicateColorError ||
      error instanceof MaxColorsReachedError
    ) {
      throw error;
    }

    // Wrap unknown errors
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred",
    );
  }
}

/**
 * Formats error messages for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof ColorValidationError) {
    return `Validation Error: ${error.message}`;
  }

  if (error instanceof FileOperationError) {
    return `File Error: ${error.message}`;
  }

  if (error instanceof ColorNotFoundError) {
    return `Not Found: ${error.message}`;
  }

  if (error instanceof DuplicateColorError) {
    return `Duplicate: ${error.message}`;
  }

  if (error instanceof MaxColorsReachedError) {
    return `Limit Reached: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}
