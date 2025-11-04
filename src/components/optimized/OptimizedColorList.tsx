import React, { memo, useMemo, useCallback } from "react";
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
import { useLazyLoading } from "../../utils/lazyLoadingUtils";

/**
 * Optimized color list item component with React.memo
 */
const ColorListItem = memo(
  ({
    color,
    onCopy,
    onEdit,
    onDelete,
  }: {
    color: ColorEntry;
    onCopy: (color: ColorEntry) => void;
    onEdit: (color: ColorEntry) => void;
    onDelete: (color: ColorEntry) => void;
  }) => {
    // Memoize color conversion to avoid recalculation
    const rgbColor = useMemo((): Color => {
      const { r, g, b } = color.rgb;
      const toHex = (value: number) => {
        const hex = Math.max(0, Math.min(255, Math.round(value))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}` as Color;
    }, [color.rgb]);

    // Memoize formatted hex string
    const hexString = useMemo(() => formatHexString(color), [color]);

    // Memoize action handlers to prevent unnecessary re-renders
    const handleCopy = useCallback(() => onCopy(color), [color, onCopy]);
    const handleEdit = useCallback(() => onEdit(color), [color, onEdit]);
    const handleDelete = useCallback(() => onDelete(color), [color, onDelete]);

    return (
      <List.Item
        key={color.index}
        title={color.name}
        subtitle={hexString}
        icon={{
          source: Icon.Circle,
          tintColor: rgbColor,
        }}
        accessories={[
          {
            text: hexString,
            icon: {
              source: Icon.Circle,
              tintColor: rgbColor,
            },
          },
        ]}
        actions={
          <ActionPanel>
            <ActionPanel.Section>
              <Action
                title="Copy Hex Color to Clipboard"
                icon={Icon.Clipboard}
                onAction={handleCopy}
              />
            </ActionPanel.Section>

            <ActionPanel.Section>
              <Action
                title="Edit Color"
                icon={Icon.Pencil}
                onAction={handleEdit}
              />
              <Action
                title="Delete Color"
                icon={Icon.Trash}
                style={Action.Style.Destructive}
                onAction={handleDelete}
              />
            </ActionPanel.Section>
          </ActionPanel>
        }
      />
    );
  },
);

ColorListItem.displayName = "ColorListItem";

/**
 * Optimized color list component with performance enhancements
 * Requirements: 1.1, 1.2, 4.2
 */
const OptimizedColorList = memo(() => {
  const { push } = useNavigation();
  const { colors, isLoading, error, refreshColors, removeColor, setColors } =
    useColors();

  // Use lazy loading for large color collections
  const {
    items: visibleColors,
    hasMore,
    isLoading: isLoadingMore,
    loadMore,
    shouldLoadMore,
  } = useLazyLoading(colors, { pageSize: 20, threshold: 5 });

  // Memoize action handlers
  const handleColorCopy = useCallback(async (color: ColorEntry) => {
    await copyHexToClipboard(color);
  }, []);

  const handleAddColor = useCallback(() => {
    push(<AddColorForm onColorAdded={setColors} />);
  }, [push, setColors]);

  const handleEditColor = useCallback(
    (color: ColorEntry) => {
      push(<EditColorForm color={color} onColorEdited={setColors} />);
    },
    [push, setColors],
  );

  const handleDeleteColor = useCallback(
    async (color: ColorEntry) => {
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
    },
    [removeColor],
  );

  // Memoize empty state actions
  const emptyStateActions = useMemo(
    () => (
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
    ),
    [handleAddColor, refreshColors],
  );

  // Memoize error state actions
  const errorStateActions = useMemo(
    () => (
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
    ),
    [refreshColors, handleAddColor],
  );

  // Memoize main actions
  const mainActions = useMemo(
    () => (
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
    ),
    [handleAddColor, refreshColors],
  );

  return (
    <List
      isLoading={isLoading || isLoadingMore}
      searchBarPlaceholder={UI_TEXT.SEARCH_PLACEHOLDER}
      navigationTitle={UI_TEXT.NAVIGATION_TITLE}
      actions={mainActions}
    >
      {error ? (
        <List.EmptyView
          icon={Icon.ExclamationMark}
          title={UI_TEXT.ERROR_STATE_TITLE}
          description={error}
          actions={errorStateActions}
        />
      ) : visibleColors.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Circle}
          title={UI_TEXT.EMPTY_STATE_TITLE}
          description={UI_TEXT.EMPTY_STATE_DESCRIPTION}
          actions={emptyStateActions}
        />
      ) : (
        <>
          {visibleColors.map((color, index) => {
            // Check if we should load more items
            if (shouldLoadMore(index)) {
              loadMore();
            }

            return (
              <ColorListItem
                key={`${color.index}-${color.name}`}
                color={color}
                onCopy={handleColorCopy}
                onEdit={handleEditColor}
                onDelete={handleDeleteColor}
              />
            );
          })}

          {hasMore && (
            <List.Item
              title="Loading more colors..."
              icon={Icon.ArrowClockwise}
            />
          )}
        </>
      )}
    </List>
  );
});

OptimizedColorList.displayName = "OptimizedColorList";

export default OptimizedColorList;
