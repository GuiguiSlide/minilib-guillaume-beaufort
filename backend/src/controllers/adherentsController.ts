// ── MEMBERS CONTROLLER ──
// Handles HTTP requests for member operations
// Acts as intermediary between routes and database models
// Validates input, calls model functions, and returns formatted responses

import * as adherentsModel from '../models/adherentsModel.js';
import { Request, Response } from 'express';
import { Adherent, CreateAdherentDto } from '../types/index.js';

/**
 * GET /api/v1/adherents
 * Fetches all active members
 * @param req - Express request object
 * @param res - Response returning array of Adherent objects
 */
export const getAdherents = async (req: Request, res: Response): Promise<void> => {
    // ── FETCH ALL ACTIVE MEMBERS FROM DATABASE ──
    const adherents = await adherentsModel.findAll();
    
    // ── RETURN RESPONSE ──
    res.json(adherents);
};

/**
 * GET /api/v1/adherents/:id
 * Fetches a single member by ID
 * Returns 404 if member not found
 */
export const getAdherentById = async (req: Request, res: Response): Promise<void> => {
    // ── FETCH FROM DATABASE ──
    const adherent = await adherentsModel.findById(Number(req.params.id));
    
    // ── 404 IF NOT FOUND ──
    if (!adherent)
        res.status(404).json({
            erreur: `Adhérent id:${req.params.id} introuvable`
        });
    
    // ── RETURN MEMBER ──
    res.json(adherent);
};

/**
 * POST /api/v1/adherents
 * Creates a new member with auto-generated member number
 * Returns 400 if required fields are missing
 * Returns 201 with created member
 */
export const createAdherent = async (req: Request, res: Response): Promise<void> => {
    // ── EXTRACT FIELDS FROM REQUEST BODY ──
    const { nom, prenom, email } = req.body;
    
    // ── VALIDATE REQUIRED FIELDS ──
    const manquants = ['nom', 'prenom', 'email'].filter(k => !req.body[k]);
    if (manquants.length > 0)
        res.status(400).json({
            erreur: 'Champs manquants', 
            champs: manquants
        });
    
    // ── CREATE IN DATABASE ──
    const nouveau = await adherentsModel.create({ nom, prenom, email });
    
    // ── RETURN 201 CREATED WITH NEW MEMBER ──
    res.status(201).json(nouveau);
};

/**
 * DELETE /api/v1/adherents/:id
 * Soft deletes a member (marks as inactive, doesn't remove from DB)
 * Returns 404 if member not found
 */
export const desactiverAdherent = async (req: Request, res: Response): Promise<void> => {
    // ── SOFT DELETE (SET actif = false) ──
    const adherent = await adherentsModel.desactiver(Number(req.params.id));
    
    // ── 404 IF NOT FOUND ──
    if (!adherent)
        res.status(404).json({
            erreur: `Adhérent id:${req.params.id} introuvable`
        });
    
    // ── RETURN DEACTIVATED MEMBER ──
    res.json(adherent);
};

/**
 * PUT /api/v1/adherents/:id
 * Updates an existing member's information
 * Returns 404 if member not found
 */
export const updateAdherent = async (req: Request, res: Response): Promise<void> => {
    // ── EXTRACT FIELDS FROM REQUEST BODY ──
    const { nom, prenom, email } = req.body;
    
    // ── UPDATE IN DATABASE ──
    const adherent = await adherentsModel.update(Number(req.params.id), { nom, prenom, email });
    
    // ── 404 IF NOT FOUND ──
    if (!adherent)
        res.status(404).json({
            erreur: `Adhérent id:${req.params.id} introuvable`
        });
    
    // ── RETURN UPDATED MEMBER ──
    res.json(adherent);
};