import { Request, Response } from 'express';
import * as empruntsModel from '../models/empruntsModel.js';

/**
 * GET /api/v1/emprunts
 */
export const getEmprunts = async (req: Request, res: Response): Promise<void> => {
    const emprunts = await empruntsModel.findAll();
    res.json(emprunts);
};

/**
 * GET /api/v1/emprunts/:id
 */
export const getEmpruntById = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }

    const emprunt = await empruntsModel.findById(id);

    if (!emprunt) {
        res.status(404).json({ erreur: `Emprunt id:${id} introuvable` });
        return;
    }

    res.json(emprunt);
};

/**
 * POST /api/v1/emprunts
 * Create a new borrow
 */
export const createEmprunt = async (req: Request, res: Response): Promise<void> => {
    const { adherent_id, livre_id } = req.body;

    if (!adherent_id || !livre_id) {
        res.status(400).json({ erreur: 'Champs manquants' });
        return;
    }

    // ⚠️ business logic should be enforced in model (or DB)
    const nouvelEmprunt = await empruntsModel.create({
        adherent_id,
        livre_id
    });

    res.status(201).json(nouvelEmprunt);
};

/**
 * PUT /api/v1/emprunts/:id
 * Used for "return book"
 */
export const updateEmprunt = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }

    const updated = await empruntsModel.returnLivre(id);

    if (!updated) {
        res.status(404).json({ erreur: `Emprunt id:${id} introuvable` });
        return;
    }

    res.json(updated);
};

/**
 * DELETE /api/v1/emprunts/:id
 */
export const deleteEmprunt = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }

    const ok = await empruntsModel.remove(id);

    if (!ok) {
        res.status(404).json({ erreur: `Emprunt id:${id} introuvable` });
        return;
    }

    res.status(204).send();
};


export const getEmpruntsDetailed = async (req: Request, res: Response) => {
    const data = await empruntsModel.findAllDetailed();
    res.json(data);
};