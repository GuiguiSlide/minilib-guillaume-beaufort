// ── MEMBER TYPE DEFINITIONS ──
// Interfaces for library members throughout the application

/**
 * Represents a library member
 * Corresponds to the adherents table in PostgreSQL
 * 
 * @prop id - Unique identifier (SERIAL PRIMARY KEY)
 * @prop numero_adherent - Auto-generated member number (ADH-001, ADH-042, etc.)
 * @prop nom - Member last name
 * @prop prenom - Member first name
 * @prop email - Member email address
 * @prop actif - Whether the membership is active (soft delete flag)
 * @prop created_at - Account creation date (auto-set by PostgreSQL)
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
 * Used in POST requests and model.create()
 * Excludes id (auto-generated)
 * Excludes numero_adherent (auto-generated ADH-XXX)
 * Excludes actif (defaults to true)
 * Excludes created_at (auto-set on creation)
 * 
 * @prop nom - Required: Member last name
 * @prop prenom - Required: Member first name
 * @prop email - Required: Member email address
 */
export interface CreateAdherentDto {
    nom: string;
    prenom: string;
    email: string;
}