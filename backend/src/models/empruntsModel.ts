// ── backend/src/models/empruntsModel.ts ─────────────────────
/**
 * Couche d'accès aux données pour les emprunts de livres.
 * Gére la création, consultation, retour et suppression des emprunts.
 * Enforce la logique métier : 
 * - Un livre ne peut pas être emprunté deux fois simultanément
 * - La durée standard d'un emprunt est 14 jours
 * - La disponibilité du livre est mise à jour lors de chaque emprunt/retour
 *
 * @module empruntsModel
 */

import pool from '../config/database.js';

/**
 * Récupère tous les emprunts, triés du plus récent au plus ancien.
 * Ne cherche pas à enrichir les données (titreLivre, nomAdherent, etc.) - utiliser findAllDetailed pour cela.
 * @async
 * @returns {Promise<Array>} Tableau de tous les emprunts
 */
export const findAll = async () => {
    // Requête simple SELECT * de la table emprunts, trié par date décroissante
    const result = await pool.query(
        'SELECT * FROM emprunts ORDER BY date_emprunt DESC'
    );
    return result.rows;
};

/**
 * Récupère un emprunt spécifique par son ID.
 * @async
 * @param {number} id - ID de l'emprunt
 * @returns {Promise<Object|null>} L'emprunt trouvé, ou null s'il n'existe pas
 */
export const findById = async (id: number) => {
    // SELECT simple par ID primaire
    const result = await pool.query(
        'SELECT * FROM emprunts WHERE id = $1',
        [id]
    );
    // Retourne le premier résultat (il ne peut y en avoir qu'un) ou null
    return result.rows[0] || null;
};

/**
 * Crée un nouvel emprunt.
 * Vérifie d'abord que le livre n'est pas déjà emprunté (contraint de logique métier).
 * Fixe automatiquement date_emprunt (maintenant) et date_retour_prevue (+ 14 jours).
 * Met à jour la disponibilité du livre à false.
 * @async
 * @param {Object} params - Paramètres de création
 * @param {number} params.adherent_id - ID du membre emprunteur
 * @param {number} params.livre_id - ID du livre emprunté
 * @returns {Promise<Object>} L'emprunt nouvellement créé
 * @throws {Error} "Livre déjà emprunté" si le livre posséde déjà un emprunt actif (non rendu)
 */
export const create = async ({
    adherent_id,
    livre_id
}: {
    adherent_id: number;
    livre_id: number;
}) => {
    // Vérification de la disponibilité : cherche s'il existe un emprunt non rendu pour ce livre
    // Une date_retour_effective NULL signifie que l'emprunt est toujours actif (non rendu)
    const check = await pool.query(
        `SELECT * FROM emprunts 
         WHERE livre_id = $1 
         AND date_retour_effective IS NULL`,
        [livre_id]
    );

    // Si un emprunt actif existe déjà, reject la création (un livre ne peut pas être emprunté 2 fois)
    if (check.rows.length > 0) {
        throw new Error('Livre déjà emprunté');
    }

    // Insère le nouvel emprunt avec dates générées par PostgreSQL
    // NOW() = maintenant, NOW() + INTERVAL '14 days' = 14 jours plus tard
    // date_retour_effective reste NULL jusqu'au retour
    const result = await pool.query(
        `INSERT INTO emprunts 
         (adherent_id, livre_id, date_emprunt, date_retour_prevue)
         VALUES ($1, $2, NOW(), NOW() + INTERVAL '14 days')
         RETURNING *`,
        [adherent_id, livre_id]
    );

    // Marque le livre comme non disponible (disponible = false) suite à l'emprunt
    await pool.query(
        `UPDATE livres SET disponible = false WHERE id = $1`,
        [livre_id]
    );

    return result.rows[0];
};

/**
 * Récupère tous les emprunts avec données enrichies par JOINs et logique métier.
 * Ajoute le titre du livre et le nom du membre pour chaque emprunt.
 * Calcule en_retard en fonction de la date d'aujourd'hui vs date_retour_prevue.
 * Calcule le statut (EN_COURS si non rendu, RENDU si date_retour_effective exist).
 * Trie par : emprunts retard en premier, puis emprunts actifs (date_retour_effective NULL), puis par date de création.
 * @async
 * @returns {Promise<Array>} Tableau d'emprunts détaillés avec titre livre, nom adhérent, flags en_retard et statut
 */
