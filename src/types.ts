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
  name: string;  // Display name (e.g., "Primary Red")
  rgb: RGB;      // RGB color values
}

/**
 * Type guard to validate if an object is a valid RGB color
 */
export function isValidRGB(obj: any): obj is RGB {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.r === 'number' &&
    typeof obj.g === 'number' &&
    typeof obj.b === 'number' &&
    obj.r >= 0 && obj.r <= 255 &&
    obj.g >= 0 && obj.g <= 255 &&
    obj.b >= 0 && obj.b <= 255
  );
}

/**
 * Type guard to validate if an object is a valid ColorEntry
 */
export function isValidColorEntry(obj: any): obj is ColorEntry {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.index === 'number' &&
    typeof obj.name === 'string' &&
    obj.name.length > 0 &&
    obj.index >= 0 &&
    isValidRGB(obj.rgb)
  );
}