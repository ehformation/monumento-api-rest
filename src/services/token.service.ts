import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface TokenPayload {
  userId: number;
  username: string;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { algorithm: "HS256", expiresIn: env.ACCESS_TOKEN_TTL });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] }) as TokenPayload;
}