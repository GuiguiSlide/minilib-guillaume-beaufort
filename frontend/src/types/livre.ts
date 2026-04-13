// ── Livre Type Definitions ──
// Interfaces for books in the library system

/**
 * Represents a book in the MiniLib catalog
 * Corresponds to the livres table in PostgreSQL
 * @prop id - Unique identifier (SERIAL PRIMARY KEY)
 * @prop isbn - International Standard Book Number
 * @prop titre - Book title
 * @prop auteur - Book author
 * @prop annee - Publication year
 * @prop genre - Book genre/category
 * @prop disponible - Whether the book is available to borrow
 */
export interface Livre {
    id: number;
    isbn: string;
    titre: string;
    auteur: string;
    annee: number;
    genre: string;
    disponible: boolean;
}

/**
 * Data structure for creating a new book
 * Excludes id (auto-generated) and disponible (defaults to true)
 */
export interface CreateLivreDto {
    isbn: string;
    titre: string;
    auteur: string;
    annee?: number;
    genre?: string;
}

/**
 * Optional filters for fetching/searching books
 */
export interface FiltresLivre {
    genre?: string;
    disponible?: boolean;
    recherche?: string;
}