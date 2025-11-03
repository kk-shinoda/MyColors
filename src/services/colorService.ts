import { promises as fs } from "fs";
import { join } from "path";
import { homedir } from "os";
import { ColorEntry, isValidColorEntry } from "../types";

/**
 * Path to the color storage directory
 */
const COLOR_DIR = join(
  homedir(),
  "Library",
  "Application Support",
  "raycast-my-color",
);

/**
 * Path to the colors.json file
 */
const COLOR_FILE_PATH = join(COLOR_DIR, "colors.json");

/**
 * Maximum number of colors to load (requirement 1.2)
 */
const MAX_COLORS = 15;

/**
 * Default colors to create when no file exists (requirement 1.4)
 */
const DEFAULT_COLORS: ColorEntry[] = [
  {
    index: 0,
    name: "Primary Red",
    rgb: { r: 255, g: 90, b: 90 },
  },
  {
    index: 1,
    name: "Ocean Blue",
    rgb: { r: 52, g: 152, b: 219 },
  },
  {
    index: 2,
    name: "Forest Green",
    rgb: { r: 46, g: 204, b: 113 },
  },
  {
    index: 3,
    name: "Sunset Orange",
    rgb: { r: 255, g: 165, b: 0 },
  },
  {
    index: 4,
    name: "Purple Accent",
    rgb: { r: 155, g: 89, b: 182 },
  },
];

/**
 * Ensures the color file exists, creating it with default colors if necessary
 * Creates the directory structure if it doesn't exist
 * Requirements: 1.4, 4.3
 */
export async function ensureColorFile(): Promise<void> {
  try {
    // Check if file already exists
    await fs.access(COLOR_FILE_PATH);
    return; // File exists, nothing to do
  } catch {
    // File doesn't exist, create it with defaults
    try {
      // Ensure directory exists
      await fs.mkdir(COLOR_DIR, { recursive: true });

      // Write default colors to file
      const defaultColorsJson = JSON.stringify(DEFAULT_COLORS, null, 2);
      await fs.writeFile(COLOR_FILE_PATH, defaultColorsJson, "utf-8");

      console.log("Created default colors file");
    } catch (error) {
      console.error("Failed to create default colors file:", error);
      throw error;
    }
  }
}

/**
 * Loads colors from the local JSON file
 * Handles file not found scenarios and validates color data
 * Requirements: 1.3, 4.2, 4.3
 */
export async function loadColors(): Promise<ColorEntry[]> {
  try {
    // Ensure the color file exists first
    await ensureColorFile();

    // Try to read the colors file
    const fileContent = await fs.readFile(COLOR_FILE_PATH, "utf-8");
    const parsedData = JSON.parse(fileContent);

    // Validate that we have an array
    if (!Array.isArray(parsedData)) {
      console.warn(
        "Colors file does not contain an array, falling back to defaults",
      );
      return DEFAULT_COLORS;
    }

    // Filter and validate color entries
    const validColors = parsedData
      .filter((item: unknown) => isValidColorEntry(item))
      .slice(0, MAX_COLORS); // Limit to maximum colors (requirement 1.2)

    // If no valid colors found, return defaults
    if (validColors.length === 0) {
      console.warn("No valid colors found in file, falling back to defaults");
      return DEFAULT_COLORS;
    }

    return validColors;
  } catch (error) {
    // Handle file not found or JSON parsing errors
    if (error instanceof Error) {
      console.warn(`Failed to load colors: ${error.message}`);
    }

    // Return default colors as fallback (requirement 4.3)
    return DEFAULT_COLORS;
  }
}

/**
 * Saves colors array to the local JSON file
 * Ensures proper file system operations and error handling
 */
export async function saveColors(colors: ColorEntry[]): Promise<void> {
  try {
    // Ensure directory exists
    await fs.mkdir(COLOR_DIR, { recursive: true });

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
    const colorsJson = JSON.stringify(reindexedColors, null, 2);
    await fs.writeFile(COLOR_FILE_PATH, colorsJson, "utf-8");

    console.log(`Saved ${reindexedColors.length} colors to file`);
  } catch (error) {
    console.error("Failed to save colors:", error);
    throw new Error("Failed to save colors to file");
  }
}

/**
 * Adds a new color entry to the collection
 * Handles duplicate name validation and proper indexing
 */
export async function addColor(
  name: string,
  rgb: { r: number; g: number; b: number },
): Promise<ColorEntry[]> {
  try {
    // Load current colors
    const currentColors = await loadColors();

    // Check for duplicate names (case-insensitive)
    const normalizedName = name.trim();
    const isDuplicate = currentColors.some(
      (color) => color.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (isDuplicate) {
      throw new Error(
        `A color with the name "${normalizedName}" already exists`,
      );
    }

    // Check if we're at the maximum limit
    if (currentColors.length >= MAX_COLORS) {
      throw new Error(
        `Cannot add more colors. Maximum limit of ${MAX_COLORS} colors reached`,
      );
    }

    // Create new color entry
    const newColor: ColorEntry = {
      index: currentColors.length,
      name: normalizedName,
      rgb: {
        r: Math.max(0, Math.min(255, Math.round(rgb.r))),
        g: Math.max(0, Math.min(255, Math.round(rgb.g))),
        b: Math.max(0, Math.min(255, Math.round(rgb.b))),
      },
    };

    // Add to collection and save
    const updatedColors = [...currentColors, newColor];
    await saveColors(updatedColors);

    return updatedColors;
  } catch (error) {
    console.error("Failed to add color:", error);
    throw error;
  }
}

/**
 * Edits an existing color entry by index
 * Handles validation and duplicate name checking
 */
export async function editColor(
  index: number,
  name: string,
  rgb: { r: number; g: number; b: number },
): Promise<ColorEntry[]> {
  try {
    // Load current colors
    const currentColors = await loadColors();

    // Validate index
    if (index < 0 || index >= currentColors.length) {
      throw new Error(`Invalid color index: ${index}`);
    }

    // Check for duplicate names (excluding the current color)
    const normalizedName = name.trim();
    const isDuplicate = currentColors.some(
      (color, i) =>
        i !== index &&
        color.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (isDuplicate) {
      throw new Error(
        `A color with the name "${normalizedName}" already exists`,
      );
    }

    // Update the color entry
    const updatedColors = [...currentColors];
    updatedColors[index] = {
      index,
      name: normalizedName,
      rgb: {
        r: Math.max(0, Math.min(255, Math.round(rgb.r))),
        g: Math.max(0, Math.min(255, Math.round(rgb.g))),
        b: Math.max(0, Math.min(255, Math.round(rgb.b))),
      },
    };

    // Save updated colors
    await saveColors(updatedColors);

    return updatedColors;
  } catch (error) {
    console.error("Failed to edit color:", error);
    throw error;
  }
}

/**
 * Deletes a color entry by index
 * Handles proper re-indexing of remaining colors
 */
export async function deleteColor(index: number): Promise<ColorEntry[]> {
  try {
    // Load current colors
    const currentColors = await loadColors();

    // Validate index
    if (index < 0 || index >= currentColors.length) {
      throw new Error(`Invalid color index: ${index}`);
    }

    // Remove the color and re-index remaining colors
    const updatedColors = currentColors
      .filter((_, i) => i !== index)
      .map((color, newIndex) => ({
        ...color,
        index: newIndex,
      }));

    // Save updated colors
    await saveColors(updatedColors);

    return updatedColors;
  } catch (error) {
    console.error("Failed to delete color:", error);
    throw error;
  }
}
