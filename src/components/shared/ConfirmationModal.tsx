import { confirmAlert, Alert } from "@raycast/api";

interface ConfirmationModalOptions {
  title: string;
  message: string;
  confirmTitle?: string;
  cancelTitle?: string;
  confirmStyle?: Alert.ActionStyle;
}

/**
 * Reusable confirmation modal utility
 * Provides consistent confirmation dialog behavior
 */
export async function showConfirmationModal({
  title,
  message,
  confirmTitle = "Confirm",
  cancelTitle = "Cancel",
  confirmStyle = Alert.ActionStyle.Default,
}: ConfirmationModalOptions): Promise<boolean> {
  return await confirmAlert({
    title,
    message,
    primaryAction: {
      title: confirmTitle,
      style: confirmStyle,
    },
    dismissAction: {
      title: cancelTitle,
    },
  });
}

/**
 * Specific confirmation for destructive actions
 */
export async function showDeleteConfirmation(
  itemName: string,
  itemType: string = "item"
): Promise<boolean> {
  return showConfirmationModal({
    title: `Delete ${itemType}`,
    message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    confirmTitle: "Delete",
    confirmStyle: Alert.ActionStyle.Destructive,
  });
}