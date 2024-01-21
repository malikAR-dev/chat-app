import { Body, Example, Post, Route, Tags, Request, Security, Get } from "tsoa";
import bcrypt from "bcrypt";
import express from "express";

import Users, {
  GetJoinedRoomsResponse,
  JoinRoomPayload,
  JoinRoomResponse,
  LoginUserPayload,
  LoginUserResponse,
  PostUserPayload,
  PostUserResponse,
} from "../model/users";
import {
  getJoinedRoomsResponseExample,
  joinRoomResponseExample,
  loginUserResponseExample,
  postUserResponseExample,
} from "./examples/auth";
import { generateAccessToken } from "../utils/generateAccessToken";
import { RequestUser } from "../types/requestUser";
import Rooms from "../model/rooms";
import Chats from "../model/chats";
import { joinRoomNotification } from "../socket";

@Tags("Users")
@Route("/users")
export class UserController {
  /**
   * @summary Create new user by providing: Name, email, password etc..
   */
  @Post("/register")
  @Example<PostUserResponse>(postUserResponseExample)
  public async createUser(
    @Body() requestBody: PostUserPayload
  ): Promise<PostUserResponse> {
    return createUser(requestBody);
  }

  /**
   * @summary Login user by providing: email and password.
   */
  @Post("/login")
  @Example<LoginUserResponse>(loginUserResponseExample)
  public async loginUser(
    @Body() requestBody: LoginUserPayload
  ): Promise<LoginUserResponse> {
    return loginUser(requestBody);
  }

  /**
   * @summary User can join the Room by providing roomId.
   */
  @Post("/join/room")
  @Security("bearerAuth")
  @Example<JoinRoomResponse>(joinRoomResponseExample)
  public async joinRoom(
    @Body() requestBody: JoinRoomPayload,
    @Request() req: express.Request
  ): Promise<JoinRoomResponse> {
    return joinRoom(requestBody, req.user as RequestUser);
  }

  /**
   * @summary User can get all the Joined Rooms.
   */
  @Get("/join/room")
  @Security("bearerAuth")
  @Example<GetJoinedRoomsResponse[]>(getJoinedRoomsResponseExample)
  public async getJoinedRooms(
    @Request() req: express.Request
  ): Promise<GetJoinedRoomsResponse[]> {
    return getJoinedRooms(req.user as RequestUser);
  }
}

const createUser = async (data: PostUserPayload): Promise<PostUserResponse> => {
  const { name, email, password, mobileNumber } = data;

  const hashPassword = await bcrypt.hash(password, 10);

  const user = new Users({
    name,
    email,
    password: hashPassword,
    mobileNumber,
  });

  await user.save();

  return {
    message: "User Registered Successfully",
  };
};

const loginUser = async (
  data: LoginUserPayload
): Promise<LoginUserResponse> => {
  const { email, password } = data;

  const user = await Users.findOne({ email });
  if (!user) throw new Error("User doesn't exist");

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) throw new Error("Entered password is wrong");

  const userInfo: RequestUser = {
    name: user.name,
    email: user.email,
    userObjectId: user._id,
  };

  const accessToken = generateAccessToken(userInfo);

  await Users.findOneAndUpdate(
    { email },
    {
      accessToken,
    }
  );

  return {
    message: "User LoggedIn Successfully",
    accessToken,
  };
};

const joinRoom = async (
  { roomId }: JoinRoomPayload,
  { userObjectId }: RequestUser
): Promise<JoinRoomResponse> => {
  let chat;
  const room = await Rooms.findOne({ roomId });
  if (!room) throw new Error("Room doesn't exist");

  const alreadyRoomMember = await Rooms.findOne({
    roomId,
    membersId: { $in: userObjectId },
  });
  if (alreadyRoomMember)
    throw new Error("You're already a member of this room");

  const user = await Users.findById({ _id: userObjectId });
  if (!user) throw new Error("User doesn't exist");

  const chatExist = await Chats.findOne({ roomId: room._id });

  if (chatExist) {
    chat = await Chats.findOne({ roomId: room._id })
      .select("messages")
      .populate("messages.sender");
  }

  const messages = chat?.messages.slice(-10);

  room.membersId.push(userObjectId);
  room.save();

  user.roomsId.push(room._id);
  user.save();

  joinRoomNotification(roomId, `${user.name} joined ${room.title} room`);

  return {
    message: "Room joined Successfully",
    messages: messages?.map((mess) => ({
      body: mess.body,
      createdAt: mess.createdAt,
      sender: {
        name: (mess.sender as any).name,
        id: (mess.sender as any).userId,
      },
    })),
  };
};

const getJoinedRooms = async ({
  userObjectId,
}: RequestUser): Promise<GetJoinedRoomsResponse[]> => {
  const rooms = await Rooms.find({ membersId: { $in: userObjectId } }).populate(
    "adminId"
  );

  return rooms.map((room) => ({
    title: room.title,
    description: room.description,
    roomId: room.roomId,
    adminName: (room.adminId as any).name,
  }));
};
