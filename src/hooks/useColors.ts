import { useState, useEffect, useCallback } from "react";
import { ColorEntry } from "../types";
import { loadColors, addColor, editColor, deleteColor } from "../services/colorService";
import { formatErrorMessage } from "../utils/errorUtils";
import { undoRedoManager, ActionCreators } from "../utils/undoRedoUtils";
import { backupManager } from "../utils/backupUtils";

interface UseColorsState {
  colors: ColorEntry[];
  isLoading: boolean;
  error: string | null;
}

interface UseColorsActions {
  refreshColors: () => Promise<void>;
  addNewColor: (name: string, rgb: { r: number; g: number; b: number }) => Promise<ColorEntry[]>;
  updateColor: (index: number, name: string, rgb: { r: number; g: number; b: number }) => Promise<ColorEntry[]>;
  removeColor: (index: number) => Promise<ColorEntry[]>;
  setColors: (colors: ColorEntry[]) => void;
  clearError: () => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  createBackup: (reason?: string) => Promise<void>;
}

export interface UseColorsReturn extends UseColorsState, UseColorsActions {}

/**
 * Custom hook for color data management
 * Provides state management and operations for color collection
 * Requirements: 1.3, 1.4, 3.4
 */
export function useColors(): UseColorsReturn {
  const [colors, setColors] = useState<ColorEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Load colors with error handling and loading states
  const refreshColors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const loadedColors = await loadColors();
      setColors(loadedColors);
    } catch (err) {
      console.error("Failed to load colors:", err);
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add new color with optimistic updates and undo/redo support
  const addNewColor = useCallback(async (
    name: string,
    rgb: { r: number; g: number; b: number }
  ): Promise<ColorEntry[]> => {
    try {
      setError(null);
      
      const previousColors = [...colors];
      
      // Create backup before risky operation
      await backupManager.createAutoBackup(previousColors, "add-color");
      
      const updatedColors = await addColor(name, rgb);
      
      // Record action for undo/redo
      const addedColor = updatedColors[updatedColors.length - 1];
      const action = ActionCreators.addColor(previousColors, updatedColors, addedColor);
      undoRedoManager.recordAction(action);
      
      setColors(updatedColors);
      setCanUndo(undoRedoManager.canUndo());
      setCanRedo(undoRedoManager.canRedo());
      
      return updatedColors;
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  }, [colors]);

  // Update existing color with optimistic updates and undo/redo support
  const updateColor = useCallback(async (
    index: number,
    name: string,
    rgb: { r: number; g: number; b: number }
  ): Promise<ColorEntry[]> => {
    try {
      setError(null);
      
      const previousColors = [...colors];
      const previousColor = previousColors[index];
      
      if (!previousColor) {
        throw new Error("Color not found");
      }
      
      // Create backup before risky operation
      await backupManager.createAutoBackup(previousColors, "edit-color");
      
      const updatedColors = await editColor(index, name, rgb);
      const newColor = updatedColors[index];
      
      // Record action for undo/redo
      const action = ActionCreators.editColor(
        previousColors,
        updatedColors,
        index,
        previousColor,
        newColor
      );
      undoRedoManager.recordAction(action);
      
      setColors(updatedColors);
      setCanUndo(undoRedoManager.canUndo());
      setCanRedo(undoRedoManager.canRedo());
      
      return updatedColors;
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  }, [colors]);

  // Remove color with optimistic updates and undo/redo support
  const removeColor = useCallback(async (index: number): Promise<ColorEntry[]> => {
    try {
      setError(null);
      
      const previousColors = [...colors];
      const deletedColor = previousColors[index];
      
      if (!deletedColor) {
        throw new Error("Color not found");
      }
      
      // Create backup before risky operation
      await backupManager.createAutoBackup(previousColors, "delete-color");
      
      const updatedColors = await deleteColor(index);
      
      // Record action for undo/redo
      const action = ActionCreators.deleteColor(previousColors, updatedColors, deletedColor);
      undoRedoManager.recordAction(action);
      
      setColors(updatedColors);
      setCanUndo(undoRedoManager.canUndo());
      setCanRedo(undoRedoManager.canRedo());
      
      // Handle edge case: if all colors were deleted, clear error to show proper empty state
      if (updatedColors.length === 0) {
        setError(null);
      }
      
      return updatedColors;
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  }, [colors]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Undo last action
  const undo = useCallback(async () => {
    try {
      const previousState = undoRedoManager.undo();
      if (previousState) {
        setColors(previousState);
        setCanUndo(undoRedoManager.canUndo());
        setCanRedo(undoRedoManager.canRedo());
        
        // Save the undone state to file
        const { saveColors } = await import("../services/colorService/fileOperations");
        await saveColors(previousState);
      }
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
    }
  }, []);

  // Redo last undone action
  const redo = useCallback(async () => {
    try {
      const newState = undoRedoManager.redo();
      if (newState) {
        setColors(newState);
        setCanUndo(undoRedoManager.canUndo());
        setCanRedo(undoRedoManager.canRedo());
        
        // Save the redone state to file
        const { saveColors } = await import("../services/colorService/fileOperations");
        await saveColors(newState);
      }
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
    }
  }, []);

  // Create manual backup
  const createBackup = useCallback(async (reason?: string) => {
    try {
      await backupManager.createBackup(colors, reason);
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  }, [colors]);

  // Load colors on hook initialization
  useEffect(() => {
    refreshColors();
  }, [refreshColors]);

  // Update undo/redo state when colors change
  useEffect(() => {
    setCanUndo(undoRedoManager.canUndo());
    setCanRedo(undoRedoManager.canRedo());
  }, [colors]);

  return {
    // State
    colors,
    isLoading,
    error,
    canUndo,
    canRedo,
    
    // Actions
    refreshColors,
    addNewColor,
    updateColor,
    removeColor,
    setColors,
    clearError,
    undo,
    redo,
    createBackup,
  };
}