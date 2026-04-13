// ── BOOK VALIDATION MIDDLEWARE ──
// Validates POST/PUT request body for book creation/update
// Used on createLivre and updateLivre routes

import { Request, Response, NextFunction } from 'express';
import { CreateLivreDto } from '../types/index.js';

/**
 * Express middleware that validates book creation/update requests
 * Checks that required fields (isbn, titre, auteur) are provided and non-empty
 * 
 * Usage: router.post('/', validateLivre, controller.createLivre)
 * 
 * @param req - Express request object with body
 * @param res - Express response object for sending errors
 * @param next - Express next middleware function
 * 
 * If validation passes: calls next() to proceed to controller
 * If validation fails: sends 400 status with error details and returns
 */
const validateLivre = (req: Request, res: Response, next: NextFunction): void => {
    // ── EXTRACT REQUIRED FIELDS FROM REQUEST BODY ──
    const { isbn, titre, auteur } = req.body as Partial<CreateLivreDto>;
    
    // ── COLLECT VALIDATION ERRORS ──
    const erreurs = [];
    
    // ── CHECK EACH REQUIRED FIELD ──
    if (!isbn || isbn.trim() === '') erreurs.push('isbn est requis');
    if (!titre || titre.trim() === '') erreurs.push('titre est requis');
    if (!auteur || auteur.trim() === '') erreurs.push('auteur est requis');
    
    // ── IF ERRORS EXIST: SEND 400 RESPONSE AND STOP ──
    if (erreurs.length > 0) {
        res.status(400).json({ erreurs });
        return;
    }
    
    // ── ALL CHECKS PASSED: PROCEED TO NEXT MIDDLEWARE/CONTROLLER ──
    next();
};

export default validateLivre;