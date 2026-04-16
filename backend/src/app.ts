// ── MAIN APPLICATION FILE (app.ts) ──
// Entry point for the MiniLib Express server
// Starts with: npm run dev

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
// Node 24: Environment variables loaded automatically via node --env-file=.env
// Import route handlers for each resource
import livresRouter from './routes/livres.js';
import adherentsRouter from './routes/adherents.js';
import empruntsRoutes from './routes/emprunts.js';

// ── EXPRESS APP INITIALIZATION ──
const app = express();
const PORT = process.env.PORT|| 5000; // Default to 5000 if PORT not set in .env

// ── GLOBAL MIDDLEWARES ──
/**
 * CORS Middleware
 * Allows cross-origin requests (React on port 3000 → API on 5000)
 */
app.use(cors());

/**
 * JSON Parser Middleware
 * Automatically parses JSON body of POST/PUT requests
 */
app.use(express.json());

/**
 * UTF-8 Header Middleware
 * Sets response Content-Type to JSON with UTF-8 encoding
 */
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

/**
 * Logging Middleware
 * Displays each incoming request (method, URL, timestamp)
 * Passes control to next middleware via next()
 */
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ── ROUTE MOUNTS ──
/**
 * Books routes
 * All routes are prefixed with /api/v1/livres
 */
app.use('/api/v1/livres', livresRouter);

/**
 * Members routes
 * All routes are prefixed with /api/v1/adherents
 */
app.use('/api/v1/adherents', adherentsRouter);

/**
 * Loans routes
 * All routes are prefixed with /api/v1/emprunts
 */
app.use('/api/v1/emprunts', empruntsRoutes);

// ── HEALTH CHECK ENDPOINT ──
/**
 * Health status endpoint
 * Used to verify server is running and responding
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Serveur MiniLib opérationnel',
        timestamp: new Date().toISOString(),
    });
});

// ── 404 NOT FOUND MIDDLEWARE ──
/**
 * Handles all routes that don't match defined endpoints
 * Returns 404 error with route information
 */
app.use((req, res) => {
    res.status(404).json({
        erreur: `Route ${req.method} ${req.url} non trouvée`,
    });
});

// ── ERROR HANDLING MIDDLEWARE ──
/**
 * Express error handler middleware
 * Recognized by having 4 parameters (err, req, res, next)
 * Catches all errors from routes and previous middlewares
 * Logs server errors and returns appropriate status codes
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    // ── EXTRACT STATUS CODE (default to 500) ──
    const status = (err as any).statusCode || 500;
    
    // ── DETERMINE ERROR MESSAGE ──
    const message = status === 500 ? 'Erreur interne du serveur' : err.message;
    
    // ── LOG SERVER ERRORS (500) ──
    if (status === 500) console.error('[ERREUR]', err.message);
    
    // ── SEND ERROR RESPONSE ──
    res.status(status).json({ erreur: message });
});

// ── SERVER STARTUP ──
/**
 * Starts Express server on specified PORT
 * Listens for incoming connections
 * Logs startup information to console
 */
app.listen(PORT, () => {
    console.log(`Serveur MiniLib démarré sur http://0.0.0.0:${PORT}`);
    console.log(`Environnement : ${process.env.NODE_ENV}`);
});

export default app;