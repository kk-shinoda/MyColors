import { Color, Icon } from "@raycast/api";
import { ColorEntry, RGB } from "../../types";

interface ColorPreviewProps {
  color?: ColorEntry;
  rgb?: RGB;
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

/**
 * Reusable color preview component
 * Displays color swatch with optional text
 * Requirements: 3.1, 3.3
 */
export default function ColorPreview({
  color,
  rgb,
  size = "medium",
  showText = false,
}: ColorPreviewProps) {
  // Use color from ColorEntry or direct RGB values
  const rgbValues = color?.rgb || rgb;

  if (!rgbValues) {
    return null;
  }

  // Convert RGB values to Raycast Color for preview
  const getRgbColor = (rgbVals: RGB): Color => {
    const { r, g, b } = rgbVals;
    // Convert RGB values to hex format for Raycast Color
    const toHex = (value: number) => {
      const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}` as Color;
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return { width: 16, height: 16 };
      case "medium":
        return { width: 24, height: 24 };
      case "large":
        return { width: 32, height: 32 };
      default:
        return { width: 24, height: 24 };
    }
  };

  const colorValue = getRgbColor(rgbValues);
  const iconSize = getIconSize();

  if (showText && color) {
    return {
      text: color.name,
      icon: {
        source: Icon.Circle,
        tintColor: colorValue,
        ...iconSize,
      },
    };
  }

  return {
    source: Icon.Circle,
    tintColor: colorValue,
    ...iconSize,
  };
}
