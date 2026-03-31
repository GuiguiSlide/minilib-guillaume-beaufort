// backend/src/models/livresModel.js
//TODO: Section C — Annoter les models avec les types file:///C:/Users/Guillaume%20Beaufort/Desktop/docs/03-vendredi_ts_tp.docx.pdf
/**
* Accès aux données livres via PostgreSQL.
* Remplace l'ancien livresData.js en mémoire.
* Toutes les fonctions sont async — elles retournent des Promises.
*
* @module livresModel
*/
import { Livre, CreateLivreDto, FiltresLivre } from '../types/index.js';
import pool from '../config/database.js';

/**
* Récupère tous les livres avec filtres optionnels.
* @async
* @import { Livre, CreateLivreDto, FiltresLivre } from '../types/index.ts'
* @param {Object} [filtres={}]
* @param {string} [filtres.genre]
* @param {boolean} [filtres.disponible]
* @param {string} [filtres.recherche] - Recherche dans titre ou auteur
* @param {FiltresLivre} [filtres={}]
* @returns {Promise<Livre[]>} (ILIKE)
* @returns {Promise<Array>} Tableau de livres
*/
export const findAll = async (filtres: Partial<FiltresLivre> = {}): Promise<Livre[]> => {
    const conditions = [];
    const valeurs = [];
    let idx = 1;

    if (filtres.genre !== undefined) {
        conditions.push(`genre = $${idx++}`);
        valeurs.push(filtres.genre);
    }
    if (filtres.disponible !== undefined) {
        conditions.push(`disponible = $${idx++}`);
        valeurs.push(typeof filtres.disponible === 'string' ? filtres.disponible === 'true' : filtres.disponible);
    }
    if (filtres.recherche) {
        conditions.push(`(titre ILIKE $${idx} OR auteur ILIKE $${idx})`);
        valeurs.push(`%${filtres.recherche}%`);
        idx++;
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
        `SELECT * FROM livres ${where} ORDER BY titre`, valeurs
    );
    return result.rows;
};

/**
* Trouve un livre par son id.
* @async
* @param {number} id
* @returns {Promise<Object|null>} Livre ou null
*/
export const findById = async (id: Number): Promise<Livre | null> => {
    const result = await pool.query('SELECT * FROM livres WHERE id = $1', [id]
    );
    return result.rows[0] || null;
};

/**
* Crée un nouveau livre.
* @async
* @param {Object} data - { isbn, titre, auteur, annee, genre }
* @returns {Promise<Object>} Le livre créé avec son id
*/
export const create = async (data: CreateLivreDto): Promise<Livre | null> => {
    const result = await pool.query(
        `INSERT INTO livres (isbn, titre, auteur, annee, genre) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [data.isbn, data.titre, data.auteur, data.annee, data.genre]
        // RETURNING * retourne la ligne insérée — y compris l'id généré par SERIAL
    );
    return result.rows[0];
};

/**
* Met à jour un livre.
* @async
* @param {number} id
* @param {Object} data - Champs à modifier
* @returns {Promise<Object|null>} Livre mis à jour ou null
*/
export const update = async (id: Number, data: Partial<CreateLivreDto>): Promise<Livre | null> => {
    // Construction dynamique du SET
    const champs = Object.keys(data);
    const valeurs = Object.values(data);
    if (champs.length === 0) return findById(id);
    const setClause = champs.map((c, i) => `${c} = $${i + 1}`).join(', ');
    const result = await pool.query(
        `UPDATE livres SET ${setClause} WHERE id = $${champs.length + 1} RETURNING *`, [...valeurs, id]
    );
    return result.rows[0] || null;
};

/**
* Supprime un livre.
* @async
* @param {number} id
* @returns {Promise<boolean>} true si supprimé
*/
export const remove = async (id: Number): Promise<boolean> => {
    const result = await pool.query('DELETE FROM livres WHERE id = $1 RETURNING id', [id]);
    return (result.rowCount ?? 0) > 0;
};