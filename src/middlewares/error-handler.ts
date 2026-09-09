import type { ErrorRequestHandler } from "express";
import { ValidationError, UniqueConstraintError } from "sequelize";
import { env } from "../config/env.js";
import { HttpError, badRequestError, internalServerError } from "../errors/http-error.js";

function toHttpError(err: unknown): HttpError {
  if (err instanceof HttpError) return err;

  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    return badRequestError("Erreur de validation", err.errors.map((e) => e.message));
  }

  if (typeof err === "object" && err !== null && (err as { type?: string }).type === "entity.parse.failed") {
    return badRequestError("Le corps de la requête n'est pas un JSON valide.");
  }

  return internalServerError(
    "Une erreur serveur est survenue. Veuillez réessayer plus tard.",
    env.NODE_ENV === "development" && err instanceof Error ? err.message : null,
  );
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const httpError = toHttpError(err);

  if (httpError.status >= 500) {
    console.error("Erreur serveur :", err);
  }

  res.status(httpError.status).json({ message: httpError.message, data: httpError.data });
};