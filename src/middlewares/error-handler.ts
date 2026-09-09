import type { ErrorRequestHandler } from "express";
import { ValidationError, UniqueConstraintError } from "sequelize";
import { env } from "../config/env.js";
import { HttpError } from "../errors/http-error.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("Erreur capturée par le middleware :", err);

  if(err instanceof HttpError) {
    res.status(err.status).json({ message: err.message, data: err.data });
    return;
  }

  if (err.type === "entity.parse.failed") {
    res.status(400).json({ message: "Le corps de la requête n'est pas un JSON valide.", data: null });
    return;
  }

  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    const validationErrors = err.errors.map((error) => error.message);
    return res.status(400).json({
        message: "Erreur de validation",
        data: validationErrors,
    });
  }

  res.status(500).json({
    message: "Une erreur serveur est survenue. Veuillez réessayer plus tard.",
    data: env.NODE_ENV === "development" ? err.message : null,
  });
}

