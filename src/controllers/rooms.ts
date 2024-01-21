import { Tags, Example, Post, Route, Body, Get, Security, Request } from "tsoa";
import express from "express";

import Rooms, {
  PostRoomPayload,
  PostRoomResponse,
  GetRoomResponse,
  RoomStatus,
} from "../model/rooms";
import {
  postRoomResponseExample,
  getRoomsResponseExample,
} from "./examples/rooms";
import { RequestUser } from "../types/requestUser";
import Users from "../model/users";

@Tags("Rooms")
@Security("bearerAuth")
@Route("/rooms")
export class RoomController {
  /**
   * @summary Create new room with the following attribute: title, description.
   */

  @Example<PostRoomResponse>(postRoomResponseExample)
  @Post("/")
  public async createRoom(
    @Body() requestBody: PostRoomPayload,
    @Request() req: express.Request
  ): Promise<PostRoomResponse> {
    return createRoom(requestBody, req.user as RequestUser);
  }

  /**
   * @summary Get all rooms.
   */

  @Example<GetRoomResponse[]>(getRoomsResponseExample)
  @Get("/")
  public async getRooms(): Promise<GetRoomResponse[]> {
    return getRooms();
  }
}

const createRoom = async (
  data: PostRoomPayload,
  { userObjectId }: RequestUser
): Promise<PostRoomResponse> => {
  const { title, description } = data;

  const room = new Rooms({
    title,
    description,
    adminId: userObjectId,
    membersId: userObjectId,
  });

  const savedRoom = await room.save();

  await Users.findByIdAndUpdate(userObjectId, {
    $push: {
      roomsId: savedRoom._id,
    },
  });

  return {
    message: "Room created successfully",
  };
};

const getRooms = async (): Promise<GetRoomResponse[]> => {
  const rooms = await Rooms.find({ status: RoomStatus.Active }).populate(
    "adminId"
  );

  return rooms.map((room) => ({
    title: room.title,
    description: room.description,
    roomId: room.roomId,
    adminName: (room.adminId as any).name,
  }));
};
