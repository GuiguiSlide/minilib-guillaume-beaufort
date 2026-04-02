// ── frontend/src/services/api.ts ────────────────────────────────
// Point d'entrée unique pour tous les appels HTTP
// Centralise l'URL de base et les headers communs

// L'URL de base vient d'une variable d'environnement Vite
// Vite expose les variables préfixées VITE_ via import.meta.env
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

// Type générique pour uniformiser les réponses
export interface ApiError {
    erreur: string;
    champs?: string[];
}

/**
 * Effectue une requête HTTP vers l'API MiniLib.
 * Lance une erreur si la réponse n'est pas OK (status >= 400).
 *
 * @param endpoint  - Chemin relatif ex: "/livres" ou "/livres/1"
 * @param options   - Options fetch standard (method, body, headers)
 * @returns         - La réponse parsée en JSON typée T
 */
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json", ...options?.headers },
        ...options,
    });

    if (!response.ok) {
        const erreur: ApiError = await response.json().catch(() => ({
            erreur: `Erreur HTTP ${response.status}`,
        }));
        throw new Error(erreur.erreur);
    }

    // 204 No Content — pas de corps à parser (DELETE)
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
}
