import jwt from "jsonwebtoken";

import { RequestUser } from "../types/requestUser";

export const generateAccessToken = (data: RequestUser) => {
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1 day",
  });

  return token;
};
