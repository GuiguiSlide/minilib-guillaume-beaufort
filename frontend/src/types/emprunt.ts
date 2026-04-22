// ── Emprunt Type Definitions ──
// Interfaces for loans in the library system

/**
 * Represents a book loan/borrowing
 * Corresponds to the emprunts table in PostgreSQL
 * @prop id - Unique identifier (SERIAL PRIMARY KEY)
 * @prop livre_id - Reference to the borrowed book
 * @prop adherent_id - Reference to the member who borrowed
 * @prop date_emprunt - Date when the book was borrowed
 * @prop date_retour_prevue - Expected return date (optional - currently missing from backend)
 * @prop date_retour_effective - Date when the book was returned (null if still borrowed)
 * @prop livre_titre - Book title (denormalized from JOIN)
 * @prop adherent_nom - Member name (denormalized from JOIN)
 * @prop en_retard - Whether the loan is overdue (optional)
 * @prop statut - Status of the loan (EN_COURS/RENDU) (optional)
 */
export interface Emprunt {
    id: number;
    livre_id: number;
    adherent_id: number;

    date_emprunt: string;
    date_retour_prevue?: string; // optional because currently missing
    date_retour_effective: string | null;

    livre_titre: string;
    adherent_nom: string;

    en_retard?: boolean;
    statut?: "EN_COURS" | "RENDU";
}

/**
 * Extended emprunt interface with additional JOIN data
 * Used when fetching detailed loan information with all related data
 */
export interface EmpruntAvecDetails extends Emprunt {
    titre_livre: string;
    nom_adherent: string;
    en_retard: boolean;
}

/**
 * Data structure for creating a new loan
 * Only requires the book and member IDs
 * Date is auto-generated on backend
 */
export interface CreateEmpruntDto {
    livre_id: number;
    adherent_id: number;
}