// ── API Client Service ──
// Centralized HTTP client for all API communication
// Single entry point to manage base URL, headers, and error handling

// ── BASE_URL: API endpoint from environment variable or localhost fallback ──
// Vite exposes environment variables prefixed with VITE_ via import.meta.env
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

/**
 * Generic error response interface
 * Used to standardize API error handling
 */
export interface ApiError {
    erreur: string;
    champs?: string[];
}

/**
 * Makes a typed HTTP request to the API
 * Centralizes error handling and header management
 * 
 * @template T - The expected response type
 * @param endpoint - Relative path (e.g., "/livres" or "/livres/1")
 * @param options - Standard RequestInit options (method, body, headers, etc.)
 * @returns Promise resolving to typed response data
 * @throws Error with API error message if response is not OK
 * 
 * @example
 * const books = await apiRequest<Livre[]>("/livres");
 * const newBook = await apiRequest<Livre>("/livres", {
 *   method: "POST",
 *   body: JSON.stringify({ titre: "...", auteur: "..." })
 * });
 */
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // ── FETCH: Make the request with common headers ──
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        ...options,
    });

    // ── ERROR HANDLING: Check response status ──
    if (!response.ok) {
        // Try to parse error details from response, fallback to generic message
        const erreur: ApiError = await response.json().catch(() => ({
            erreur: `Erreur HTTP ${response.status}`,
        }));
        throw new Error(erreur.erreur);
    }

    // ── NO CONTENT: Handle 204 responses (DELETE operations) ──
    if (response.status === 204) return undefined as T;
    
    // ── SUCCESS: Parse and return JSON response ──
    return response.json() as Promise<T>;
}
