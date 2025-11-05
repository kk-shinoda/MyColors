import { RGB, ColorEntry } from "../types";
import { isValidHex } from "../utils/colorFormatUtils";

/**
 * Validates RGB value input (0-255)
 */
export function validateRgbValue(
  value: string,
  colorName: string,
): string | undefined {
  if (!value.trim()) {
    return `${colorName} value is required`;
  }

  const numValue = parseInt(value, 10);
  if (isNaN(numValue)) {
    return `${colorName} must be a number`;
  }

  if (numValue < 0 || numValue > 255) {
    return `${colorName} must be between 0 and 255`;
  }

  return undefined;
}

/**
 * Validates color name input
 */
export function validateColorName(name: string): string | undefined {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return "Color name is required";
  }

  if (trimmedName.length > 50) {
    return "Color name must be 50 characters or less";
  }

  return undefined;
}

/**
 * Validates RGB object values
 */
export function validateRgbObject(rgb: RGB): boolean {
  return (
    typeof rgb.r === "number" &&
    typeof rgb.g === "number" &&
    typeof rgb.b === "number" &&
    rgb.r >= 0 &&
    rgb.r <= 255 &&
    rgb.g >= 0 &&
    rgb.g <= 255 &&
    rgb.b >= 0 &&
    rgb.b <= 255
  );
}

/**
 * Validates complete color entry
 */
export function validateColorEntry(color: ColorEntry): boolean {
  return (
    typeof color.index === "number" &&
    typeof color.name === "string" &&
    color.index >= 0 &&
    color.name.trim().length > 0 &&
    color.name.length <= 50 &&
    validateRgbObject(color.rgb)
  );
}

/**
 * Validates hex color code input
 */
export function validateHexColor(hex: string): string | undefined {
  const trimmedHex = hex.trim();

  if (!trimmedHex) {
    return undefined; // Allow empty hex input (optional field)
  }

  if (!isValidHex(trimmedHex)) {
    return "Invalid hex color format. Use #RRGGBB or #RGB format (e.g., #FF5A5A or #F5A)";
  }

  return undefined;
}

/**
 * Sanitizes RGB values to ensure they're within valid range
 */
export function sanitizeRgbValues(rgb: {
  r: number;
  g: number;
  b: number;
}): RGB {
  return {
    r: Math.max(0, Math.min(255, Math.round(rgb.r))),
    g: Math.max(0, Math.min(255, Math.round(rgb.g))),
    b: Math.max(0, Math.min(255, Math.round(rgb.b))),
  };
}
