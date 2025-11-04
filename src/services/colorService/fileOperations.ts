import { promises as fs } from "fs";
import { ColorEntry, isValidColorEntry } from "../../types";
import { DEFAULT_COLORS } from "./defaultColors";
import { MAX_COLORS } from "../../constants/appConstants";
import {
  getColorDirectory,
  getColorFilePath,
  ensureDirectoryExists,
  fileExists,
  readJsonFile,
  writeJsonFile,
} from "../../utils/fileSystemUtils";
import { FileOperationError, withErrorHandling } from "../../utils/errorUtils";
import { CachedColorOperations } from "../../utils/cacheUtils";

/**
 * Path to the colors.json file
 */
export const COLOR_FILE_PATH = getColorFilePath();

/**
 * Ensures the color file exists, creating it with default colors if necessary
 * Creates the directory structure if it doesn't exist
 * Requirements: 1.4, 4.3
 */
export async function ensureColorFile(): Promise<void> {
  return withErrorHandling(async () => {
    const exists = await fileExists(COLOR_FILE_PATH);
    
    if (!exists) {
      // Ensure directory exists
      await ensureDirectoryExists(getColorDirectory());
      
      // Write default colors to file
      await writeJsonFile(COLOR_FILE_PATH, DEFAULT_COLORS);
      
      console.log("Created default colors file");
    }
  }, "Failed to ensure color file exists");
}

/**
 * Loads colors from the local JSON file with caching
 * Handles file not found scenarios and validates color data
 * Requirements: 1.3, 4.2, 4.3
 */
export async function loadColors(): Promise<ColorEntry[]> {
  try {
    // Check cache first
    const cachedColors = CachedColorOperations.getCachedColors();
    
    // Check if file has changed since last cache
    const filePath = COLOR_FILE_PATH;
    let shouldUseCache = false;
    
    if (cachedColors && await fileExists(filePath)) {
      try {
        const stats = await fs.stat(filePath);
        const currentMetadata = {
          lastModified: stats.mtime.getTime(),
          size: stats.size,
        };
        
        if (!CachedColorOperations.hasFileChanged(currentMetadata)) {
          shouldUseCache = true;
        } else {
          // Update cached metadata
          CachedColorOperations.setCachedFileMetadata(currentMetadata);
        }
      } catch (error) {
        console.warn("Failed to check file metadata:", error);
      }
    }
    
    if (shouldUseCache && cachedColors) {
      return cachedColors;
    }

    // Ensure the color file exists first
    await ensureColorFile();

    // Try to read the colors file
    const parsedData = await readJsonFile<unknown>(COLOR_FILE_PATH);

    // Validate that we have an array
    if (!Array.isArray(parsedData)) {
      console.warn(
        "Colors file does not contain an array, falling back to defaults",
      );
      const colors = DEFAULT_COLORS;
      CachedColorOperations.setCachedColors(colors);
      return colors;
    }

    // Filter and validate color entries
    const validColors = parsedData
      .filter((item: unknown) => isValidColorEntry(item))
      .slice(0, MAX_COLORS); // Limit to maximum colors (requirement 1.2)

    // If no valid colors found, return defaults
    if (validColors.length === 0) {
      console.warn("No valid colors found in file, falling back to defaults");
      const colors = DEFAULT_COLORS;
      CachedColorOperations.setCachedColors(colors);
      return colors;
    }

    // Cache the loaded colors
    CachedColorOperations.setCachedColors(validColors);
    
    return validColors;
  } catch (error) {
    // Handle file not found or JSON parsing errors
    if (error instanceof Error) {
      console.warn(`Failed to load colors: ${error.message}`);
    }

    // Return default colors as fallback (requirement 4.3)
    const colors = DEFAULT_COLORS;
    CachedColorOperations.setCachedColors(colors);
    return colors;
  }
}

/**
 * Saves colors array to the local JSON file with cache invalidation
 * Ensures proper file system operations and error handling
 */
export async function saveColors(colors: ColorEntry[]): Promise<void> {
  return withErrorHandling(async () => {
    // Ensure directory exists
    await ensureDirectoryExists(getColorDirectory());

    // Validate and limit colors to maximum
    const validColors = colors
      .filter((color) => isValidColorEntry(color))
      .slice(0, MAX_COLORS);

    // Re-index colors to ensure proper ordering
    const reindexedColors = validColors.map((color, index) => ({
      ...color,
      index,
    }));

    // Write colors to file
    await writeJsonFile(COLOR_FILE_PATH, reindexedColors);

    // Update cache with new data
    CachedColorOperations.setCachedColors(reindexedColors);
    
    // Update file metadata cache
    try {
      const stats = await fs.stat(COLOR_FILE_PATH);
      CachedColorOperations.setCachedFileMetadata({
        lastModified: stats.mtime.getTime(),
        size: stats.size,
      });
    } catch (error) {
      console.warn("Failed to update file metadata cache:", error);
    }

    console.log(`Saved ${reindexedColors.length} colors to file`);
  }, "Failed to save colors to file");
}