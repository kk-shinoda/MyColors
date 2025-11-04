import { promises as fs } from "fs";
import { ColorEntry } from "../types";
import { getColorFilePath } from "./fileSystemUtils";
import { CachedColorOperations } from "./cacheUtils";

/**
 * Background sync manager for color data
 */
export class BackgroundSyncManager {
  private syncInterval: NodeJS.Timeout | null = null;
  private isWatching = false;
  private lastKnownModTime = 0;
  private onDataChange?: (colors: ColorEntry[]) => void;

  /**
   * Starts background sync with file watching
   */
  startSync(
    onDataChange: (colors: ColorEntry[]) => void,
    intervalMs: number = 30000 // 30 seconds default
  ): void {
    if (this.isWatching) {
      return;
    }

    this.onDataChange = onDataChange;
    this.isWatching = true;

    // Start periodic file checking
    this.syncInterval = setInterval(() => {
      this.checkForFileChanges();
    }, intervalMs);

    console.log("Background sync started");
  }

  /**
   * Stops background sync
   */
  stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    this.isWatching = false;
    this.onDataChange = undefined;

    console.log("Background sync stopped");
  }

  /**
   * Checks if the color file has been modified externally
   */
  private async checkForFileChanges(): Promise<void> {
    try {
      const filePath = getColorFilePath();
      const stats = await fs.stat(filePath);
      const currentModTime = stats.mtime.getTime();

      // Initialize last known mod time on first check
      if (this.lastKnownModTime === 0) {
        this.lastKnownModTime = currentModTime;
        return;
      }

      // Check if file has been modified
      if (currentModTime > this.lastKnownModTime) {
        console.log("Color file changed externally, syncing...");
        
        // Invalidate cache
        CachedColorOperations.invalidateColorCache();
        
        // Notify about the change
        if (this.onDataChange) {
          // Load fresh data (this will be handled by the color service)
          // The actual loading will be done by the component that registered the callback
          this.onDataChange([]);
        }

        this.lastKnownModTime = currentModTime;
      }
    } catch (error) {
      // File might not exist or be inaccessible
      console.warn("Failed to check file changes:", error);
    }
  }

  /**
   * Forces a sync check
   */
  async forcSync(): Promise<void> {
    await this.checkForFileChanges();
  }

  /**
   * Gets sync status
   */
  getSyncStatus() {
    return {
      isWatching: this.isWatching,
      lastKnownModTime: this.lastKnownModTime,
      hasCallback: !!this.onDataChange,
    };
  }
}

/**
 * Global background sync manager instance
 */
export const backgroundSync = new BackgroundSyncManager();

/**
 * Queue for batching file operations
 */
class OperationQueue {
  private queue: Array<() => Promise<void>> = [];
  private isProcessing = false;
  private batchDelay = 1000; // 1 second

  /**
   * Adds an operation to the queue
   */
  enqueue(operation: () => Promise<void>): void {
    this.queue.push(operation);
    this.processBatch();
  }

  /**
   * Processes queued operations in batches
   */
  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    // Wait for batch delay to collect more operations
    await new Promise(resolve => setTimeout(resolve, this.batchDelay));

    // Process all queued operations
    const operations = [...this.queue];
    this.queue = [];

    try {
      // Execute operations sequentially to avoid conflicts
      for (const operation of operations) {
        await operation();
      }
    } catch (error) {
      console.error("Batch operation failed:", error);
    } finally {
      this.isProcessing = false;

      // Process any new operations that were queued during processing
      if (this.queue.length > 0) {
        this.processBatch();
      }
    }
  }

  /**
   * Gets queue status
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
    };
  }
}

/**
 * Global operation queue instance
 */
export const operationQueue = new OperationQueue();