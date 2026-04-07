// livrescontroller sert a gerer les livres : get tous les livres, get livre par id, creer un livre, modifier un livre, supprimer un livre
// backend/src/controllers/livresController.js — version async + PostgreSQL
import { Request, Response } from 'express';
import * as livresModel from '../models/livresModel.js';
import { Livre, CreateLivreDto, FiltresLivre } from '../types/index.js';
/**
* GET /api/v1/livres — récupère tous les livres avec filtres optionnels.
* @param {import('express').Request} req
* @param {import('express').Response} res
*/
export const getLivres = async (req: Request, res: Response): Promise<void> => {
    const { genre, disponible, recherche } = req.query;
    const filtres: FiltresLivre = {
        genre: typeof genre === 'string' ? genre : undefined,
        disponible: disponible === 'true' ? true : disponible === 'false' ? false : undefined,
        recherche: typeof recherche === 'string' ? recherche : undefined
    };
    const livres = await livresModel.findAll(filtres);
    res.json(livres);
};
/** GET /api/v1/livres/:id */
export const getLivreById = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }
    
    const livre = await livresModel.findById(id);
    if (!livre) {
        res.status(404).json({
            erreur: `Livre id:${req.params.id} introuvable`
        });
        return;
    }
    res.json(livre);
};
/** POST /api/v1/livres */
export const createLivre = async (req: Request, res: Response): Promise<void> => {
    const { isbn, titre, auteur, annee, genre } = req.body;
    const manquants = ['isbn', 'titre', 'auteur'].filter(k => !req.body[k]);
    if (manquants.length > 0) {
        res.status(400).json({
            erreur: 'Champs manquants', champs: manquants
        });
        return;
    }
    const nouveau = await livresModel.create({
        isbn, titre, auteur, annee,
        genre
    });
    res.status(201).json(nouveau);
};
/** PUT /api/v1/livres/:id */
export const updateLivre = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }
    const livre = await livresModel.update(id, req.body);
    if (!livre) {
        res.status(404).json({ 
            erreur: `Livre id:${req.params.id} introuvable`
        });
        return;
    }
    res.json(livre);
};
/** DELETE /api/v1/livres/:id */
export const deleteLivre = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ erreur: 'ID invalide' });
        return;
    }
    const ok = await livresModel.remove(id);
    if (!ok) {
        res.status(404).json({
            erreur: `Livre id:${req.params.id} introuvable` 
        });
        return;
    }
    res.status(204).send();
};