import { getPreferenceValues } from "@raycast/api";
import {
  ColorFormat,
  SUPPORTED_COLOR_FORMATS,
} from "../constants/appConstants";

/**
 * User preferences interface
 */
export interface UserPreferences {
  defaultColorFormat: ColorFormat;
  maxColors: number;
  showColorPreview: boolean;
  enableKeyboardShortcuts: boolean;
  autoCloseAfterCopy: boolean;
}

/**
 * Default preferences
 */
const DEFAULT_PREFERENCES: UserPreferences = {
  defaultColorFormat: "hex",
  maxColors: 15,
  showColorPreview: true,
  enableKeyboardShortcuts: true,
  autoCloseAfterCopy: true,
};

/**
 * Gets user preferences with fallback to defaults
 */
export function getUserPreferences(): UserPreferences {
  try {
    const preferences = getPreferenceValues<Partial<UserPreferences>>();

    return {
      defaultColorFormat:
        validateColorFormat(preferences.defaultColorFormat) ||
        DEFAULT_PREFERENCES.defaultColorFormat,
      maxColors:
        validateMaxColors(preferences.maxColors) ||
        DEFAULT_PREFERENCES.maxColors,
      showColorPreview:
        preferences.showColorPreview ?? DEFAULT_PREFERENCES.showColorPreview,
      enableKeyboardShortcuts:
        preferences.enableKeyboardShortcuts ??
        DEFAULT_PREFERENCES.enableKeyboardShortcuts,
      autoCloseAfterCopy:
        preferences.autoCloseAfterCopy ??
        DEFAULT_PREFERENCES.autoCloseAfterCopy,
    };
  } catch (error) {
    console.warn("Failed to load user preferences, using defaults:", error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Validates color format preference
 */
function validateColorFormat(format: unknown): ColorFormat | null {
  if (
    typeof format === "string" &&
    SUPPORTED_COLOR_FORMATS.includes(format as ColorFormat)
  ) {
    return format as ColorFormat;
  }
  return null;
}

/**
 * Validates max colors preference
 */
function validateMaxColors(maxColors: unknown): number | null {
  if (typeof maxColors === "number" && maxColors > 0 && maxColors <= 50) {
    return Math.floor(maxColors);
  }
  return null;
}
