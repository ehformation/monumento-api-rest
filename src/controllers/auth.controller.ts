import { RequestHandler } from 'express';
import * as authService from '../services/auth.service.js';
import { badRequestError } from '../errors/http-error.js';

function validateCredentials(body: unknown): authService.Credentials {
  if (!body || typeof body !== "object") {
    throw badRequestError("Les identifiants sont invalides.");
  }

  const { username, password } = body as Record<string, unknown>;

  if (!username || typeof username !== "string") {
    throw badRequestError("Le nom d'utilisateur est requis.");
  }

  if (!password || typeof password !== "string") {
    throw badRequestError("Le mot de passe est requis.");
  }

  return { username, password };
}

export const register: RequestHandler = async (req, res) => {
  const credentials = validateCredentials(req.body);
  const newUser = await authService.register(credentials);
  res.status(201).json({ message: "Utilisateur enregistré avec succès.", data: newUser });
}

export const login: RequestHandler = async (req, res) => {
  const credentials = validateCredentials(req.body);
  const user = await authService.login(credentials);
  res.status(200).json({ message: "Connexion réussie.", data: user });
}