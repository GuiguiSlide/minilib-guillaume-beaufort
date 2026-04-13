// ── LOAN TYPE DEFINITIONS ──
// Interfaces for book loans throughout the application

/**
 * Represents a book loan/borrowing
 * Corresponds to the emprunts table in PostgreSQL
 * Tracks when a member borrowed a book and when it was returned
 * 
 * @prop id - Unique identifier (SERIAL PRIMARY KEY)
 * @prop livre_id - Foreign key reference to the borrowed book (livres.id)
 * @prop adherent_id - Foreign key reference to the member (adherents.id)
 * @prop date_emprunt - Date when the book was borrowed (auto-set to NOW())
 * @prop date_retour_prevue - Expected return date (default: NOW() + 14 days)
 * @prop date_retour_effective - Actual return date (null if still borrowed)
 */
export interface Emprunt {
    id: number;
    livre_id: number;
    adherent_id: number;
    date_emprunt: Date;
    date_retour_prevue: Date;
    date_retour_effective: Date | null;
}

/**
 * Extended loan interface with JOINed data
 * Used when fetching detailed loan information with all related data
 * Includes denormalized fields from livres and adherents tables
 * 
 * @prop titre_livre - Book title (from livres table)
 * @prop nom_adherent - Member name (from adherents table)
 * @prop en_retard - Whether the loan is overdue (calculated field)
 * @extends Emprunt
 */
export interface EmpruntAvecDetails extends Emprunt {
    titre_livre: string;
    nom_adherent: string;
    en_retard: boolean;
}

/**
 * Data structure for creating a new loan
 * Used in POST requests and model.create()
 * Only requires the IDs; dates and return fields are auto-generated
 * 
 * @prop livre_id - Required: ID of the book being borrowed
 * @prop adherent_id - Required: ID of the member borrowing
 */
export interface CreateEmpruntDto {
    livre_id: number;
    adherent_id: number;
}