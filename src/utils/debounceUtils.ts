/**
 * Debounce utility for limiting function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle utility for limiting function calls to a maximum frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounced search function for color filtering
 */
export const debouncedSearch = debounce((
  searchTerm: string,
  colors: any[],
  callback: (filteredColors: any[]) => void
) => {
  const filtered = colors.filter(color =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  callback(filtered);
}, 300);

/**
 * Throttled file save operation
 */
export const throttledSave = throttle(async (
  saveFunction: () => Promise<void>
) => {
  try {
    await saveFunction();
  } catch (error) {
    console.error("Throttled save failed:", error);
  }
}, 1000); // Maximum one save per second