import mongoose, { Schema, Document } from "mongoose";

export interface IMessagesDocument extends Document {
  _id: Schema.Types.ObjectId;
  body: string;
  sender: Schema.Types.ObjectId;
  createdAt: Date;
}

export const MessagesSchema = new mongoose.Schema<IMessagesDocument>(
  {
    body: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);
