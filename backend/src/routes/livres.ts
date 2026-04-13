// ── BOOKS ROUTES ──
// Connects app.ts to the books controller layer
// Routes all book-related HTTP requests to appropriate handlers
// Implements validation and error handling middleware

import express from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import validateLivre from '../middleware/validateLivre.js';
import * as controller from '../controllers/livresController.js';

const router = express.Router();

/**
 * GET /api/v1/livres
 * Fetches all books with optional filters
 * Wrapped with asyncWrapper to catch errors
 */
router.get('/', asyncWrapper(controller.getLivres));

/**
 * GET /api/v1/livres/:id
 * Fetches a single book by ID
 */
router.get('/:id', asyncWrapper(controller.getLivreById));

/**
 * POST /api/v1/livres
 * Creates a new book
 * Validates request body using validateLivre middleware first
 */
router.post('/', validateLivre, asyncWrapper(controller.createLivre));

/**
 * PUT /api/v1/livres/:id
 * Updates an existing book
 * Validates request body using validateLivre middleware first
 */
router.put('/:id', validateLivre, asyncWrapper(controller.updateLivre));

/**
 * DELETE /api/v1/livres/:id
 * Deletes a book
 */
router.delete('/:id', asyncWrapper(controller.deleteLivre));

export default router;
