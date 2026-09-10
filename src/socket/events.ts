import type { TokenPayload } from "../services/token.service.js";

export interface SocketData {
  user: TokenPayload;
}

export interface ChatMessage {
  from: string;
  text: string;
  date: string;
}

// Ce que le CLIENT envoie au serveur
export interface ClientToServerEvents {
  "chat:send": (payload: { text: string }) => void;
  connect_error: (err: Error) => void;
}

// Ce que le SERVEUR envoie au client
export interface ServerToClientEvents {
  welcome: (payload: { message: string; date: string }) => void;
  "chat:message": (message: ChatMessage) => void;
  connect_error: (err: Error) => void;
}