// backend/src/middleware/asyncWrapper.js
/**
* Enveloppe un handler Express async pour propager les erreurs.
* Quand quelqu’un envoie une requête GET sur la route '/' du serveur, le handler prend cette requête et répond au client
* @param {Function} fn - Handler async
* @returns {Function} Handler avec gestion d'erreur automatique
*/
const asyncWrapper = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
export default asyncWrapper;