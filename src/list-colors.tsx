import {
  List,
  Color,
  Icon,
  ActionPanel,
  Action,
  showToast,
  Toast,
  confirmAlert,
  Alert,
} from "@raycast/api";
import { useNavigation } from "@raycast/api";
import { useState, useEffect } from "react";
import { ColorEntry } from "./types";
import { loadColors, deleteColor } from "./services/colorService";
import { copyHexToClipboard, formatHexString } from "./actions/copyAction";
import AddColorForm from "./components/AddColorForm";
import EditColorForm from "./components/EditColorForm";

/**
 * Main Raycast command component for listing and copying colors
 * Requirements: 1.1, 1.2, 3.1, 3.2, 3.3
 */
export default function ListColorsCommand() {
  const [colors, setColors] = useState<ColorEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { push } = useNavigation();

  // Load colors on component initialization (requirement 1.3, 1.4)
  useEffect(() => {
    loadColorsData();
  }, []);

  // Centralized function to load colors with proper error handling
  const loadColorsData = async () => {
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
  };

  // Handle color selection and copy action (requirements 2.1, 2.2, 2.3, 2.4)
  const handleColorCopy = async (color: ColorEntry) => {
    await copyHexToClipboard(color);
  };

  // Handle adding new color
  const handleAddColor = () => {
    push(<AddColorForm onColorAdded={handleColorsUpdated} />);
  };

  // Handle editing existing color
  const handleEditColor = (color: ColorEntry) => {
    push(<EditColorForm color={color} onColorEdited={handleColorsUpdated} />);
  };

  // Handle deleting color with confirmation and proper state management
  const handleDeleteColor = async (color: ColorEntry) => {
    const confirmed = await confirmAlert({
      title: "Delete Color",
      message: `Are you sure you want to delete "${color.name}"?`,
      primaryAction: {
        title: "Delete",
        style: Alert.ActionStyle.Destructive,
      },
    });

    if (confirmed) {
      try {
        const updatedColors = await deleteColor(color.index);
        handleColorsUpdated(updatedColors);

        await showToast({
          style: Toast.Style.Success,
          title: "Color Deleted",
          message: `"${color.name}" has been removed from your collection`,
        });
      } catch (error) {
        console.error("Failed to delete color:", error);

        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to Delete Color",
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        });
      }
    }
  };

  // Handle colors updated from forms with proper state management
  const handleColorsUpdated = (updatedColors: ColorEntry[]) => {
    setColors(updatedColors);

    // Handle edge case: if all colors were deleted, ensure we show proper empty state
    if (updatedColors.length === 0) {
      setError(null); // Clear any previous errors to show empty state properly
    }
  };

  // Refresh colors from file (useful for handling external changes)
  const refreshColors = async () => {
    await loadColorsData();
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
      actions={
        <ActionPanel>
          <Action
            title="Add New Color"
            icon={Icon.Plus}
            shortcut={{ modifiers: ["cmd"], key: "n" }}
            onAction={handleAddColor}
          />
          <Action
            title="Refresh Colors"
            icon={Icon.ArrowClockwise}
            shortcut={{ modifiers: ["cmd"], key: "r" }}
            onAction={refreshColors}
          />
        </ActionPanel>
      }
    >
      {error ? (
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title="Error Loading Colors"
          description={error}
          actions={
            <ActionPanel>
              <Action
                title="Retry Loading Colors"
                icon={Icon.ArrowClockwise}
                onAction={refreshColors}
              />
              <Action
                title="Add New Color"
                icon={Icon.Plus}
                shortcut={{ modifiers: ["cmd"], key: "n" }}
                onAction={handleAddColor}
              />
            </ActionPanel>
          }
        />
      ) : colors.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Circle}
          title="No Colors Available"
          description="Add your first color to get started"
          actions={
            <ActionPanel>
              <Action
                title="Add New Color"
                icon={Icon.Plus}
                shortcut={{ modifiers: ["cmd"], key: "n" }}
                onAction={handleAddColor}
              />
              <Action
                title="Refresh"
                icon={Icon.ArrowClockwise}
                shortcut={{ modifiers: ["cmd"], key: "r" }}
                onAction={refreshColors}
              />
            </ActionPanel>
          }
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
                <ActionPanel.Section>
                  <Action
                    title="Copy Hex Color to Clipboard"
                    icon={Icon.Clipboard}
                    onAction={() => handleColorCopy(color)}
                  />
                </ActionPanel.Section>

                <ActionPanel.Section>
                  <Action
                    title="Add New Color"
                    icon={Icon.Plus}
                    shortcut={{ modifiers: ["cmd"], key: "n" }}
                    onAction={handleAddColor}
                  />
                  <Action
                    title="Edit Color"
                    icon={Icon.Pencil}
                    shortcut={{ modifiers: ["cmd"], key: "e" }}
                    onAction={() => handleEditColor(color)}
                  />
                  <Action
                    title="Delete Color"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    shortcut={{ modifiers: ["cmd"], key: "delete" }}
                    onAction={() => handleDeleteColor(color)}
                  />
                </ActionPanel.Section>

                <ActionPanel.Section>
                  <Action
                    title="Refresh Colors"
                    icon={Icon.ArrowClockwise}
                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                    onAction={refreshColors}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
