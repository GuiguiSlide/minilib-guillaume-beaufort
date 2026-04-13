// ── backend/src/models/empruntsModel.ts ─────────────────────

import pool from '../config/database.js';

/**
 * Récupère tous les emprunts (triés du plus récent au plus ancien)
 */
export const findAll = async () => {
    const result = await pool.query(
        'SELECT * FROM emprunts ORDER BY date_emprunt DESC'
    );
    return result.rows;
};

/**
 * Récupère un emprunt par son ID
 */
export const findById = async (id: number) => {
    const result = await pool.query(
        'SELECT * FROM emprunts WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

/**
 * Crée un nouvel emprunt
 * - vérifie que le livre n'est pas déjà emprunté
 * - définit date_emprunt automatiquement
 * - définit date_retour_prevue (+14 jours)
 */
export const create = async ({
    adherent_id,
    livre_id
}: {
    adherent_id: number;
    livre_id: number;
}) => {

    // Vérifie si le livre est déjà emprunté (non rendu)
    const check = await pool.query(
        `SELECT * FROM emprunts 
         WHERE livre_id = $1 
         AND date_retour_effective IS NULL`,
        [livre_id]
    );

    if (check.rows.length > 0) {
        throw new Error('Livre déjà emprunté');
    }

    const result = await pool.query(
        `INSERT INTO emprunts 
         (adherent_id, livre_id, date_emprunt, date_retour_prevue)
         VALUES ($1, $2, NOW(), NOW() + INTERVAL '14 days')
         RETURNING *`,
        [adherent_id, livre_id]
    );
    await pool.query(
        `UPDATE livres SET disponible = false WHERE id = $1`,
        [livre_id]
    );

    return result.rows[0];
};


export const findAllDetailed = async () => {
    const result = await pool.query(`
SELECT 
    e.id,
    e.livre_id,
    e.adherent_id,
    e.date_emprunt,
    e.date_retour_effective,

    l.titre AS livre_titre,
    a.nom AS adherent_nom,

    CASE 
        WHEN e.date_retour_effective IS NOT NULL THEN false
        WHEN e.date_emprunt + INTERVAL '14 days' < NOW() THEN true
        ELSE false
    END AS en_retard,

    CASE 
        WHEN e.date_retour_effective IS NULL THEN 'EN_COURS'
        ELSE 'RENDU'
    END AS statut

FROM emprunts e
JOIN livres l ON e.livre_id = l.id
JOIN adherents a ON e.adherent_id = a.id

ORDER BY 
    en_retard DESC,
    e.date_retour_effective NULLS FIRST,
    e.date_emprunt DESC;
    `);

    return result.rows;
};

/**
 * Marque un emprunt comme rendu
 * → définit date_retour_effective à NOW()
 */
export const returnLivre = async (id: number) => {
    // 1. get livre_id first
    const emprunt = await pool.query(
        `SELECT livre_id FROM emprunts WHERE id = $1`,
        [id]
    );

    if (!emprunt.rows[0]) return null;

    const livreId = emprunt.rows[0].livre_id;

    // 2. mark return date
    const result = await pool.query(
        `UPDATE emprunts
         SET date_retour_effective = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    // 3. update book availability
    await pool.query(
        `UPDATE livres SET disponible = true WHERE id = $1`,
        [livreId]
    );

    return result.rows[0] || null;
};

/**
 * Mise à jour générique (rarement utilisée ici)
 */
export const update = async (id: number, data: any) => {

    const champs = Object.keys(data);
    const valeurs = Object.values(data);

    if (champs.length === 0) return findById(id);

    const setClause = champs
        .map((c, i) => `${c} = $${i + 1}`)
        .join(', ');

    const result = await pool.query(
        `UPDATE emprunts 
         SET ${setClause} 
         WHERE id = $${champs.length + 1} 
         RETURNING *`,
        [...valeurs, id]
    );

    return result.rows[0] || null;
};

/**
 * Supprime un emprunt (rare)
 */
export const remove = async (id: number) => {
    const result = await pool.query(
        'DELETE FROM emprunts WHERE id = $1',
        [id]
    );

    return result.rowCount !== null && result.rowCount > 0;
};