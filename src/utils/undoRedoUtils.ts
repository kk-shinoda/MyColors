import { ColorEntry } from "../types";

/**
 * Action types for undo/redo system
 */
export type ActionType = "add" | "edit" | "delete" | "reorder";

/**
 * Action interface for undo/redo operations
 */
export interface UndoableAction {
  type: ActionType;
  timestamp: number;
  description: string;

  // State snapshots
  previousState: ColorEntry[];
  newState: ColorEntry[];

  // Action-specific data
  actionData?: {
    colorIndex?: number;
    colorData?: ColorEntry;
    previousColorData?: ColorEntry;
  };
}

/**
 * Undo/Redo manager for color operations
 */
export class UndoRedoManager {
  private undoStack: UndoableAction[] = [];
  private redoStack: UndoableAction[] = [];
  private maxHistorySize: number;

  constructor(maxHistorySize: number = 50) {
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Records an action for undo/redo
   */
  recordAction(action: UndoableAction): void {
    // Add to undo stack
    this.undoStack.push(action);

    // Clear redo stack when new action is recorded
    this.redoStack = [];

    // Limit history size
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }

    console.log(`Recorded action: ${action.description}`);
  }

  /**
   * Creates an undoable action
   */
  createAction(
    type: ActionType,
    description: string,
    previousState: ColorEntry[],
    newState: ColorEntry[],
    actionData?: UndoableAction["actionData"],
  ): UndoableAction {
    return {
      type,
      timestamp: Date.now(),
      description,
      previousState: [...previousState],
      newState: [...newState],
      actionData,
    };
  }

  /**
   * Undoes the last action
   */
  undo(): ColorEntry[] | null {
    const action = this.undoStack.pop();

    if (!action) {
      return null;
    }

    // Move to redo stack
    this.redoStack.push(action);

    console.log(`Undoing: ${action.description}`);
    return action.previousState;
  }

  /**
   * Redoes the last undone action
   */
  redo(): ColorEntry[] | null {
    const action = this.redoStack.pop();

    if (!action) {
      return null;
    }

    // Move back to undo stack
    this.undoStack.push(action);

    console.log(`Redoing: ${action.description}`);
    return action.newState;
  }

  /**
   * Checks if undo is available
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Checks if redo is available
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Gets the description of the next undo action
   */
  getUndoDescription(): string | null {
    const action = this.undoStack[this.undoStack.length - 1];
    return action ? action.description : null;
  }

  /**
   * Gets the description of the next redo action
   */
  getRedoDescription(): string | null {
    const action = this.redoStack[this.redoStack.length - 1];
    return action ? action.description : null;
  }

  /**
   * Clears all history
   */
  clearHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Gets history statistics
   */
  getHistoryStats() {
    return {
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length,
      totalActions: this.undoStack.length + this.redoStack.length,
      maxHistorySize: this.maxHistorySize,
    };
  }

  /**
   * Gets recent actions for display
   */
  getRecentActions(count: number = 10): UndoableAction[] {
    return this.undoStack.slice(-count).reverse();
  }
}

/**
 * Global undo/redo manager instance
 */
export const undoRedoManager = new UndoRedoManager();

/**
 * Helper functions for creating common actions
 */
export const ActionCreators = {
  addColor: (
    previousState: ColorEntry[],
    newState: ColorEntry[],
    addedColor: ColorEntry,
  ): UndoableAction => {
    return undoRedoManager.createAction(
      "add",
      `Add color "${addedColor.name}"`,
      previousState,
      newState,
      { colorData: addedColor },
    );
  },

  editColor: (
    previousState: ColorEntry[],
    newState: ColorEntry[],
    colorIndex: number,
    previousColor: ColorEntry,
    newColor: ColorEntry,
  ): UndoableAction => {
    return undoRedoManager.createAction(
      "edit",
      `Edit color "${previousColor.name}" to "${newColor.name}"`,
      previousState,
      newState,
      {
        colorIndex,
        previousColorData: previousColor,
        colorData: newColor,
      },
    );
  },

  deleteColor: (
    previousState: ColorEntry[],
    newState: ColorEntry[],
    deletedColor: ColorEntry,
  ): UndoableAction => {
    return undoRedoManager.createAction(
      "delete",
      `Delete color "${deletedColor.name}"`,
      previousState,
      newState,
      { colorData: deletedColor },
    );
  },

  reorderColors: (
    previousState: ColorEntry[],
    newState: ColorEntry[],
  ): UndoableAction => {
    return undoRedoManager.createAction(
      "reorder",
      "Reorder colors",
      previousState,
      newState,
    );
  },
};
