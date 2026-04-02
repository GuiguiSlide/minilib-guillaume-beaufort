// ── frontend/src/services/livreService.ts ───────────────────────
// Toutes les opérations sur les livres — encapsule les appels API

import type { Livre, CreateLivreDto, FiltresLivre } from "../types/livre";
import { apiRequest } from "./api";

/**
 * Récupère tous les livres avec filtres optionnels.
 * @param filtres - genre, disponible, recherche
 */
export async function getLivres(filtres: FiltresLivre = {}): Promise<Livre[]> {
    // Construire les query params depuis les filtres non-undefined
    const params = new URLSearchParams();
    if (filtres.genre) params.append("genre", filtres.genre);
    if (filtres.recherche) params.append("recherche", filtres.recherche);
    if (filtres.disponible !== undefined)
        params.append("disponible", String(filtres.disponible));

    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Livre[]>(`/livres${query}`);
}

/**
 * Récupère un livre par son id.
 */
export async function getLivreById(id: number): Promise<Livre> {
    return apiRequest<Livre>(`/livres/${id}`);
}

/**
 * Crée un nouveau livre.
 */
export async function creerLivre(data: CreateLivreDto): Promise<Livre> {
    return apiRequest<Livre>("/livres", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

/**
 * Supprime un livre.
 */
export async function supprimerLivre(id: number): Promise<void> {
    return apiRequest<void>(`/livres/${id}`, { method: "DELETE" });
}

