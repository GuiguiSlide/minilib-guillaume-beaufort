// ── MEMBERS MODEL ──
// Data access layer for members/adherents (adherents)
// All functions are async and interact with PostgreSQL database
// Handles member creation with auto-generated member numbers

import { Adherent, CreateAdherentDto } from '../types/index.js';
import pool from '../config/database.js';

/**
 * Generates unique member number in format ADH-XXX
 * Counts existing members and pads count with zeros
 * Examples: ADH-001, ADH-042, ADH-100
 * 
 * @returns - Promise resolving to unique member number string
 */
const genererNumeroAdherent = async () => {
    // ── COUNT EXISTING MEMBERS ──
    const result = await pool.query('SELECT COUNT(*) FROM adherents');
    const count = parseInt(result.rows[0].count) + 1;
    
    // ── FORMAT: ADH-XXX (left-padded with zeros) ──
    return `ADH-${String(count).padStart(3, '0')}`;
};

/**
 * Fetches all active members
 * Only returns members where actif = true
 * Ordered by last name, then first name
 * 
 * @returns - Promise resolving to array of active Adherent objects
 */
export const findAll = async () => {
    const result = await pool.query(
        'SELECT * FROM adherents WHERE actif = true ORDER BY nom, prenom'
    );
    return result.rows;
};

/**
 * Fetches a single member by ID
 * 
 * @param id - Member ID to fetch
 * @returns - Promise resolving to Adherent object or null if not found
 */
export const findById = async (id: number): Promise<Adherent | null> => {
    const result = await pool.query(
        'SELECT * FROM adherents WHERE id = $1', 
        [id]
    );
    return result.rows[0] || null;
};

/**
 * Creates a new member with auto-generated member number
 * Automatically generates ADH-XXX format member number
 * Sets actif to true by default via PostgreSQL
 * 
 * @param data - CreateAdherentDto with nom, prenom, email
 * @returns - Promise resolving to created Adherent with generated ID and number
 */
export const create = async ({ nom, prenom, email }: CreateAdherentDto): Promise<Adherent> => {
    // ── GENERATE UNIQUE MEMBER NUMBER ──
    const numero = await genererNumeroAdherent();
    
    const result = await pool.query(
        `INSERT INTO adherents (numero_adherent, nom, prenom, email) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [numero, nom, prenom, email]
    );
    return result.rows[0];
};

/**
 * Soft deletes a member by marking as inactive
 * Never actually removes data from database
 * Allows member history to be preserved for audit/reporting
 * 
 * @param id - Member ID to deactivate
 * @returns - Promise resolving to deactivated Adherent or null if not found
 */
export const desactiver = async (id: number): Promise<Adherent | null> => {
    const result = await pool.query(
        'UPDATE adherents SET actif = false WHERE id = $1 RETURNING *', 
        [id]
    );
    return result.rows[0] || null;
};

/**
 * Updates an existing member's information
 * Dynamically builds SET clause from provided fields
 * Only updates fields that are provided
 * 
 * @param id - Member ID to update
 * @param data - Partial member data (nom?, prenom?, email?)
 * @returns - Promise resolving to updated Adherent or null if not found
 */
export const update = async (id: number, data: Partial<CreateAdherentDto>): Promise<Adherent | null> => {
    // ── BUILD DYNAMIC SET CLAUSE ──
    const champs = Object.keys(data);
    const valeurs = Object.values(data);
    
    // ── RETURN EXISTING IF NO UPDATES ──
    if (champs.length === 0) return findById(id);
    
    // ── BUILD SET CLAUSE (e.g., "nom = $1, email = $2") ──
    const setClause = champs.map((c, i) => `${c} = $${i + 1}`).join(', ');
    
    const result = await pool.query(
        `UPDATE adherents SET ${setClause} WHERE id = $${champs.length + 1} RETURNING *`,
        [...valeurs, id]
    );
    return result.rows[0] || null;
};