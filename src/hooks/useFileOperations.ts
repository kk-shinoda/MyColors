import { useState, useCallback } from "react";
import { ColorEntry } from "../types";
import { 
  loadColors as loadColorsService,
  saveColors as saveColorsService,
  ensureColorFile,
} from "../services/colorService/fileOperations";
import { formatErrorMessage } from "../utils/errorUtils";

interface UseFileOperationsState {
  isLoading: boolean;
  error: string | null;
  lastOperation: string | null;
}

interface UseFileOperationsActions {
  loadColors: () => Promise<ColorEntry[]>;
  saveColors: (colors: ColorEntry[]) => Promise<void>;
  initializeColorFile: () => Promise<void>;
  clearError: () => void;
}

export interface UseFileOperationsReturn extends UseFileOperationsState, UseFileOperationsActions {}

/**
 * Custom hook for file system operations
 * Provides state management for file I/O operations with loading states and error handling
 * Requirements: 1.3, 1.4, 4.2, 4.3
 */
export function useFileOperations(): UseFileOperationsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<string | null>(null);

  // Load colors from file
  const loadColors = useCallback(async (): Promise<ColorEntry[]> => {
    try {
      setIsLoading(true);
      setError(null);
      setLastOperation("Loading colors");

      const colors = await loadColorsService();
      
      setLastOperation("Colors loaded successfully");
      return colors;
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      setLastOperation("Failed to load colors");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save colors to file
  const saveColors = useCallback(async (colors: ColorEntry[]): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setLastOperation("Saving colors");

      await saveColorsService(colors);
      
      setLastOperation("Colors saved successfully");
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      setLastOperation("Failed to save colors");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize color file with defaults if it doesn't exist
  const initializeColorFile = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setLastOperation("Initializing color file");

      await ensureColorFile();
      
      setLastOperation("Color file initialized");
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      setLastOperation("Failed to initialize color file");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    error,
    lastOperation,
    
    // Actions
    loadColors,
    saveColors,
    initializeColorFile,
    clearError,
  };
}