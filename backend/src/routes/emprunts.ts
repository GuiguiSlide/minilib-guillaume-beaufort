// ── LOANS (EMPRUNTS) ROUTES ──
// Connects app.ts to the loans controller layer
// Routes all loan-related HTTP requests to appropriate handlers
// Handles borrowing, returning, and loan management

import express from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import * as controller from '../controllers/empruntsController.js';

const router = express.Router();

/**
 * GET /api/v1/emprunts
 * Fetches all loans (basic information)
 * Wrapped with asyncWrapper to catch errors
 */
router.get('/', asyncWrapper(controller.getEmprunts));

/**
 * GET /api/v1/emprunts/:id
 * Fetches a single loan by ID
 */
router.get('/:id', asyncWrapper(controller.getEmpruntById));

/**
 * GET /api/v1/emprunts/details
 * Fetches all loans with enriched data from JOINs
 * Includes book titles, member names, overdue status
 */
router.get('/details', asyncWrapper(controller.getEmpruntsDetailed));

/**
 * POST /api/v1/emprunts
 * Creates a new loan (member borrows a book)
 * Checks if book is already borrowed
 * Sets return due date to 14 days from now
 * Marks book as unavailable
 */
router.post('/', asyncWrapper(controller.createEmprunt));

/**
 * PUT /api/v1/emprunts/:id
 * Updates a loan (used to mark as returned)
 * Sets date_retour_effective to current date
 * Marks book as available again
 */
router.put('/:id', asyncWrapper(controller.updateEmprunt));

/**
 * DELETE /api/v1/emprunts/:id
 * Removes a loan record (optional use)
 */
router.delete('/:id', asyncWrapper(controller.deleteEmprunt));

export default router;