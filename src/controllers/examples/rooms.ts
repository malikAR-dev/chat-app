import { PostRoomResponse, GetRoomResponse } from "../../model/rooms";

export const postRoomResponseExample: PostRoomResponse = {
  message: "Room created successfully",
};

export const getRoomResponseExample: GetRoomResponse = {
  title: "Friends",
  description: "Get Together",
  roomId: 1,
  adminName: "Ali",
};

export const getRoomsResponseExample: GetRoomResponse[] = [
  getRoomResponseExample,
];
