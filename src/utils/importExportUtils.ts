import { promises as fs } from "fs";
import { ColorEntry } from "../types";
import { validateColorEntry } from "../validators/colorValidators";
import { FileOperationError } from "../utils/errorUtils";

/**
 * Export format for color palettes
 */
export interface ColorPaletteExport {
  name: string;
  version: string;
  colors: ColorEntry[];
  exportedAt: string;
}

/**
 * Exports color palette to JSON file
 */
export async function exportColorPalette(
  colors: ColorEntry[],
  filePath: string,
  paletteName: string = "MyColor Palette"
): Promise<void> {
  try {
    const exportData: ColorPaletteExport = {
      name: paletteName,
      version: "1.0.0",
      colors: colors.map((color, index) => ({ ...color, index })),
      exportedAt: new Date().toISOString(),
    };

    const jsonData = JSON.stringify(exportData, null, 2);
    await fs.writeFile(filePath, jsonData, "utf-8");
  } catch (error) {
    throw new FileOperationError(`Failed to export color palette: ${error}`, filePath);
  }
}

/**
 * Imports color palette from JSON file
 */
export async function importColorPalette(filePath: string): Promise<ColorEntry[]> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const importData = JSON.parse(fileContent);

    // Validate import data structure
    if (!importData || typeof importData !== "object") {
      throw new Error("Invalid file format");
    }

    // Handle different import formats
    let colors: unknown[];
    
    if (Array.isArray(importData)) {
      // Direct array of colors
      colors = importData;
    } else if (importData.colors && Array.isArray(importData.colors)) {
      // Palette export format
      colors = importData.colors;
    } else {
      throw new Error("No valid color data found in file");
    }

    // Validate and filter colors
    const validColors = colors
      .filter((item: unknown) => validateColorEntry(item as ColorEntry))
      .map((color, index) => ({ ...(color as ColorEntry), index }));

    if (validColors.length === 0) {
      throw new Error("No valid colors found in import file");
    }

    return validColors;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new FileOperationError("Invalid JSON file format", filePath);
    }
    throw new FileOperationError(`Failed to import color palette: ${error}`, filePath);
  }
}

/**
 * Exports colors to Adobe Swatch Exchange (ASE) format (simplified)
 * Note: This is a basic implementation for demonstration
 */
export async function exportToASE(colors: ColorEntry[], filePath: string): Promise<void> {
  try {
    // Create a simple text-based ASE-like format for demonstration
    const aseContent = colors.map(color => {
      const { r, g, b } = color.rgb;
      return `${color.name}\t${r/255}\t${g/255}\t${b/255}\tRGB`;
    }).join('\n');

    await fs.writeFile(filePath, aseContent, "utf-8");
  } catch (error) {
    throw new FileOperationError(`Failed to export ASE file: ${error}`, filePath);
  }
}

/**
 * Exports colors to CSS custom properties format
 */
export async function exportToCSS(colors: ColorEntry[], filePath: string): Promise<void> {
  try {
    const cssContent = [
      ":root {",
      ...colors.map(color => {
        const { r, g, b } = color.rgb;
        const varName = color.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return `  --color-${varName}: rgb(${r}, ${g}, ${b});`;
      }),
      "}"
    ].join('\n');

    await fs.writeFile(filePath, cssContent, "utf-8");
  } catch (error) {
    throw new FileOperationError(`Failed to export CSS file: ${error}`, filePath);
  }
}