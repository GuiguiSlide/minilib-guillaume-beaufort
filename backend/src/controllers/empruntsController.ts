// ── LOANS CONTROLLER ──
// Handles HTTP requests for loan operations
// Acts as intermediary between routes and database models
// Manages borrowing, returning, and loan queries

import { Request, Response } from 'express';
import * as empruntsModel from '../models/empruntsModel.js';

/**
 * GET /api/v1/emprunts
 * Fetches all loans with detailed information (titles and names via JOINs)
 * @param req - Express request object
 * @param res - Response returning array of loans
 */
export const getEmprunts = async (req: Request, res: Response): Promise<void> => {
    // ── FETCH ALL LOANS FROM DATABASE WITH DETAILS ──
    const emprunts = await empruntsModel.findAllDetailed();
    
    // ── RETURN RESPONSE ──
    res.json(emprunts);
};

/**
 * GET /api/v1/emprunts/:id
 * Fetches a single loan by ID
 * Returns 404 if loan not found
 */
export const getEmpruntById = async (req: Request, res: Response): Promise<void> => {
    // ── PARSE AND VALIDATE ID ──
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }

    // ── FETCH FROM DATABASE ──
    const emprunt = await empruntsModel.findById(id);

    // ── 404 IF NOT FOUND ──
    if (!emprunt) {
        res.status(404).json({ erreur: `Emprunt id:${id} introuvable` });
        return;
    }

    // ── RETURN LOAN ──
    res.json(emprunt);
};

/**
 * POST /api/v1/emprunts
 * Creates a new loan (member borrows a book)
 * Checks if book is already borrowed
 * Sets return due date to 14 days by default
 * Marks book as unavailable
 * Returns 201 with created loan
 */
export const createEmprunt = async (req: Request, res: Response): Promise<void> => {
    // ── EXTRACT REQUIRED FIELDS ──
    const { adherent_id, livre_id } = req.body;

    // ── VALIDATE REQUIRED FIELDS ──
    if (!adherent_id || !livre_id) {
        res.status(400).json({ erreur: 'Champs manquants' });
        return;
    }

    // ── CREATE IN DATABASE ──
    // Business logic is enforced in the model (checking availability, etc.)
    const nouvelEmprunt = await empruntsModel.create({
        adherent_id,
        livre_id
    });

    // ── RETURN 201 CREATED WITH NEW LOAN ──
    res.status(201).json(nouvelEmprunt);
};

/**
 * PUT /api/v1/emprunts/:id
 * Updates a loan to mark it as returned
 * Sets date_retour_effective to current date
 * Marks book as available again
 * Returns 404 if loan not found
 */
export const updateEmprunt = async (req: Request, res: Response): Promise<void> => {
    // ── PARSE AND VALIDATE ID ──
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }

    // ── CALL MODEL TO MARK AS RETURNED ──
    const updated = await empruntsModel.returnLivre(id);

    // ── 404 IF NOT FOUND ──
    if (!updated) {
        res.status(404).json({ erreur: `Emprunt id:${id} introuvable` });
        return;
    }

    // ── RETURN UPDATED LOAN ──
    res.json(updated);
};

/**
 * DELETE /api/v1/emprunts/:id
 * Deletes a loan record from database
 * Returns 404 if loan not found
 * Returns 204 No Content on success
 */
export const deleteEmprunt = async (req: Request, res: Response): Promise<void> => {
    // ── PARSE AND VALIDATE ID ──
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }

    // ── DELETE FROM DATABASE ──
    const ok = await empruntsModel.remove(id);

    // ── 404 IF NOT FOUND ──
    if (!ok) {
        res.status(404).json({ erreur: `Emprunt id:${id} introuvable` });
        return;
    }

    // ── RETURN 204 NO CONTENT ──
    res.status(204).send();
};

/**
 * GET /api/v1/emprunts/details
 * Fetches all loans with enriched data from JOINs
 * Includes book titles, member names, and overdue status
 * Prioritizes overdue loans first
 */
export const getEmpruntsDetailed = async (req: Request, res: Response) => {
    // ── FETCH WITH JOINED DATA ──
    const data = await empruntsModel.findAllDetailed();
    
    // ── RETURN RESPONSE ──
    res.json(data);
};