import { promises as fs } from "fs";
import { join } from "path";
import { ColorEntry } from "../types";
import { getColorDirectory, getColorFilePath } from "./fileSystemUtils";
import { FileOperationError } from "./errorUtils";

/**
 * Backup metadata interface
 */
interface BackupMetadata {
  timestamp: number;
  version: string;
  colorCount: number;
  originalFilePath: string;
}

/**
 * Backup file structure
 */
interface BackupFile {
  metadata: BackupMetadata;
  colors: ColorEntry[];
}

/**
 * Backup manager for color data
 */
export class BackupManager {
  private backupDirectory: string;
  private maxBackups: number;

  constructor(maxBackups: number = 10) {
    this.backupDirectory = join(getColorDirectory(), "backups");
    this.maxBackups = maxBackups;
  }

  /**
   * Creates a backup of current color data
   */
  async createBackup(colors: ColorEntry[], reason?: string): Promise<string> {
    try {
      // Ensure backup directory exists
      await fs.mkdir(this.backupDirectory, { recursive: true });

      // Create backup filename with timestamp
      const timestamp = Date.now();
      const dateStr = new Date(timestamp).toISOString().replace(/[:.]/g, "-");
      const reasonSuffix = reason ? `-${reason.replace(/[^a-zA-Z0-9]/g, "-")}` : "";
      const backupFileName = `colors-backup-${dateStr}${reasonSuffix}.json`;
      const backupFilePath = join(this.backupDirectory, backupFileName);

      // Create backup data
      const backupData: BackupFile = {
        metadata: {
          timestamp,
          version: "1.0.0",
          colorCount: colors.length,
          originalFilePath: getColorFilePath(),
        },
        colors: colors.map((color, index) => ({ ...color, index })),
      };

      // Write backup file
      await fs.writeFile(
        backupFilePath,
        JSON.stringify(backupData, null, 2),
        "utf-8"
      );

      // Clean up old backups
      await this.cleanupOldBackups();

      console.log(`Created backup: ${backupFileName}`);
      return backupFilePath;
    } catch (error) {
      throw new FileOperationError(`Failed to create backup: ${error}`);
    }
  }

  /**
   * Restores colors from a backup file
   */
  async restoreFromBackup(backupFilePath: string): Promise<ColorEntry[]> {
    try {
      const backupContent = await fs.readFile(backupFilePath, "utf-8");
      const backupData: BackupFile = JSON.parse(backupContent);

      // Validate backup structure
      if (!backupData.metadata || !Array.isArray(backupData.colors)) {
        throw new Error("Invalid backup file format");
      }

      console.log(
        `Restoring from backup: ${backupData.colors.length} colors from ${new Date(
          backupData.metadata.timestamp
        ).toISOString()}`
      );

      return backupData.colors;
    } catch (error) {
      throw new FileOperationError(
        `Failed to restore from backup: ${error}`,
        backupFilePath
      );
    }
  }

  /**
   * Lists available backup files
   */
  async listBackups(): Promise<Array<{ filePath: string; metadata: BackupMetadata }>> {
    try {
      const backups: Array<{ filePath: string; metadata: BackupMetadata }> = [];

      // Check if backup directory exists
      try {
        await fs.access(this.backupDirectory);
      } catch {
        return backups; // No backups directory, return empty array
      }

      const files = await fs.readdir(this.backupDirectory);
      
      for (const file of files) {
        if (file.endsWith(".json") && file.startsWith("colors-backup-")) {
          const filePath = join(this.backupDirectory, file);
          
          try {
            const content = await fs.readFile(filePath, "utf-8");
            const backupData: BackupFile = JSON.parse(content);
            
            if (backupData.metadata) {
              backups.push({
                filePath,
                metadata: backupData.metadata,
              });
            }
          } catch (error) {
            console.warn(`Failed to read backup file ${file}:`, error);
          }
        }
      }

      // Sort by timestamp (newest first)
      backups.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);

      return backups;
    } catch (error) {
      throw new FileOperationError(`Failed to list backups: ${error}`);
    }
  }

  /**
   * Deletes old backup files to maintain the maximum count
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const backups = await this.listBackups();
      
      if (backups.length > this.maxBackups) {
        const backupsToDelete = backups.slice(this.maxBackups);
        
        for (const backup of backupsToDelete) {
          try {
            await fs.unlink(backup.filePath);
            console.log(`Deleted old backup: ${backup.filePath}`);
          } catch (error) {
            console.warn(`Failed to delete backup ${backup.filePath}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to cleanup old backups:", error);
    }
  }

  /**
   * Creates an automatic backup before risky operations
   */
  async createAutoBackup(colors: ColorEntry[], operation: string): Promise<string | null> {
    try {
      return await this.createBackup(colors, `auto-${operation}`);
    } catch (error) {
      console.warn("Failed to create automatic backup:", error);
      return null;
    }
  }

  /**
   * Gets backup statistics
   */
  async getBackupStats() {
    try {
      const backups = await this.listBackups();
      
      return {
        totalBackups: backups.length,
        oldestBackup: backups.length > 0 ? new Date(backups[backups.length - 1].metadata.timestamp) : null,
        newestBackup: backups.length > 0 ? new Date(backups[0].metadata.timestamp) : null,
        totalSize: await this.calculateTotalBackupSize(),
      };
    } catch (error) {
      console.warn("Failed to get backup stats:", error);
      return {
        totalBackups: 0,
        oldestBackup: null,
        newestBackup: null,
        totalSize: 0,
      };
    }
  }

  /**
   * Calculates total size of all backup files
   */
  private async calculateTotalBackupSize(): Promise<number> {
    try {
      const backups = await this.listBackups();
      let totalSize = 0;
      
      for (const backup of backups) {
        try {
          const stats = await fs.stat(backup.filePath);
          totalSize += stats.size;
        } catch (error) {
          console.warn(`Failed to get size for backup ${backup.filePath}:`, error);
        }
      }
      
      return totalSize;
    } catch (error) {
      console.warn("Failed to calculate backup size:", error);
      return 0;
    }
  }
}

/**
 * Global backup manager instance
 */
export const backupManager = new BackupManager();