export const findAllDetailed = async () => {
    // Requête complexe avec JOINs et logique de business:
    // - Joins livres et adherents pour récupérer titre et nom
    // - CASE pour calculer en_retard (true si NOT rendu ET date actuelle > date_retour_prevue + 14j)
    // - CASE pour calculer statut (EN_COURS si date_retour_effective IS NULL, sinon RENDU)
    // - ORDER BY pour afficher les retards en premier, puis actifs, puis par date
    const result = await pool.query(`
SELECT 
    e.id,
    e.livre_id,
    e.adherent_id,
    e.date_emprunt,
    e.date_retour_effective,
    e.date_retour_prevue,
    l.titre AS livre_titre,
    a.nom AS adherent_nom,

    -- Calcul du flag échué : true si pas rendu ET date_retour_prevue dépassée
    CASE 
        WHEN e.date_retour_effective IS NOT NULL THEN false
        WHEN e.date_emprunt + INTERVAL '14 days' < NOW() THEN true
        ELSE false
    END AS en_retard,

    -- Calcul du statut : EN_COURS si pas de date de retour, RENDU sinon
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
 * Marque un emprunt comme rendu.
 * Définit date_retour_effective à NOW() (date/heure actuelle).
 * Récupère d'abord livre_id, puis met à jour le livre pour le marquer comme disponible (disponible = true).
 * @async
 * @param {number} id - ID de l'emprunt à marquer comme rendu
 * @returns {Promise<Object|null>} L'emprunt mis à jour avec la nouvelle date_retour_effective, ou null s'il n'existe pas
 */
export const returnLivre = async (id: number) => {
    // Étape 1 : Récupère d'abord le livre_id associé à cet emprunt
    // (nécessaire pour mettre à jour la disponibilité du livre après)
    const emprunt = await pool.query(
        `SELECT livre_id FROM emprunts WHERE id = $1`,
        [id]
    );

    // Vérifie que l'emprunt existe
    if (!emprunt.rows[0]) return null;

    const livreId = emprunt.rows[0].livre_id;

    // Étape 2 : Marque le retour en fixant date_retour_effective à maintenant
    // Puis récupère l'emprunt complet mis à jour
    const result = await pool.query(
        `UPDATE emprunts
         SET date_retour_effective = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    // Étape 3 : Marque le livre comme disponible à nouveau (disponible = true)
    // pour que quelqu'un d'autre puisse l'emprunter
    await pool.query(
        `UPDATE livres SET disponible = true WHERE id = $1`,
        [livreId]
    );

    return result.rows[0] || null;
};

/**
 * Met à jour certains champs d'un emprunt existant.
 * Construit dynamiquement la clause SET selon les champs fournis dans l'objet data.
 * Utilisée rarement - utile pour corriger des erreurs de saisie ou des cas exceptionnels.
 * @async
 * @param {number} id - ID de l'emprunt à mettre à jour
 * @param {Object} data - Objet contenant les champs à modifier
 * @returns {Promise<Object|null>} L'emprunt mis à jour, ou null s'il n'existe pas
 */
export const update = async (id: number, data: any) => {
    // Extrait les clés et valeurs pour construire la clause SET dynamiquement
    const champs = Object.keys(data);
    const valeurs = Object.values(data);

    // Si aucun champ n'a été fourni, retourne l'emprunt existant sans modification
    if (champs.length === 0) return findById(id);

    // Construit la clause SET (ex: "adherent_id = $1, livre_id = $2")
    const setClause = champs
        .map((c, i) => `${c} = $${i + 1}`)
        .join(', ');

    // Exécute l'UPDATE avec tous les paramètres (valeurs + id à la fin)
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
 * Supprime un emprunt de la base de données.
 * Opération rarement utilisée - n'oublie pas que cela supprime l'historique d'emprunt.
 * @async
 * @param {number} id - ID de l'emprunt à supprimer
 * @returns {Promise<boolean>} true si au moins une ligne a été supprimée, false sinon
 */
export const remove = async (id: number) => {
    // Exécute le DELETE et récupère le nombre de lignes affectées
    const result = await pool.query(
        'DELETE FROM emprunts WHERE id = $1',
        [id]
    );

    // Retourne true si au moins 1 ligne supprimée, false sinon
    return result.rowCount !== null && result.rowCount > 0;
};