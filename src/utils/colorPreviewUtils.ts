import { Color } from "@raycast/api";

/**
 * Convert RGB values to Raycast Color format
 */
export function rgbToRaycastColor(r: number, g: number, b: number): Color {
  const toHex = (value: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}` as Color;
}

/**
 * Check if RGB values are valid
 */
export function isValidRgb(r: number, g: number, b: number): boolean {
  return (
    !isNaN(r) &&
    !isNaN(g) &&
    !isNaN(b) &&
    r >= 0 &&
    r <= 255 &&
    g >= 0 &&
    g <= 255 &&
    b >= 0 &&
    b <= 255
  );
}

/**
 * Get current color for preview with fallback
 */
export function getCurrentPreviewColor(
  rgbValues: { r: string; g: string; b: string },
  fallbackRgb?: { r: number; g: number; b: number },
): Color {
  const r = parseInt(rgbValues.r, 10);
  const g = parseInt(rgbValues.g, 10);
  const b = parseInt(rgbValues.b, 10);

  // Use valid RGB values or fallback
  if (isValidRgb(r, g, b)) {
    return rgbToRaycastColor(r, g, b);
  }

  if (fallbackRgb) {
    return rgbToRaycastColor(fallbackRgb.r, fallbackRgb.g, fallbackRgb.b);
  }

  return "#808080" as Color; // Default gray color
}
