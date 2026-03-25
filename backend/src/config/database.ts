// backend/src/config/database.js
// Connecter à la base de données PostgreSQL et charger les scripts JS.


/**
* Pool de connexions PostgreSQL partagé dans toute l'application.
* Chargé via Node 24 : node --env-file=.env src/app.js
* @module database
*/
// on importe pg de node_modules qui veut dire postgreSQL, c'est la bibliothèque qui nous permet de communiquer avec la base de données PostgreSQL
import pg from 'pg';
// on créé un Pool le poul sert aux connexions à la base de données, il gère un pool de connexions réutilisables
const { Pool } = pg;
// on créé une instance de Pool avec les paramètres de connexion à la base de données
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
//js only    port: parseInt(process.env.DB_PORT) || 5432,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME || 'minilib',
    user: process.env.DB_USER || 'minilib_user',
    password: process.env.DB_PASSWORD,
    max: 10,
    idleTimeoutMillis: 30000,
});
// on fait la gestion des connection et des erreurs de connection à la base de données
pool.on('connect', () => console.log('[DB] Pool PostgreSQL connecté'));
pool.on('error', (err) => console.error('[DB] Erreur pool:',err.message));
// on envois en global(dans les fichiers qu'on utilise) le pool pour que les autres fichiers puissent l'utiliser pour faire des requetes à la base de données
export default pool;