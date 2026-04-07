// backend/src/routes/adherents.js
//le lien entre app.js et tout le code de la partie adherents
//fonctionne comme le __init__.py en python et l'envois au controller les requetes qui arrivent sur la route /api/v1/adherents
import express from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import * as controller from '../controllers/adherentsController.js';
//router redirige les requetes vers les controllers en fonction de la route et de la méthode HTTP
const router = express.Router();
router.get('/', asyncWrapper(controller.getAdherents));
router.get('/:id', asyncWrapper(controller.getAdherentById));
router.post('/', asyncWrapper(controller.createAdherent));
router.put('/:id', asyncWrapper(controller.updateAdherent));
router.delete('/:id', asyncWrapper(controller.desactiverAdherent));
export default router;