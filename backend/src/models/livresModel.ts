// backend/src/models/livresModel.js
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
 * Construit dynamiquement une clause WHERE selon les filtres fournis.
 * Utilise ILIKE pour la recherche insensible à la casse sur titre et auteur.
 * @async
 * @param {Object} [filtres={}] - Objet contenant les critères de filtrage optionnels
 * @param {string} [filtres.genre] - Filtrer par genre exact
 * @param {boolean} [filtres.disponible] - Filtrer par disponibilité (true/false)
 * @param {string} [filtres.recherche] - Recherche textuelle dans titre OU auteur (case-insensitive)
 * @returns {Promise<Livre[]>} Tableau de tous les livres correspondant, trié par titre
 */
export const findAll = async (filtres: Partial<FiltresLivre> = {}): Promise<Livre[]> => {
    // Prépare les conditions WHERE dynamiquement pour éviter les requêtes inutiles
    const conditions = [];
    const valeurs = [];
    let idx = 1; // Index pour les paramètres PostgreSQL ($1, $2, etc.)

    // Ajoute filtre genre si fourni
    if (filtres.genre !== undefined) {
        conditions.push(`genre = $${idx++}`);
        valeurs.push(filtres.genre);
    }

    // Ajoute filtre disponibilité (convertit string 'true'/'false' en booléen si nécessaire)
    if (filtres.disponible !== undefined) {
        conditions.push(`disponible = $${idx++}`);
        valeurs.push(typeof filtres.disponible === 'string' ? filtres.disponible === 'true' : filtres.disponible);
    }

    // Ajoute recherche textuelle (cherche dans titre OU auteur, case-insensitive avec ILIKE)
    if (filtres.recherche) {
        conditions.push(`(titre ILIKE $${idx} OR auteur ILIKE $${idx})`);
        valeurs.push(`%${filtres.recherche}%`); // % permet la recherche partielle
        idx++;
    }

    // Construit la clause WHERE (chaîne vide si pas de filtres)
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Exécute la requête avec les paramètres et récupère les résultats
    const result = await pool.query(
        `SELECT * FROM livres ${where} ORDER BY titre`,
        valeurs
    );
    return result.rows;
};

/**
 * Trouve un livre par son ID.
 * @async
 * @param {number} id - ID du livre à récupérer
 * @returns {Promise<Livre|null>} Le livre trouvé, ou null s'il n'existe pas
 */
export const findById = async (id: Number): Promise<Livre | null> => {
    // Requête simple SELECT par ID primaire
    const result = await pool.query(
        'SELECT * FROM livres WHERE id = $1',
        [id]
    );
    // Retourne le premier résultat (il ne peut y en avoir qu'un) ou null
    return result.rows[0] || null;
};

/**
 * Crée un nouveau livre dans la base de données.
 * @async
 * @param {CreateLivreDto} data - Objet contenant les propriétés du livre (isbn, titre, auteur, annee, genre)
 * @returns {Promise<Livre|null>} Le livre nouvellement créé avec son ID généré
 */
export const create = async (data: CreateLivreDto): Promise<Livre | null> => {
    // Insère une nouvelle ligne et récupère immédiatement la ligne complète
    // RETURNING * retourne la ligne insérée y compris l'ID généré automatiquement (SERIAL)
    const result = await pool.query(
        `INSERT INTO livres (isbn, titre, auteur, annee, genre) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [data.isbn, data.titre, data.auteur, data.annee, data.genre]
    );
    // Retourne le nouvel objet livre avec son ID
    return result.rows[0];
};

/**
 * Met à jour les champs spécifiés d'un livre existant.
 * Construit dynamiquement la clause SET selon les champs fournis.
 * @async
 * @param {number} id - ID du livre à mettre à jour
 * @param {Partial<CreateLivreDto>} data - Objet contenant les champs à modifier (partiellement)
 * @returns {Promise<Livre|null>} Le livre mis à jour, ou null si non trouvé
 */
export const update = async (id: Number, data: Partial<CreateLivreDto>): Promise<Livre | null> => {
    // Extrait les clés et valeurs de l'objet data pour construire la clause SET dynamiquement
    const champs = Object.keys(data);
    const valeurs = Object.values(data);

    // Si aucun champ n'a été fourni, retourne le livre existant sans modification
    if (champs.length === 0) return findById(id);

    // Construit la clause SET (ex: "titre = $1, auteur = $2")
    const setClause = champs.map((c, i) => `${c} = $${i + 1}`).join(', ');

    // Exécute l'UPDATE avec tous les paramètres (valeurs + id à la fin)
    const result = await pool.query(
        `UPDATE livres SET ${setClause} WHERE id = $${champs.length + 1} RETURNING *`,
        [...valeurs, id]
    );
    // Retourne la ligne mise à jour ou null
    return result.rows[0] || null;
};

/**
 * Supprime un livre de la base de données.
 * @async
 * @param {number} id - ID du livre à supprimer
 * @returns {Promise<boolean>} true si au moins une ligne a été supprimée, false sinon
 */
export const remove = async (id: Number): Promise<boolean> => {
    // Exécute le DELETE et récupère le nombre de lignes affectées
    const result = await pool.query(
        'DELETE FROM livres WHERE id = $1 RETURNING id',
        [id]
    );
    // Retourne true si au moins 1 ligne supprimée, false sinon (utilise ?? 0 pour éviter null)
    return (result.rowCount ?? 0) > 0;
};