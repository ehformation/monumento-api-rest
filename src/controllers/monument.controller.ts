import type { RequestHandler } from 'express';
import { Monument } from '../models/monument.model.js';
import { notFoundError } from '../errors/http-error.js';

export const findAll: RequestHandler = async (req, res) => {
    const monuments = await Monument.findAll();
    res.json({ message: 'Liste des monuments', data: monuments });
};

export const findById: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const monument = await Monument.findByPk(id);
    if (!monument) throw notFoundError(`Le monument avec l'ID ${id} n'a pas été trouvé`);
    res.json({ message: 'Monument trouvé', data: monument });
};

export const create: RequestHandler = async (req, res) => {
    const newMonument = await Monument.create(req.body);
    res.status(201).json({ message: 'Monument créé', data: newMonument });
};

export const update: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const updatedRows = await Monument.update(req.body, {
        where: { id }
    });

    if (!updatedRows[0]) throw notFoundError(`Le monument avec l'ID ${id} n'a pas été trouvé`);
    res.json({ message: 'Monument mis à jour', data: updatedRows[0] });
};

export const remove: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const deletedRowsCount = await Monument.destroy({ where: { id } });

    if (deletedRowsCount === 0) throw notFoundError(`Le monument avec l'ID ${id} n'a pas été trouvé`);
    res.json({ message: 'Monument supprimé', data: null });
};