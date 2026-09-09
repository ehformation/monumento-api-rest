import type { RequestHandler } from 'express';
import { Monument } from '../models/monument.model.js';
import { notFoundError, badRequestError } from '../errors/http-error.js';
import { Op } from 'sequelize';

const SORTABLE = ["title", "buildYear", "createdAt"] as const;
type Sortable = (typeof SORTABLE)[number];


export const findAll: RequestHandler = async (req, res) => {
    const title = typeof req.query.title === 'string' ? req.query.title : undefined;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : undefined;
    const orderBy = req.query.orderBy;

    if(limit !== undefined && (!Number.isInteger(limit) || limit <= 1 || limit > 100)) {
        throw badRequestError("Le paramètre 'limit' est invalide.");
    }

    if (orderBy !== undefined && !SORTABLE.includes(orderBy as Sortable)) {
        throw badRequestError(`orderBy doit être l'un de : ${SORTABLE.join(", ")}.`);
    }

    const monuments = await Monument.findAll({
        where: title ? { title: { [Op.like]: `%${title}%` } } : undefined,
        limit,
        order: orderBy ? [[orderBy as Sortable, 'ASC']] : undefined,
    });
    
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