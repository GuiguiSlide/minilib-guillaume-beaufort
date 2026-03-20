// backend/src/routes/adherents.js
//le lien entre app.js et tout le code de la partie adherents
import express from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import * as controller from '../controllers/adherentsController.js';
const router = express.Router();
router.get('/', asyncWrapper(controller.getAdherents));
router.get('/:id', asyncWrapper(controller.getAdherentById));
router.post('/', asyncWrapper(controller.createAdherent));
router.delete('/:id', asyncWrapper(controller.desactiverAdherent));
export default router;