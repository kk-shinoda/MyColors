/**
 * Application constants and configuration values
 */

/**
 * Maximum number of colors to load (requirement 1.2)
 */
export const MAX_COLORS = 15;

/**
 * Color name constraints
 */
export const COLOR_NAME_MAX_LENGTH = 50;

/**
 * RGB value constraints
 */
export const RGB_MIN_VALUE = 0;
export const RGB_MAX_VALUE = 255;

/**
 * File paths and directories
 */
export const APP_SUPPORT_DIR_NAME = "raycast-my-color";
export const COLORS_FILE_NAME = "colors.json";

/**
 * Default color format for clipboard operations
 */
export const DEFAULT_COLOR_FORMAT = "hex" as const;

/**
 * Supported color formats
 */
export const SUPPORTED_COLOR_FORMATS = ["hex", "rgb", "hsl", "cmyk"] as const;
export type ColorFormat = typeof SUPPORTED_COLOR_FORMATS[number];

/**
 * Toast message durations (in milliseconds)
 */
export const TOAST_DURATION = {
  SUCCESS: 2000,
  ERROR: 4000,
  INFO: 3000,
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  ADD_COLOR: { modifiers: ["cmd"] as const, key: "n" },
  REFRESH: { modifiers: ["cmd"] as const, key: "r" },
  EDIT: { modifiers: ["cmd"] as const, key: "e" },
  DELETE: { modifiers: ["cmd"] as const, key: "delete" },
} as const;

/**
 * UI text constants
 */
export const UI_TEXT = {
  NAVIGATION_TITLE: "MyColor - Your Favorite RGB Colors",
  SEARCH_PLACEHOLDER: "Search colors...",
  EMPTY_STATE_TITLE: "No Colors Available",
  EMPTY_STATE_DESCRIPTION: "Add your first color to get started",
  ERROR_STATE_TITLE: "Error Loading Colors",
  LOADING_MESSAGE: "Loading colors...",
} as const;