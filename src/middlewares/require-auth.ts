import type { RequestHandler } from "express";
import { verifyAccessToken } from "../services/token.service.js";
import { unauthorizedError } from "../errors/http-error.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) throw unauthorizedError("Token d'authentification manquant.");

  req.user = verifyAccessToken(token);
  next();
};