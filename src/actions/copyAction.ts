import { Clipboard, showToast, Toast, closeMainWindow } from "@raycast/api";
import { ColorEntry, RGB } from "../types";

/**
 * Formats RGB values as "rgb(r, g, b)" string
 * Validates numeric values and ensures proper formatting
 * Requirement: 2.2
 */
export function formatRgbString(color: ColorEntry): string {
  const { r, g, b } = color.rgb;

  // Validate RGB values are within valid range (0-255)
  const validR = Math.max(0, Math.min(255, Math.round(r)));
  const validG = Math.max(0, Math.min(255, Math.round(g)));
  const validB = Math.max(0, Math.min(255, Math.round(b)));

  return `rgb(${validR}, ${validG}, ${validB})`;
}

/**
 * Alternative function to format RGB values directly from RGB object
 * Useful for cases where we only have RGB values without full ColorEntry
 */
export function formatRgbFromValues(rgb: RGB): string {
  const { r, g, b } = rgb;

  // Validate RGB values are within valid range (0-255)
  const validR = Math.max(0, Math.min(255, Math.round(r)));
  const validG = Math.max(0, Math.min(255, Math.round(g)));
  const validB = Math.max(0, Math.min(255, Math.round(b)));

  return `rgb(${validR}, ${validG}, ${validB})`;
}

/**
 * Copies the RGB value of a color to the clipboard with user feedback
 * Uses Raycast API to copy formatted RGB string to clipboard
 * Provides user feedback with toast notification and closes Raycast interface
 * Requirements: 2.1, 2.3, 2.4
 */
export async function copyRgbToClipboard(color: ColorEntry): Promise<void> {
  try {
    // Format the RGB string
    const rgbString = formatRgbString(color);

    // Copy to clipboard using Raycast API
    await Clipboard.copy(rgbString);

    // Show success toast notification (requirement 2.3)
    await showToast({
      style: Toast.Style.Success,
      title: "RGB Copied!",
      message: `${color.name}: ${rgbString}`,
    });

    // Close Raycast interface after successful copy (requirement 2.4)
    await closeMainWindow();
  } catch (error) {
    // Handle clipboard errors gracefully
    console.error("Failed to copy RGB to clipboard:", error);

    // Show error toast notification
    await showToast({
      style: Toast.Style.Failure,
      title: "Copy Failed",
      message: "Unable to copy RGB value to clipboard",
    });
  }
}
