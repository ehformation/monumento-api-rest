import type http from "node:http";
import { Server } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from "./events.js";
import { verifyAccessToken, type TokenPayload } from "../services/token.service.js";

export function setupSocketServer(server: http.Server) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(server, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if(typeof token !== "string"){
        return next(new Error("Token manquant ou invalide"));
    }

    try {
        socket.data.user = verifyAccessToken(token);
        next();
    } catch (err) {
        return next(new Error("Token invalide"));
    }
  });

  io.on("connection", (socket) => {
    const { username } = socket.data.user;
    console.log(`${username} connecté (${socket.id})`);


    socket.emit("welcome", { message: "Bienvenue sur le chat Monumento", date: new Date().toISOString() });

    socket.on("chat:send", (payload) => {
      io.emit("chat:message", { from: username, text: payload.text, date: new Date().toISOString() });
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client déconnecté : ${username} (${socket.id}) (${reason})`);
    });

    socket.on("connect_error", (err) => {
        console.error("Connexion refusée :", err.message);
    });
  });

  return io;
}