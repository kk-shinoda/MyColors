import { ColorEntry } from "../types";

/**
 * Debounce utility for limiting function calls
 */
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  delay: number,
): T {
  let timeoutId: NodeJS.Timeout;

  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}

/**
 * Throttle utility for limiting function calls to a maximum frequency
 */
export function throttle<T extends (...args: never[]) => void>(
  func: T,
  limit: number,
): T {
  let inThrottle: boolean;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

/**
 * Creates a debounced search function for color filtering
 */
export function createDebouncedSearch(delay = 300) {
  return debounce(
    (
      searchTerm: string,
      colors: ColorEntry[],
      callback: (filteredColors: ColorEntry[]) => void,
    ) => {
      const filtered = colors.filter((color) =>
        color.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      callback(filtered);
    },
    delay,
  );
}

/**
 * Creates a throttled save function
 */
export function createThrottledSave(limit = 1000) {
  return throttle(async (saveFunction: () => Promise<void>) => {
    try {
      await saveFunction();
    } catch (error) {
      console.error("Throttled save failed:", error);
    }
  }, limit);
}
