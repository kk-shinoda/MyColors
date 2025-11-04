import { ColorEntry } from "../types";

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * Generic cache implementation
 */
class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL;
  }

  /**
   * Sets a cache entry
   */
  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    
    this.cache.set(key, entry);
  }

  /**
   * Gets a cache entry if it's still valid
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Checks if a key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Removes a cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Removes expired entries
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Gets cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

/**
 * Color data cache instance
 */
export const colorCache = new Cache<ColorEntry[]>(10 * 60 * 1000); // 10 minutes TTL

/**
 * File metadata cache for tracking file changes
 */
interface FileMetadata {
  lastModified: number;
  size: number;
}

export const fileMetadataCache = new Cache<FileMetadata>(30 * 60 * 1000); // 30 minutes TTL

/**
 * Cached color operations
 */
export class CachedColorOperations {
  private static readonly COLORS_CACHE_KEY = "colors_data";
  private static readonly FILE_METADATA_KEY = "file_metadata";

  /**
   * Gets cached colors if available and valid
   */
  static getCachedColors(): ColorEntry[] | null {
    return colorCache.get(this.COLORS_CACHE_KEY);
  }

  /**
   * Caches color data
   */
  static setCachedColors(colors: ColorEntry[]): void {
    colorCache.set(this.COLORS_CACHE_KEY, colors);
  }

  /**
   * Invalidates color cache
   */
  static invalidateColorCache(): void {
    colorCache.delete(this.COLORS_CACHE_KEY);
  }

  /**
   * Gets cached file metadata
   */
  static getCachedFileMetadata(): FileMetadata | null {
    return fileMetadataCache.get(this.FILE_METADATA_KEY);
  }

  /**
   * Caches file metadata
   */
  static setCachedFileMetadata(metadata: FileMetadata): void {
    fileMetadataCache.set(this.FILE_METADATA_KEY, metadata);
  }

  /**
   * Checks if file has changed since last cache
   */
  static hasFileChanged(currentMetadata: FileMetadata): boolean {
    const cachedMetadata = this.getCachedFileMetadata();
    
    if (!cachedMetadata) {
      return true;
    }

    return (
      cachedMetadata.lastModified !== currentMetadata.lastModified ||
      cachedMetadata.size !== currentMetadata.size
    );
  }

  /**
   * Clears all caches
   */
  static clearAllCaches(): void {
    colorCache.clear();
    fileMetadataCache.clear();
  }

  /**
   * Performs cache cleanup
   */
  static cleanup(): void {
    colorCache.cleanup();
    fileMetadataCache.cleanup();
  }
}

/**
 * Background cache cleanup interval (runs every 5 minutes)
 */
let cleanupInterval: NodeJS.Timeout | null = null;

export function startCacheCleanup(): void {
  if (cleanupInterval) {
    return;
  }

  cleanupInterval = setInterval(() => {
    CachedColorOperations.cleanup();
  }, 5 * 60 * 1000); // 5 minutes
}

export function stopCacheCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}