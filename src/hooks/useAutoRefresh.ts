import { useEffect, useRef, useCallback } from 'react';

/**
 * Centralized auto-refresh hook for managing intervals
 * Automatically cleans up on unmount
 * 
 * @param interval - Refresh interval in milliseconds
 * @param callback - Function to call on each refresh
 * @param enabled - Whether the refresh is enabled (default: true)
 */
export function useAutoRefresh(
  interval: number,
  callback: () => void | Promise<void>,
  enabled: boolean = true
) {
  const callbackRef = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || interval <= 0) {
      return;
    }

    // Initial call
    const executeCallback = async () => {
      try {
        await callbackRef.current();
      } catch (error) {
        console.error('[useAutoRefresh] Callback error:', error);
      }
    };

    executeCallback();

    // Set up interval
    intervalRef.current = setInterval(executeCallback, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [interval, enabled]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    try {
      await callbackRef.current();
    } catch (error) {
      console.error('[useAutoRefresh] Manual refresh error:', error);
    }
  }, []);

  return { refresh };
}

