/**
 * RGB color value representation
 * Each component (red, green, blue) should be in the range 0-255
 */
export interface RGB {
  r: number; // Red value (0-255)
  g: number; // Green value (0-255)
  b: number; // Blue value (0-255)
}

/**
 * Color entry representing a single color in the user's collection
 * Used for displaying colors in the Raycast list interface
 */
export interface ColorEntry {
  index: number; // Index for ordering (0-based)
  name: string; // Display name (e.g., "Primary Red")
  rgb: RGB; // RGB color values
}

/**
 * Type guard to validate if an object is a valid RGB color
 */
export function isValidRGB(obj: unknown): obj is RGB {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const record = obj as Record<string, unknown>;

  return (
    "r" in record &&
    "g" in record &&
    "b" in record &&
    typeof record.r === "number" &&
    typeof record.g === "number" &&
    typeof record.b === "number" &&
    record.r >= 0 &&
    record.r <= 255 &&
    record.g >= 0 &&
    record.g <= 255 &&
    record.b >= 0 &&
    record.b <= 255
  );
}

/**
 * Type guard to validate if an object is a valid ColorEntry
 */
export function isValidColorEntry(obj: unknown): obj is ColorEntry {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const record = obj as Record<string, unknown>;

  return (
    "index" in record &&
    "name" in record &&
    "rgb" in record &&
    typeof record.index === "number" &&
    typeof record.name === "string" &&
    typeof record.name === "string" &&
    record.name.length > 0 &&
    record.index >= 0 &&
    isValidRGB(record.rgb)
  );
}
