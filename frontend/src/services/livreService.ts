// ── Livre Service ──
// Business logic layer for all book-related API operations
// Encapsulates API calls and provides a clean interface for components

import type { Livre, CreateLivreDto, FiltresLivre } from "../types/livre";
import { apiRequest } from "./api";

/**
 * Fetches all books with optional filtering
 * Converts filter objects to URL query parameters
 * 
 * @param filtres - Optional filter criteria (genre, recherche, disponible)
 * @returns Promise resolving to array of Livre objects
 * 
 * @example
 * const allBooks = await getLivres();
 * const availableBooks = await getLivres({ disponible: true });
 * const sciFi = await getLivres({ genre: "Science-Fiction" });
 */
export async function getLivres(filtres: FiltresLivre = {}): Promise<Livre[]> {
    // ── BUILD QUERY PARAMS: Convert filter object to URLSearchParams ──
    const params = new URLSearchParams();
    if (filtres.genre) params.append("genre", filtres.genre);
    if (filtres.recherche) params.append("recherche", filtres.recherche);
    if (filtres.disponible !== undefined)
        params.append("disponible", String(filtres.disponible));

    // ── APPEND QUERY STRING: Add ? only if params exist ──
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Livre[]>(`/livres${query}`);
}

/**
 * Fetches a single book by its ID
 * 
 * @param id - Book ID to fetch
 * @returns Promise resolving to Livre object
 * 
 * @example
 * const book = await getLivreById(42);
 */
export async function getLivreById(id: number): Promise<Livre> {
    return apiRequest<Livre>(`/livres/${id}`);
}

/**
 * Creates a new book in the database
 * Sends CreateLivreDto (no id or disponible field needed)
 * 
 * @param data - Book data to create (titre, auteur, isbn, annee?, genre?)
 * @returns Promise resolving to created Livre with auto-generated id
 * 
 * @example
 * const newBook = await creerLivre({
 *   titre: "Le Hobbit",
 *   auteur: "Tolkien",
 *   isbn: "978-2-253-04940-9"
 * });
 */
export async function creerLivre(data: CreateLivreDto): Promise<Livre> {
    return apiRequest<Livre>("/livres", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * Deletes a book from the database
 * Sends DELETE request and backend handles cascade deletes if needed
 * 
 * @param id - Book ID to delete
 * @returns Promise (resolves to void on success)
 * 
 * @example
 * await supprimerLivre(42);
 */
export async function supprimerLivre(id: number): Promise<void> {
    return apiRequest<void>(`/livres/${id}`, { method: "DELETE" });
}

