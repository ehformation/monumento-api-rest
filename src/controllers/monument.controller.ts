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

export const findById: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    try {
        const monument = await Monument.findByPk(id);
        if (monument) {
            res.json({ message: 'Monument trouvé', data: monument });
        } else {
            res.status(404).json({ message: `Le monument avec l'ID ${id} n'a pas été trouvé`, data: null });
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération du monument avec l'ID ${id} :`, error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

export const create: RequestHandler = async (req, res) => {
    try {
        const newMonument = await Monument.create(req.body);
        res.status(201).json({ message: 'Monument créé', data: newMonument });
    } catch (error: any) {
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map((err: any) => err.message);
            res.status(400).json({ message: 'Erreur de validation', data: validationErrors });
            return;
        }   
        console.error('Erreur lors de la création du monument :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};