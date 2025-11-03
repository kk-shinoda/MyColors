import { Clipboard, showToast, Toast, closeMainWindow } from "@raycast/api";
import { ColorEntry, RGB } from "../types";

/**
 * Formats RGB values as hex color string "#RRGGBB"
 * Validates numeric values and ensures proper formatting
 * Requirement: 2.2
 */
export function formatHexString(color: ColorEntry): string {
  const { r, g, b } = color.rgb;

  // Validate RGB values are within valid range (0-255)
  const validR = Math.max(0, Math.min(255, Math.round(r)));
  const validG = Math.max(0, Math.min(255, Math.round(g)));
  const validB = Math.max(0, Math.min(255, Math.round(b)));

  // Convert to hex and pad with zeros if necessary
  const hexR = validR.toString(16).padStart(2, "0");
  const hexG = validG.toString(16).padStart(2, "0");
  const hexB = validB.toString(16).padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
}

/**
 * Alternative function to format RGB values directly from RGB object as hex
 * Useful for cases where we only have RGB values without full ColorEntry
 */
export function formatHexFromValues(rgb: RGB): string {
  const { r, g, b } = rgb;

  // Validate RGB values are within valid range (0-255)
  const validR = Math.max(0, Math.min(255, Math.round(r)));
  const validG = Math.max(0, Math.min(255, Math.round(g)));
  const validB = Math.max(0, Math.min(255, Math.round(b)));

  // Convert to hex and pad with zeros if necessary
  const hexR = validR.toString(16).padStart(2, "0");
  const hexG = validG.toString(16).padStart(2, "0");
  const hexB = validB.toString(16).padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
}

/**
 * Copies the hex color value to the clipboard with user feedback
 * Uses Raycast API to copy formatted hex string to clipboard
 * Provides user feedback with toast notification and closes Raycast interface
 * Requirements: 2.1, 2.3, 2.4
 */
export async function copyHexToClipboard(color: ColorEntry): Promise<void> {
  try {
    // Format the hex string
    const hexString = formatHexString(color);

    // Copy to clipboard using Raycast API
    await Clipboard.copy(hexString);

    // Show success toast notification (requirement 2.3)
    await showToast({
      style: Toast.Style.Success,
      title: "Hex Color Copied!",
      message: `${color.name}: ${hexString}`,
    });

    // Close Raycast interface after successful copy (requirement 2.4)
    await closeMainWindow();
  } catch (error) {
    // Handle clipboard errors gracefully
    console.error("Failed to copy hex color to clipboard:", error);

    // Show error toast notification
    await showToast({
      style: Toast.Style.Failure,
      title: "Copy Failed",
      message: "Unable to copy hex color to clipboard",
    });
  }
}
