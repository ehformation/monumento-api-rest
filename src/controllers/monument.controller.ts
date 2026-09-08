import type { RequestHandler } from 'express';
import { Monument } from '../models/monument.model.js';

export const findAll: RequestHandler = async (req, res) => {
    try {
        const monuments = await Monument.findAll();
        res.json({ message: 'Liste des monuments', data: monuments });
    } catch (error) {
        console.error('Erreur lors de la récupération des monuments :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};