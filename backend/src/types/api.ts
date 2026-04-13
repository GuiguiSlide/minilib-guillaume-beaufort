// ── API RESPONSE TYPE DEFINITIONS ──
// Standardized types for all API responses throughout the application

/**
 * Generic wrapper for successful API responses
 * Ensures all API responses have a consistent structure
 * Used in controllers when sending data back to client
 * 
 * @prop data - The actual response data (can be any type T)
 * @prop total - Optional count for paginated/list responses
 * @prop message - Optional success message
 * 
 * @example
 * res.json({ data: livres, total: livres.length })
 * res.json({ data: newBook })
 */
export interface ApiResponse<T> {
  data: T;
  total?: number;
  message?: string;
}

/**
 * Standard error response from the API
 * Used for consistency when returning error information
 * Helps client understand what went wrong and why
 * 
 * @prop erreur - Error message describing what went wrong
 * @prop champs - Optional array of field names that caused validation errors
 * 
 * @example
 * res.status(400).json({ erreur: 'Champs manquants', champs: ['isbn', 'titre'] })
 * res.status(404).json({ erreur: 'Livre non trouvé' })
 */
export interface ApiError {
  erreur: string;
  champs?: string[];
}
