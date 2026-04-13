// ── DATABASE CONFIGURATION (database.ts) ──
// PostgreSQL connection pool and client management
// Loads credentials from environment variables (.env file)
// Shared pool used throughout the entire application

import pg from 'pg';
const { Pool } = pg;

/**
 * PostgreSQL Connection Pool
 * Manages reusable database connections for performance
 * Loaded via Node 24: node --env-file=.env src/app.ts
 * 
 * Configuration:
 * - host: Database server hostname (localhost by default)
 * - port: PostgreSQL port (5432 by default)
 * - database: Database name (minilib by default)
 * - user: Database user (minilib_user by default)
 * - password: User password (from .env)
 * - max: Maximum 10 concurrent connections
 * - idleTimeoutMillis: Close unused connections after 30 seconds
 */
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME || 'minilib',
    user: process.env.DB_USER || 'minilib_user',
    password: process.env.DB_PASSWORD,
    max: 10,
    idleTimeoutMillis: 30000,
});

// ── POOL EVENT HANDLERS ──
/**
 * Fires when a new connection is established in the pool
 */
pool.on('connect', () => console.log('[DB] Pool PostgreSQL connecté'));

/**
 * Fires when a connection error occurs
 * Logs error message for debugging
 */
pool.on('error', (err) => console.error('[DB] Erreur pool:', err.message));

export default pool;