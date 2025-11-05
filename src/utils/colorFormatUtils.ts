import { RGB, ColorEntry } from "../types";

/**
 * Color formatting utilities supporting multiple formats
 */

/**
 * Converts a number to a 2-digit hex string
 */
function toHex(value: number): string {
  const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

/**
 * Formats RGB values as hex color string "#RRGGBB"
 */
export function formatAsHex(rgb: RGB): string {
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

/**
 * Formats RGB values as CSS rgb() string
 */
export function formatAsRgb(rgb: RGB): string {
  const r = Math.max(0, Math.min(255, Math.round(rgb.r)));
  const g = Math.max(0, Math.min(255, Math.round(rgb.g)));
  const b = Math.max(0, Math.min(255, Math.round(rgb.b)));
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Formats RGB values as HSL string
 */
export function formatAsHsl(rgb: RGB): string {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  // Calculate lightness
  const l = (max + min) / 2;

  // Calculate saturation
  let s = 0;
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
  }

  // Calculate hue
  let h = 0;
  if (diff !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / diff + 2) / 6;
        break;
      case b:
        h = ((r - g) / diff + 4) / 6;
        break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/**
 * Formats RGB values as CMYK string
 */
export function formatAsCmyk(rgb: RGB): string {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

  return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
}

/**
 * Formats ColorEntry as hex string (backward compatibility)
 */
export function formatHexString(color: ColorEntry): string {
  return formatAsHex(color.rgb);
}

/**
 * Formats ColorEntry as RGB string
 */
export function formatRgbString(color: ColorEntry): string {
  return formatAsRgb(color.rgb);
}

/**
 * Formats ColorEntry as HSL string
 */
export function formatHslString(color: ColorEntry): string {
  return formatAsHsl(color.rgb);
}

/**
 * Formats ColorEntry as CMYK string
 */
export function formatCmykString(color: ColorEntry): string {
  return formatAsCmyk(color.rgb);
}

/**
 * Validates if a string is a valid hex color code
 * Supports both #RRGGBB and #RGB formats
 */
export function isValidHex(hex: string): boolean {
  if (!hex || typeof hex !== 'string') {
    return false;
  }

  const cleanHex = hex.replace("#", "");
  
  // Check for 3-digit or 6-digit hex
  if (cleanHex.length !== 3 && cleanHex.length !== 6) {
    return false;
  }

  // Check if all characters are valid hex digits
  return /^[0-9A-Fa-f]+$/.test(cleanHex);
}

/**
 * Normalizes hex color code to 6-digit format
 * Converts #RGB to #RRGGBB and ensures # prefix
 */
export function normalizeHex(hex: string): string {
  if (!hex) {
    return "";
  }

  let cleanHex = hex.replace("#", "").toUpperCase();
  
  // Convert 3-digit to 6-digit format
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }

  return `#${cleanHex}`;
}

/**
 * Converts hex color code to RGB values
 * Supports both #RRGGBB and #RGB formats
 */
export function hexToRgb(hex: string): RGB | null {
  if (!isValidHex(hex)) {
    return null;
  }

  const normalizedHex = normalizeHex(hex);
  const cleanHex = normalizedHex.replace("#", "");

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }

  return { r, g, b };
}

/**
 * Parses hex color string to RGB values (backward compatibility)
 * @deprecated Use hexToRgb instead
 */
export function parseHexToRgb(hex: string): RGB | null {
  return hexToRgb(hex);
}
