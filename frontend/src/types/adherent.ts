// ── Adherent Type Definitions ──
// Interfaces for members/adherents in the library system

/**
 * Represents a library member
 * Corresponds to the adherents table in PostgreSQL
 * @prop id - Unique identifier (SERIAL PRIMARY KEY)
 * @prop numero_adherent - Member number (unique identifier for the member)
 * @prop nom - Member last name
 * @prop prenom - Member first name
 * @prop email - Member email address
 * @prop actif - Whether the membership is active
 * @prop created_at - Account creation date
 */
export interface Adherent {
    id: number;
    numero_adherent: string;
    nom: string;
    prenom: string;
    email: string;
    actif: boolean;
    created_at: Date;
}

/**
 * Data structure for creating a new member
 * Excludes id, actif (defaults to true), and created_at (auto-generated)
 */
export interface CreateAdherentDto {
    nom: string;
    prenom: string;
    email: string;
}