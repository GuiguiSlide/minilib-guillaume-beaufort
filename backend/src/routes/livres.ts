//le lien entre app.js et tout le code de la partie livres
import express from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import validateLivre from '../middleware/validateLivre.js';
import * as controller from '../controllers/livresController.js';
const router = express.Router();
router.get('/', asyncWrapper(controller.getLivres));
router.get('/:id', asyncWrapper(controller.getLivreById));
router.post('/', validateLivre, asyncWrapper(controller.createLivre));
router.put('/:id', validateLivre, asyncWrapper(controller.updateLivre));
router.delete('/:id', asyncWrapper(controller.deleteLivre));
export default router;
