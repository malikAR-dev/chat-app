import { Server, Socket } from "socket.io";

export interface ServerToClientEvents {
  typing: (message: string) => void;
  joinRoom: (message: string) => void;
}

export const io = new Server<ServerToClientEvents>();

io.on("connection", (socket: Socket) => {
  socket.on("typing", (userName: string) => {
    socket.broadcast.emit("typing", `${userName} is typing..`);
  });

  socket.on("joinRoom", (roomId: number) => {
    socket.join(`room-${roomId}`);
  });
});

export const joinRoomNotification = (roomId: number, message: string) => {
  io.to(`room-${roomId}`).emit("joinRoom", message);
};
