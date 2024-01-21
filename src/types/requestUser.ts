import { Schema } from "mongoose";

export interface RequestUser {
  name: string;
  email: string;
  userObjectId: Schema.Types.ObjectId;
}
