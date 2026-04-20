import axios from "axios";

/**
 * Safely extracts a user-friendly error message from an unknown error,
 * specifically narrowing Axios errors to access backend response data message.
 * 
 * @param error The unknown error caught in a try/catch block
 * @param defaultMessage Fallback message if no specific error can be extracted
 * @returns A string error message
 */
export const handleApiError = (error: unknown, defaultMessage: string = "Something went wrong"): string => {
  if (axios.isAxiosError(error)) {
    // Attempt to extract the custom backend message if it exists
    return error.response?.data?.message || error.message || defaultMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return defaultMessage;
};

/**
 * Safely extracts the raw response data from an Axios error.
 * Useful for legacy code that expects the full data object to be thrown.
 * 
 * @param error The unknown error
 * @returns The response data or null
 */
export const getApiErrorData = (error: unknown): Record<string, unknown> | null => {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as Record<string, unknown>) || null;
  }
  return null;
};
