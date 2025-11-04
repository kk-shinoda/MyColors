import { useState, useEffect, useCallback } from "react";
import { ColorEntry } from "../types";

/**
 * Lazy loading configuration
 */
interface LazyLoadingConfig {
  pageSize: number;
  threshold: number; // Number of items from the end to trigger loading
}

/**
 * Lazy loading state
 */
interface LazyLoadingState {
  items: ColorEntry[];
  hasMore: boolean;
  isLoading: boolean;
  currentPage: number;
}

/**
 * Custom hook for lazy loading large color collections
 * Requirements: 1.1, 1.2, 4.2
 */
export function useLazyLoading(
  allItems: ColorEntry[],
  config: LazyLoadingConfig = { pageSize: 10, threshold: 3 }
) {
  const [state, setState] = useState<LazyLoadingState>({
    items: [],
    hasMore: true,
    isLoading: false,
    currentPage: 0,
  });

  // Load initial page
  useEffect(() => {
    if (allItems.length > 0) {
      const initialItems = allItems.slice(0, config.pageSize);
      setState({
        items: initialItems,
        hasMore: allItems.length > config.pageSize,
        isLoading: false,
        currentPage: 1,
      });
    }
  }, [allItems, config.pageSize]);

  // Load more items
  const loadMore = useCallback(() => {
    if (state.isLoading || !state.hasMore) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    // Simulate async loading (in real app, this might be an API call)
    setTimeout(() => {
      const startIndex = state.currentPage * config.pageSize;
      const endIndex = startIndex + config.pageSize;
      const newItems = allItems.slice(startIndex, endIndex);

      setState(prev => ({
        items: [...prev.items, ...newItems],
        hasMore: endIndex < allItems.length,
        isLoading: false,
        currentPage: prev.currentPage + 1,
      }));
    }, 100);
  }, [allItems, config.pageSize, state.currentPage, state.hasMore, state.isLoading]);

  // Check if we should load more based on scroll position
  const shouldLoadMore = useCallback((visibleItemIndex: number) => {
    const remainingItems = state.items.length - visibleItemIndex;
    return remainingItems <= config.threshold && state.hasMore && !state.isLoading;
  }, [state.items.length, state.hasMore, state.isLoading, config.threshold]);

  // Reset lazy loading when items change
  const reset = useCallback(() => {
    setState({
      items: [],
      hasMore: true,
      isLoading: false,
      currentPage: 0,
    });
  }, []);

  return {
    items: state.items,
    hasMore: state.hasMore,
    isLoading: state.isLoading,
    loadMore,
    shouldLoadMore,
    reset,
  };
}

/**
 * Virtual scrolling utility for very large lists
 */
export class VirtualScrollManager {
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop: number = 0;

  constructor(itemHeight: number, containerHeight: number) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
  }

  /**
   * Calculates which items should be visible
   */
  getVisibleRange(totalItems: number): { start: number; end: number; offset: number } {
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const start = Math.floor(this.scrollTop / this.itemHeight);
    const end = Math.min(start + visibleCount + 1, totalItems);
    const offset = start * this.itemHeight;

    return { start, end, offset };
  }

  /**
   * Updates scroll position
   */
  updateScrollTop(scrollTop: number): void {
    this.scrollTop = scrollTop;
  }

  /**
   * Gets total height for scrollbar
   */
  getTotalHeight(totalItems: number): number {
    return totalItems * this.itemHeight;
  }
}