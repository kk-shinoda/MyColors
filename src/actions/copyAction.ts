import { Clipboard, showToast, Toast, closeMainWindow } from "@raycast/api";
import { ColorEntry } from "../types";
import {
  formatHexString,
  formatRgbString,
  formatHslString,
  formatCmykString,
} from "../utils/colorFormatUtils";
import { ColorFormat } from "../constants/appConstants";
import { getUserPreferences } from "../utils/settingsUtils";

// Re-export for backward compatibility
export { formatHexString } from "../utils/colorFormatUtils";

/**
 * Copies color in specified format to clipboard
 * Requirements: 2.1, 2.3, 2.4
 */
export async function copyColorToClipboard(
  color: ColorEntry,
  format?: ColorFormat,
): Promise<void> {
  try {
    // Get user preferences for default format if not specified
    const preferences = getUserPreferences();
    const selectedFormat = format || preferences.defaultColorFormat;

    // Format the color string based on the specified format
    let colorString: string;
    let formatName: string;

    switch (selectedFormat) {
      case "hex":
        colorString = formatHexString(color);
        formatName = "Hex";
        break;
      case "rgb":
        colorString = formatRgbString(color);
        formatName = "RGB";
        break;
      case "hsl":
        colorString = formatHslString(color);
        formatName = "HSL";
        break;
      case "cmyk":
        colorString = formatCmykString(color);
        formatName = "CMYK";
        break;
      default:
        colorString = formatHexString(color);
        formatName = "Hex";
    }

    // Copy to clipboard using Raycast API
    await Clipboard.copy(colorString);

    // Show success toast notification (requirement 2.3)
    await showToast({
      style: Toast.Style.Success,
      title: `${formatName} Color Copied!`,
      message: `${color.name}: ${colorString}`,
    });

    // Close Raycast interface after successful copy if enabled in preferences (requirement 2.4)
    if (preferences.autoCloseAfterCopy) {
      await closeMainWindow();
    }
  } catch (error) {
    // Handle clipboard errors gracefully
    console.error("Failed to copy color to clipboard:", error);

    // Show error toast notification
    await showToast({
      style: Toast.Style.Failure,
      title: "Copy Failed",
      message: "Unable to copy color to clipboard",
    });
  }
}

/**
 * Copies the hex color value to the clipboard with user feedback (backward compatibility)
 * Requirements: 2.1, 2.3, 2.4
 */
export async function copyHexToClipboard(color: ColorEntry): Promise<void> {
  return copyColorToClipboard(color, "hex");
}
