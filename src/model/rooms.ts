import mongoose, { Document, Model, Schema, model } from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

export enum RoomStatus {
  Active = "Active",
  InActive = "InActive",
}

export interface PostRoomPayload {
  /**
   * @example "Friends"
   */
  title: string;

  /**
   * @example "Get Together"
   */
  description: string;
}

export interface PostRoomResponse {
  message: string;
}

export interface GetRoomResponse {
  title: string;
  description: string;
  roomId: number;
  adminName: string;
}

interface IRoomsDocument extends Document, PostRoomPayload {
  _id: Schema.Types.ObjectId;
  status: RoomStatus;
  roomId: number;
  adminId: Schema.Types.ObjectId;
  membersId: Schema.Types.ObjectId[];
  adminName: string;
}

const RoomsSchema = new mongoose.Schema<IRoomsDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: RoomStatus,
    default: RoomStatus.Active,
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  membersId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

RoomsSchema.plugin(AutoIncrement, { inc_field: "roomId" });

const Rooms: Model<IRoomsDocument> = model<IRoomsDocument>(
  "Rooms",
  RoomsSchema
);

export default Rooms;
