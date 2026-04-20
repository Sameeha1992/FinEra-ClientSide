import { useState, useEffect } from "react";

/**
 * A custom hook that returns a debounced version of the provided value.
 * @param value The value to be debounced (usually a search string).
 * @param delay The delay in milliseconds (default is 500ms).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (cleanup on unmount or before next run)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
