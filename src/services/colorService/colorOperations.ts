import { ColorEntry } from "../../types";
import { loadColors, saveColors } from "./fileOperations";
import { MAX_COLORS } from "../../constants/appConstants";
import { sanitizeRgbValues } from "../../validators/colorValidators";
import {
  DuplicateColorError,
  MaxColorsReachedError,
  ColorNotFoundError,
  withErrorHandling,
} from "../../utils/errorUtils";

/**
 * Adds a new color entry to the collection
 * Handles duplicate name validation and proper indexing
 */
export async function addColor(
  name: string,
  rgb: { r: number; g: number; b: number },
): Promise<ColorEntry[]> {
  return withErrorHandling(async () => {
    // Load current colors
    const currentColors = await loadColors();

    // Check for duplicate names (case-insensitive)
    const normalizedName = name.trim();
    const isDuplicate = currentColors.some(
      (color) => color.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (isDuplicate) {
      throw new DuplicateColorError(normalizedName);
    }

    // Check if we're at the maximum limit
    if (currentColors.length >= MAX_COLORS) {
      throw new MaxColorsReachedError(MAX_COLORS);
    }

    // Create new color entry with sanitized RGB values
    const newColor: ColorEntry = {
      index: currentColors.length,
      name: normalizedName,
      rgb: sanitizeRgbValues(rgb),
    };

    // Add to collection and save
    const updatedColors = [...currentColors, newColor];
    await saveColors(updatedColors);

    return updatedColors;
  }, "Failed to add color");
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
  return withErrorHandling(async () => {
    // Load current colors
    const currentColors = await loadColors();

    // Validate index
    if (index < 0 || index >= currentColors.length) {
      throw new ColorNotFoundError(index);
    }

    // Check for duplicate names (excluding the current color)
    const normalizedName = name.trim();
    const isDuplicate = currentColors.some(
      (color, i) =>
        i !== index &&
        color.name.toLowerCase() === normalizedName.toLowerCase(),
    );

    if (isDuplicate) {
      throw new DuplicateColorError(normalizedName);
    }

    // Update the color entry with sanitized RGB values
    const updatedColors = [...currentColors];
    updatedColors[index] = {
      index,
      name: normalizedName,
      rgb: sanitizeRgbValues(rgb),
    };

    // Save updated colors
    await saveColors(updatedColors);

    return updatedColors;
  }, "Failed to edit color");
}

/**
 * Deletes a color entry by index
 * Handles proper re-indexing of remaining colors
 */
export async function deleteColor(index: number): Promise<ColorEntry[]> {
  return withErrorHandling(async () => {
    // Load current colors
    const currentColors = await loadColors();

    // Validate index
    if (index < 0 || index >= currentColors.length) {
      throw new ColorNotFoundError(index);
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
  }, "Failed to delete color");
}
