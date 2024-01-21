import { Server, Socket } from "socket.io";

export interface ServerToClientEvents {
  typing: (message: string) => void;
  joinRoom: (message: string) => void;
  leaveRoom: (message: string) => void;
}

const usersInRooms: Record<number, number[]> = {};

export const io = new Server<ServerToClientEvents>();

io.on("connection", (socket: Socket) => {
  socket.on("typing", (userName: string) => {
    socket.broadcast.emit("typing", `${userName} is typing..`);
  });

  socket.on("joinRoom", (roomId: number, userId: number) => {
    if (!usersInRooms[roomId] || !usersInRooms[roomId].includes(userId)) {
      if (!usersInRooms[roomId]) {
        usersInRooms[roomId] = [];
      }
      usersInRooms[roomId].push(userId);
      socket.join(`room-${roomId}`);
    }
  });

  socket.on("leaveRoom", (roomId: number, userId: number) => {
    if (usersInRooms[roomId] && usersInRooms[roomId].includes(userId)) {
      const index = usersInRooms[roomId].indexOf(userId);
      if (index !== -1) {
        usersInRooms[roomId].splice(index, 1);
        socket.leave(`room-${roomId}`);
      }
    }
  });
});

export const joinRoomNotification = (roomId: number, message: string) => {
  io.to(`room-${roomId}`).emit("joinRoom", message);
};

export const leaveRoomNotification = (roomId: number, message: string) => {
  io.to(`room-${roomId}`).emit("leaveRoom", message);
};
