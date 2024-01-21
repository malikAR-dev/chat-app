import mongoose, { Document, Model, Schema, model } from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

export interface PostUserPayload {
  /**
   * @example "Ali"
   */
  name: string;

  /**
   * @example "ali@gmail.com"
   */
  email: string;

  /**
   * @example "ali123"
   */
  password: string;

  /**
   * @example "03030621541"
   */
  mobileNumber: string;
}

export interface PostUserResponse {
  message: string;
}

export interface LoginUserPayload {
  /**
   * @example "ali@gmail.com"
   */
  email: string;

  /**
   * @example "ali123"
   */
  password: string;
}

export interface LoginUserResponse {
  message: string;
  accessToken: string;
}

export interface JoinRoomPayload {
  /**
   * @example 1
   */
  roomId: number;
}

export interface JoinRoomResponse {
  message: string;
  messages: {
    body: string;
    createdAt: Date;
    sender: {
      name: string;
      id: number;
    };
  }[];
}

export interface LeaveRoomResponse {
  message: string;
}

export interface GetJoinedRoomsResponse {
  title: string;
  description: string;
  adminName: string;
  roomId: number;
}

interface IUsersDocument extends Document, PostUserPayload {
  _id: Schema.Types.ObjectId;
  accessToken: string;
  roomsId: Schema.Types.ObjectId[];
}

const UsersSchema = new mongoose.Schema<IUsersDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
  },
  roomsId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Rooms",
    },
  ],
});

UsersSchema.plugin(AutoIncrement, { inc_field: "userId" });

const Users: Model<IUsersDocument> = model<IUsersDocument>(
  "Users",
  UsersSchema
);

export default Users;
