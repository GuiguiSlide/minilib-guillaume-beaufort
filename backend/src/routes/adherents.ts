// ── MEMBERS (ADHERENTS) ROUTES ──
// Connects app.ts to the members controller layer
// Routes all member-related HTTP requests to appropriate handlers
// Handles CRUD operations for library members

import express from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import * as controller from '../controllers/adherentsController.js';

const router = express.Router();

/**
 * GET /api/v1/adherents
 * Fetches all active members
 * Wrapped with asyncWrapper to catch errors
 */
router.get('/', asyncWrapper(controller.getAdherents));

/**
 * GET /api/v1/adherents/:id
 * Fetches a single member by ID
 */
router.get('/:id', asyncWrapper(controller.getAdherentById));

/**
 * POST /api/v1/adherents
 * Creates a new member with auto-generated member number
 */
router.post('/', asyncWrapper(controller.createAdherent));

/**
 * PUT /api/v1/adherents/:id
 * Updates an existing member's information
 */
router.put('/:id', asyncWrapper(controller.updateAdherent));

/**
 * DELETE /api/v1/adherents/:id
 * Soft deletes a member (marks as inactive, doesn't remove from DB)
 */
router.delete('/:id', asyncWrapper(controller.desactiverAdherent));

export default router;