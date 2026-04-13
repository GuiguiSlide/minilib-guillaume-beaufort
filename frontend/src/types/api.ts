// ── API Response Type Definitions ──
// Standardized types for all API responses throughout the application

/**
 * Generic wrapper for successful API responses
 * Ensures all API responses have a consistent structure
 * @prop data - The actual response data (can be any type T)
 * @prop total - Optional count for paginated/list responses
 * @prop message - Optional success message
 */
export interface ApiResponse<T> {
  data: T;
  total?: number;
  message?: string;
}

/**
 * Standard error response from the API
 * Used for consistency when returning error information
 * @prop erreur - Error message describing what went wrong
 * @prop champs - Optional array of field names that caused validation errors
 */
export interface ApiError {
  erreur: string;
  champs?: string[];
}
