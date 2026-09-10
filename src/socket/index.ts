import type http from "node:http";
import { Server } from "socket.io";

export function setupSocketServer(server: http.Server) : Server {
    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log(`Client connecté : ${socket.id}`);
    });
    
    return io;
}