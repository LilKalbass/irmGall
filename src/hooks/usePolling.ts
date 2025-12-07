'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Options for usePolling hook
 */
interface UsePollingOptions {
  /** Polling interval in milliseconds */
  interval?: number;
  /** Whether polling is enabled */
  enabled?: boolean;
  /** Whether to poll immediately on mount */
  immediate?: boolean;
  /** Callback when polling fails */
  onError?: (error: Error) => void;
}

/**
 * Custom hook for polling data at regular intervals
 * 
 * @param callback - Async function to call on each poll
 * @param options - Polling configuration options
 * 
 * @example
 * ```tsx
 * usePolling(
 *   async () => {
 *     const data = await fetchPhotos();
 *     setPhotos(data);
 *   },
 *   { interval: 15000, enabled: true }
 * );
 * ```
 */
export function usePolling(
  callback: () => Promise<void>,
  options: UsePollingOptions = {}
) {
  const {
    interval = 15000, // 15 seconds default
    enabled = true,
    immediate = false,
    onError,
  } = options;
  
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);
  
  // Update callback ref when it changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Execute the callback
  const executeCallback = useCallback(async () => {
    // Prevent overlapping calls
    if (isPollingRef.current) return;
    
    isPollingRef.current = true;
    try {
      await savedCallback.current();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Polling failed'));
    } finally {
      isPollingRef.current = false;
    }
  }, [onError]);
  
  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(executeCallback, interval);
  }, [executeCallback, interval]);
  
  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  
  // Manual refresh
  const refresh = useCallback(async () => {
    await executeCallback();
  }, [executeCallback]);
  
  // Set up polling
  useEffect(() => {
    if (!enabled) {
      stopPolling();
      return;
    }
    
    // Execute immediately if requested
    if (immediate) {
      executeCallback();
    }
    
    // Start interval
    startPolling();
    
    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [enabled, immediate, startPolling, stopPolling, executeCallback]);
  
  // Pause polling when tab is hidden (performance optimization)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else if (enabled) {
        // Refresh immediately when tab becomes visible
        executeCallback();
        startPolling();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, startPolling, stopPolling, executeCallback]);
  
  return {
    /** Manually trigger a refresh */
    refresh,
    /** Start polling */
    startPolling,
    /** Stop polling */
    stopPolling,
    /** Whether currently polling */
    isPolling: !!intervalRef.current,
  };
}

export default usePolling;

