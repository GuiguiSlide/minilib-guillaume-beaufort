// ── BOOKS CONTROLLER ──
// Handles HTTP requests for book operations
// Acts as intermediary between routes and database models
// Validates input, calls model functions, and returns formatted responses

import { Request, Response } from 'express';
import * as livresModel from '../models/livresModel.js';
import { Livre, CreateLivreDto, FiltresLivre } from '../types/index.js';

/**
 * GET /api/v1/livres
 * Fetches all books with optional query filters
 * @param req - Request with query parameters (genre, disponible, recherche)
 * @param res - Response returning array of Livre objects
 */
export const getLivres = async (req: Request, res: Response): Promise<void> => {
    // ── EXTRACT QUERY PARAMETERS ──
    const { genre, disponible, recherche } = req.query;
    
    // ── CONVERT QUERY STRINGS TO TYPED FILTERS ──
    const filtres: FiltresLivre = {
        genre: typeof genre === 'string' ? genre : undefined,
        disponible: disponible === 'true' ? true : disponible === 'false' ? false : undefined,
        recherche: typeof recherche === 'string' ? recherche : undefined
    };
    
    // ── FETCH FROM DATABASE ──
    const livres = await livresModel.findAll(filtres);
    
    // ── RETURN RESPONSE ──
    res.json(livres);
};

/**
 * GET /api/v1/livres/:id
 * Fetches a single book by ID
 * Returns 404 if book not found
 */
export const getLivreById = async (req: Request, res: Response): Promise<void> => {
    // ── PARSE AND VALIDATE ID ──
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }

    // ── FETCH FROM DATABASE ──
    const livre = await livresModel.findById(id);
    
    // ── 404 IF NOT FOUND ──
    if (!livre) {
        res.status(404).json({
            erreur: `Livre id:${req.params.id} introuvable`
        });
        return;
    }
    
    // ── RETURN BOOK ──
    res.json(livre);
};

/**
 * POST /api/v1/livres
 * Creates a new book
 * Returns 400 if required fields are missing
 * Returns 201 with created book
 */
export const createLivre = async (req: Request, res: Response): Promise<void> => {
    // ── EXTRACT FIELDS FROM REQUEST BODY ──
    const { isbn, titre, auteur, annee, genre } = req.body;
    
    // ── VALIDATE REQUIRED FIELDS ──
    const manquants = ['isbn', 'titre', 'auteur'].filter(k => !req.body[k]);
    if (manquants.length > 0) {
        res.status(400).json({
            erreur: 'Champs manquants', 
            champs: manquants
        });
        return;
    }
    
    // ── CREATE IN DATABASE ──
    const nouveau = await livresModel.create({
        isbn, titre, auteur, annee, genre
    });
    
    // ── RETURN 201 CREATED WITH NEW BOOK ──
    res.status(201).json(nouveau);
};

/**
 * PUT /api/v1/livres/:id
 * Updates an existing book
 * Returns 404 if book not found
 */
export const updateLivre = async (req: Request, res: Response): Promise<void> => {
    // ── PARSE AND VALIDATE ID ──
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }
    
    // ── UPDATE IN DATABASE ──
    const livre = await livresModel.update(id, req.body);
    
    // ── 404 IF NOT FOUND ──
    if (!livre) {
        res.status(404).json({
            erreur: `Livre id:${req.params.id} introuvable`
        });
        return;
    }
    
    // ── RETURN UPDATED BOOK ──
    res.json(livre);
};

/**
 * DELETE /api/v1/livres/:id
 * Deletes a book
 * Returns 404 if book not found
 * Returns 204 No Content on success
 */
export const deleteLivre = async (req: Request, res: Response): Promise<void> => {
    // ── PARSE AND VALIDATE ID ──
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }
    
    // ── DELETE FROM DATABASE ──
    const ok = await livresModel.remove(id);
    
    // ── 404 IF NOT FOUND ──
    if (!ok) {
        res.status(404).json({
            erreur: `Livre id:${req.params.id} introuvable`
        });
        return;
    }
    
    // ── RETURN 204 NO CONTENT ──
    res.status(204).send();
};