import mongoose, { Document, Model, Schema, model } from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

import { IMessagesDocument, MessagesSchema } from "./messages";

export enum ChatType {
  RoomChat = "Room Chat",
  PersonalChat = "Personal Chat",
}

export interface CreateChatPayload {
  /**
   * @example "Room Chat"
   */
  chatType: ChatType;

  /**
   * @example "Hi!"
   */
  message: string;
}

export interface CreateChatResponse {
  message: string;
}

export interface GetRoomMessagesResponse {
  title: string;
  description: string;
  roomAdmin: string;
  roomId: number;
  messages: {
    body: string;
    senderName: string;
    createdAt: Date;
  }[];
}

export interface GetPersonalMessagesResponse {
  body: string;
  senderName: string;
  createdAt: Date;
}

interface IChatsDocument extends Document {
  _id: Schema.Types.ObjectId;
  chatType: ChatType;
  roomId: Schema.Types.ObjectId;
  personalCommunicatorsId: Schema.Types.ObjectId[];
  messages: IMessagesDocument[];
}

const ChatsSchema = new mongoose.Schema<IChatsDocument>(
  {
    chatType: {
      type: String,
      enum: ChatType,
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Rooms",
    },
    personalCommunicatorsId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    messages: [
      {
        type: MessagesSchema,
      },
    ],
  },
  { timestamps: true }
);

ChatsSchema.plugin(AutoIncrement, { inc_field: "chatId" });

const Chats: Model<IChatsDocument> = model<IChatsDocument>(
  "Chats",
  ChatsSchema
);

export default Chats;
