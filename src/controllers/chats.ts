import {
  Tags,
  Example,
  Post,
  Route,
  Body,
  Get,
  Security,
  Query,
  Path,
  Request,
} from "tsoa";
import express from "express";

import Chats, {
  ChatType,
  CreateChatPayload,
  CreateChatResponse,
  GetPersonalMessagesResponse,
  GetRoomMessagesResponse,
} from "../model/chats";
import {
  createChatResponseExample,
  getPersonalMessagesResponseExample,
  getRoomMessagesResponseExample,
} from "./examples/chats";
import { RequestUser } from "../types/requestUser";
import Rooms from "../model/rooms";
import Users from "../model/users";

@Tags("Chats")
@Security("bearerAuth")
@Route("/chats")
export class ChatController {
  /**
   * chatType will be 'Room Chat'
   *
   * @summary Send new message within room with the following attribute: chatType, message etc..
   */

  @Example<CreateChatResponse>(createChatResponseExample)
  @Post("/rooms/:roomId")
  public async sendMessageToRoom(
    @Body() requestBody: CreateChatPayload,
    @Path() roomId: number,
    @Request() req: express.Request
  ): Promise<CreateChatResponse> {
    return sendMessageToRoom(requestBody, roomId, req.user as RequestUser);
  }

  /**
   * @summary Get all messages within room.
   */

  @Example<GetRoomMessagesResponse>(getRoomMessagesResponseExample)
  @Get("/rooms/:roomId")
  public async getRoomMessages(
    @Path() roomId: number
  ): Promise<GetRoomMessagesResponse> {
    return getRoomMessages(roomId);
  }

  /**
   * chatType will be 'Personal Chat'
   *
   * @summary Send new message to user within room with the following attribute: chatType, message etc..
   */

  @Example<CreateChatResponse>(createChatResponseExample)
  @Post("/rooms/:roomId/users/:userId")
  public async sendMessageToUser(
    @Body() requestBody: CreateChatPayload,
    @Path() roomId: number,
    @Path() userId: number,
    @Request() req: express.Request
  ): Promise<CreateChatResponse> {
    return sendMessageToUser(
      requestBody,
      roomId,
      userId,
      req.user as RequestUser
    );
  }

  /**
   * @summary Get all messages with user within room.
   */

  @Example<GetPersonalMessagesResponse[]>(getPersonalMessagesResponseExample)
  @Get("/rooms/:roomId/users/:userId")
  public async getPersonalMessages(
    @Path() roomId: number,
    @Path() userId: number,
    @Request() req: express.Request
  ): Promise<GetPersonalMessagesResponse[]> {
    return getPersonalMessages(roomId, userId, req.user as RequestUser);
  }
}

const sendMessageToRoom = async (
  data: CreateChatPayload,
  roomId: number,
  { userObjectId }: RequestUser
): Promise<CreateChatResponse> => {
  const { chatType, message } = data;

  const room = await Rooms.findOne({ roomId });
  if (!room) throw new Error("Room doesn't exist");

  const roomMember = await Rooms.findOne({
    roomId,
    membersId: { $in: userObjectId },
  });
  if (!roomMember) throw new Error("You are not a member of this room");

  const roomChatsAvailable = await Chats.findOne({ roomId: room._id });

  if (!roomChatsAvailable) {
    const createChat = new Chats({
      chatType,
      roomId: room._id,
      messages: {
        body: message,
        sender: userObjectId,
      },
    });
    await createChat.save();
  } else {
    await Chats.findOneAndUpdate(
      { roomId: room._id },
      {
        $push: {
          messages: {
            body: message,
            sender: userObjectId,
          },
        },
      }
    );
  }

  return {
    message: "Message send successfully",
  };
};

const getRoomMessages = async (
  roomId: number
): Promise<GetRoomMessagesResponse> => {
  const room = await Rooms.findOne({ roomId }).populate("adminId");
  if (!room) throw new Error("Room doesn't exist.");

  const chat = await Chats.findOne({
    roomId: room._id,
    chatType: ChatType.RoomChat,
  })
    .select("messages")
    .populate("messages.sender");

  const messages = chat?.messages ?? [];

  return {
    title: room.title,
    description: room.description,
    roomAdmin: (room.adminId as any).name,
    roomId: room.roomId,
    messages: messages?.map((message) => ({
      body: message.body,
      senderName: (message.sender as any).name,
      createdAt: message.createdAt,
    })),
  };
};

const sendMessageToUser = async (
  data: CreateChatPayload,
  roomId: number,
  userId: number,
  { userObjectId }: RequestUser
): Promise<CreateChatResponse> => {
  const { chatType, message } = data;

  const room = await Rooms.findOne({ roomId });
  if (!room) throw new Error("Room doesn't exist");

  const receiver = await Users.findOne({ userId });
  if (!receiver) throw new Error("Receiver doesn't exist");

  const roomMembers = await Rooms.findOne({
    roomId,
    membersId: { $all: [userObjectId, receiver._id] },
  });
  if (!roomMembers)
    throw new Error("You and receiver both should be member of this room");

  if (String(receiver._id) === String(userObjectId))
    throw new Error("You can't send message to yourself");

  const chatAvailable = await Chats.findOne({
    roomId: room._id,
    personalCommunicatorsId: { $all: [userObjectId, receiver._id] },
  });

  if (!chatAvailable) {
    const createChat = new Chats({
      chatType,
      roomId: room._id,
      personalCommunicatorsId: [userObjectId, receiver._id],
      messages: {
        body: message,
        sender: userObjectId,
      },
    });
    await createChat.save();
  } else {
    await Chats.findOneAndUpdate(
      {
        roomId: room._id,
        personalCommunicatorsId: { $all: [userObjectId, receiver._id] },
      },
      {
        $push: {
          messages: {
            body: message,
            sender: userObjectId,
          },
        },
      }
    );
  }

  return {
    message: "Message send successfully",
  };
};

const getPersonalMessages = async (
  roomId: number,
  userId: number,
  { userObjectId }: RequestUser
): Promise<GetPersonalMessagesResponse[]> => {
  const room = await Rooms.findOne({ roomId });
  if (!room) throw new Error("Room doesn't exist.");

  const user = await Users.findOne({ userId });
  if (!user) throw new Error("User doesn't exist.");

  if (String(user._id) === String(userObjectId))
    throw new Error("Please provide user id");

  const roomMembers = await Rooms.findOne({
    roomId,
    membersId: { $all: [user._id, userObjectId] },
  });
  if (!roomMembers) throw new Error("Both should be a member of the same room");

  const chat = await Chats.findOne({
    roomId: room._id,
    chatType: ChatType.PersonalChat,
    personalCommunicatorsId: { $in: [user._id, userObjectId] },
  })
    .select("messages")
    .populate("messages.sender");

  const messages = chat?.messages ?? [];

  return messages?.map((message) => ({
    body: message.body,
    senderName: (message.sender as any).name,
    createdAt: message.createdAt,
  }));
};
