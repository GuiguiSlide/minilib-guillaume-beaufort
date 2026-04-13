import express from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import * as controller from '../controllers/empruntsController.js';

const router = express.Router();

// GET all emprunts
router.get('/', asyncWrapper(controller.getEmprunts));

// GET one emprunt
router.get('/:id', asyncWrapper(controller.getEmpruntById));

// GET emprunts with details (JOINs)
router.get('/details', asyncWrapper(controller.getEmpruntsDetailed));

// CREATE emprunt
router.post('/', asyncWrapper(controller.createEmprunt));

// UPDATE (for return)
router.put('/:id', asyncWrapper(controller.updateEmprunt));

// DELETE (optional)
router.delete('/:id', asyncWrapper(controller.deleteEmprunt));
export default router;