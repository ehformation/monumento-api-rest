import type { RequestHandler } from 'express';
import { Monument } from '../models/monument.model.js';

export const findAll: RequestHandler = async (req, res) => {
    const monuments = await Monument.findAll();
    res.json({ message: 'Liste des monuments', data: monuments });
};

export const findById: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const monument = await Monument.findByPk(id);
    if (monument) {
        res.json({ message: 'Monument trouvé', data: monument });
    } else {
        res.status(404).json({ message: `Le monument avec l'ID ${id} n'a pas été trouvé`, data: null });
    }
};

export const create: RequestHandler = async (req, res) => {
    const newMonument = await Monument.create(req.body);
    res.status(201).json({ message: 'Monument créé', data: newMonument });
};

export const update: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const [updatedRowsCount, updatedRows] = await Monument.update(req.body, {
        where: { id },
        returning: true,
    });

    if (updatedRowsCount === 0) {
        res.status(404).json({ message: `Le monument avec l'ID ${id} n'a pas été trouvé`, data: null });
    } else {
        res.json({ message: 'Monument mis à jour', data: updatedRows[0] });
    }
};

export const remove: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const deletedRowsCount = await Monument.destroy({ where: { id } });

    if (deletedRowsCount === 0) {
        res.status(404).json({ message: `Le monument avec l'ID ${id} n'a pas été trouvé`, data: null });
    } else {
        res.json({ message: 'Monument supprimé', data: null });
    }
};