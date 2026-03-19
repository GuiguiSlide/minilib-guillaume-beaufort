// ─── backend/src/routes/livres.js ──────────────────────────────────────
// Routeur Express pour les livres
// Toutes ces routes sont préfixées par /api/v1/livres dans app.js
import express from 'express';
const router = express.Router();
import * as controller from '../controllers/livresControllers.js';
// GET /api/v1/livres → liste tous les livres (+ filtres query params)
router.get('/', controller.getLivres);
// GET /api/v1/livres/:id → détail d'un livre
router.get('/recherche', (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ erreur: 'Paramètre q requis' });
    const resultats = livresModel.findAll({ recherche: q });
    res.json({ query: q, total: resultats.length, resultats });
});
// ⚠ Cette route doit être AVANT router.get('/:id') — sinon Express
// interpréterait 'recherche' comme un id !
router.get('/:id', controller.getLivreById);
// POST /api/v1/livres → créer un nouveau livre
router.post('/', controller.createLivre);
// PUT /api/v1/livres/:id → modifier un livre
router.put('/:id', controller.updateLivre);
// DELETE /api/v1/livres/:id → supprimer un livre
router.delete('/:id', controller.deleteLivre);
// GET /api/v1/livres/recherche?q=clean
export default router;
