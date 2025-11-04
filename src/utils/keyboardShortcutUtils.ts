import { KEYBOARD_SHORTCUTS } from "../constants/appConstants";

/**
 * Custom keyboard shortcut configuration
 */
export interface KeyboardShortcut {
  modifiers: string[];
  key: string;
}

export interface CustomShortcuts {
  addColor?: KeyboardShortcut;
  refresh?: KeyboardShortcut;
  edit?: KeyboardShortcut;
  delete?: KeyboardShortcut;
  copy?: KeyboardShortcut;
}

/**
 * Gets keyboard shortcuts with user customizations
 */
export function getKeyboardShortcuts(customShortcuts?: CustomShortcuts) {
  return {
    ADD_COLOR: customShortcuts?.addColor || KEYBOARD_SHORTCUTS.ADD_COLOR,
    REFRESH: customShortcuts?.refresh || KEYBOARD_SHORTCUTS.REFRESH,
    EDIT: customShortcuts?.edit || KEYBOARD_SHORTCUTS.EDIT,
    DELETE: customShortcuts?.delete || KEYBOARD_SHORTCUTS.DELETE,
  };
}

/**
 * Validates keyboard shortcut format
 */
export function validateKeyboardShortcut(
  shortcut: unknown,
): KeyboardShortcut | null {
  if (
    typeof shortcut === "object" &&
    shortcut !== null &&
    "modifiers" in shortcut &&
    "key" in shortcut
  ) {
    const { modifiers, key } = shortcut as { modifiers: unknown; key: unknown };

    if (
      Array.isArray(modifiers) &&
      modifiers.every((mod) => typeof mod === "string") &&
      typeof key === "string"
    ) {
      return { modifiers, key };
    }
  }

  return null;
}

/**
 * Formats keyboard shortcut for display
 */
export function formatShortcutDisplay(shortcut: KeyboardShortcut): string {
  const modifierMap: Record<string, string> = {
    cmd: "⌘",
    ctrl: "⌃",
    alt: "⌥",
    shift: "⇧",
  };

  const formattedModifiers = shortcut.modifiers
    .map((mod) => modifierMap[mod.toLowerCase()] || mod)
    .join("");

  return `${formattedModifiers}${shortcut.key.toUpperCase()}`;
}
