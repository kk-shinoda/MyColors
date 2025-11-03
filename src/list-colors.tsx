import { List, Color, Icon, ActionPanel, Action } from "@raycast/api";
import { useState, useEffect } from "react";
import { ColorEntry } from "./types";
import { loadColors } from "./services/colorService";
import { copyHexToClipboard, formatHexString } from "./actions/copyAction";

/**
 * Main Raycast command component for listing and copying colors
 * Requirements: 1.1, 1.2, 3.1, 3.2, 3.3
 */
export default function ListColorsCommand() {
  const [colors, setColors] = useState<ColorEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load colors on component initialization (requirement 1.3, 1.4)
  useEffect(() => {
    async function initializeColors() {
      try {
        setIsLoading(true);
        setError(null);

        const loadedColors = await loadColors();
        setColors(loadedColors);
      } catch (err) {
        console.error("Failed to load colors:", err);
        setError("Failed to load colors. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    initializeColors();
  }, []);

  // Handle color selection and copy action (requirements 2.1, 2.2, 2.3, 2.4)
  const handleColorCopy = async (color: ColorEntry) => {
    await copyHexToClipboard(color);
  };

  // Convert RGB values to Raycast Color for preview (requirement 3.1, 3.3)
  const getRgbColor = (color: ColorEntry): Color => {
    const { r, g, b } = color.rgb;
    // Convert RGB values to hex format for Raycast Color
    const toHex = (value: number) => {
      const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}` as Color;
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search colors..."
      navigationTitle="MyColor - Your Favorite RGB Colors"
    >
      {error ? (
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Error Loading Colors"
          description={error}
        />
      ) : colors.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Circle}
          title="No Colors Available"
          description="No colors found in your collection"
        />
      ) : (
        colors.map((color) => (
          <List.Item
            key={color.index}
            title={color.name}
            subtitle={formatHexString(color)}
            icon={{
              source: Icon.Circle,
              tintColor: getRgbColor(color),
            }}
            accessories={[
              {
                text: formatHexString(color),
                icon: {
                  source: Icon.Circle,
                  tintColor: getRgbColor(color),
                },
              },
            ]}
            actions={
              <ActionPanel>
                <Action
                  title="Copy Hex Color to Clipboard"
                  icon={Icon.Clipboard}
                  onAction={() => handleColorCopy(color)}
                />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
