// adherentcontroller sert a gerer les adherents : get tous les adherents, get adherent par id, creer un adherent, desactiver un adherent
// backend/src/controllers/adherentsController.js
import * as adherentsModel from '../models/adherentsModel.js';
import { Request, Response } from 'express';
import { Adherent, CreateAdherentDto } from '../types/index.js';    
/** GET /api/v1/adherents */
export const getAdherents = async (req:Request, res:Response): Promise<void> => {
    const adherents = await adherentsModel.findAll();
    res.json(adherents);
};
/** GET /api/v1/adherents/:id */
export const getAdherentById = async (req:Request, res:Response): Promise<void> => {
    const adherent = await adherentsModel.findById(Number(req.params.id));
    if (!adherent)
        res.status(404).json({
            erreur: `Adhérent id:${req.params.id} introuvable` });
    res.json(adherent);
};
/** POST /api/v1/adherents */
export const createAdherent = async (req:Request, res:Response): Promise<void> => {
    const { nom, prenom, email } = req.body;
    const manquants = ['nom', 'prenom', 'email'].filter(k => !req.body[k]);
    if (manquants.length > 0)
        res.status(400).json({
            erreur: 'Champs manquants', champs: manquants
        });
    const nouveau = await adherentsModel.create({ nom, prenom, email });
    res.status(201).json(nouveau);
};
/** DELETE /api/v1/adherents/:id — soft delete */
export const desactiverAdherent = async (req:Request, res:Response): Promise<void> => {
    const adherent = await adherentsModel.desactiver(Number(req.params.id));
    if (!adherent)
        res.status(404).json({
            erreur: `Adhérent id:${req.params.id} introuvable` });
    res.json(adherent);
};
/** PUT /api/v1/adherents/:id */
export const updateAdherent = async (req:Request, res:Response): Promise<void> => {
    const { nom, prenom, email } = req.body;
    const adherent = await adherentsModel.update(Number(req.params.id), { nom, prenom, email });
    if (!adherent)
        res.status(404).json({
            erreur: `Adhérent id:${req.params.id} introuvable` });
    res.json(adherent);
};