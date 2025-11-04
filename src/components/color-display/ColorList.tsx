import {
  List,
  Color,
  Icon,
  ActionPanel,
  Action,
  showToast,
  Toast,
} from "@raycast/api";
import { useNavigation } from "@raycast/api";
import { ColorEntry } from "../../types";
import { copyHexToClipboard, formatHexString } from "../../actions/copyAction";
import { AddColorForm, EditColorForm } from "../color-management";
import { useColors } from "../../hooks";
import { UI_TEXT } from "../../constants/appConstants";
import { showDeleteConfirmation } from "../shared";

/**
 * Main Raycast command component for listing and copying colors
 * Requirements: 1.1, 1.2, 3.1, 3.2, 3.3
 */
export default function ColorList() {
  const { push } = useNavigation();
  const { colors, isLoading, error, refreshColors, removeColor, setColors } =
    useColors();

  // Handle color selection and copy action (requirements 2.1, 2.2, 2.3, 2.4)
  const handleColorCopy = async (color: ColorEntry) => {
    await copyHexToClipboard(color);
  };

  // Handle adding new color
  const handleAddColor = () => {
    push(<AddColorForm onColorAdded={setColors} />);
  };

  // Handle editing existing color
  const handleEditColor = (color: ColorEntry) => {
    push(<EditColorForm color={color} onColorEdited={setColors} />);
  };

  // Handle deleting color with confirmation and proper state management
  const handleDeleteColor = async (color: ColorEntry) => {
    const confirmed = await showDeleteConfirmation(color.name, "color");

    if (confirmed) {
      try {
        await removeColor(color.index);

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
      searchBarPlaceholder={UI_TEXT.SEARCH_PLACEHOLDER}
      navigationTitle={UI_TEXT.NAVIGATION_TITLE}
      actions={
        <ActionPanel>
          <Action
            title="Add New Color"
            icon={Icon.Plus}
            onAction={handleAddColor}
          />
          <Action
            title="Refresh Colors"
            icon={Icon.ArrowClockwise}
            onAction={refreshColors}
          />
        </ActionPanel>
      }
    >
      {error ? (
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title={UI_TEXT.ERROR_STATE_TITLE}
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
                onAction={handleAddColor}
              />
            </ActionPanel>
          }
        />
      ) : colors.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Circle}
          title={UI_TEXT.EMPTY_STATE_TITLE}
          description={UI_TEXT.EMPTY_STATE_DESCRIPTION}
          actions={
            <ActionPanel>
              <Action
                title="Add New Color"
                icon={Icon.Plus}
                onAction={handleAddColor}
              />
              <Action
                title="Refresh"
                icon={Icon.ArrowClockwise}
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
                    onAction={handleAddColor}
                  />
                  <Action
                    title="Edit Color"
                    icon={Icon.Pencil}
                    onAction={() => handleEditColor(color)}
                  />
                  <Action
                    title="Delete Color"
                    icon={Icon.Trash}
                    style={Action.Style.Destructive}
                    onAction={() => handleDeleteColor(color)}
                  />
                </ActionPanel.Section>

                <ActionPanel.Section>
                  <Action
                    title="Refresh Colors"
                    icon={Icon.ArrowClockwise}
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
