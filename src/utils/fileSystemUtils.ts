import { promises as fs } from "fs";
import { join } from "path";
import { homedir } from "os";

/**
 * File system utility functions for color data management
 */

/**
 * Gets the color storage directory path
 */
export function getColorDirectory(): string {
  return join(homedir(), "Library", "Application Support", "raycast-my-color");
}

/**
 * Gets the color file path
 */
export function getColorFilePath(): string {
  return join(getColorDirectory(), "colors.json");
}

/**
 * Ensures a directory exists, creating it if necessary
 */
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error);
    throw new Error(`Failed to create directory: ${dirPath}`);
  }
}

/**
 * Checks if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads and parses JSON file
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error) {
    console.error(`Failed to read JSON file ${filePath}:`, error);
    throw new Error(`Failed to read file: ${filePath}`);
  }
}

/**
 * Writes data to JSON file with proper formatting
 */
export async function writeJsonFile<T>(
  filePath: string,
  data: T,
): Promise<void> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString, "utf-8");
  } catch (error) {
    console.error(`Failed to write JSON file ${filePath}:`, error);
    throw new Error(`Failed to write file: ${filePath}`);
  }
}
