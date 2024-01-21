import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { RequestUser } from "../types/requestUser";
import Users from "../model/users";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).send("Token is not present");

  const data = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET
  ) as RequestUser;

  if (!data) return res.status(401).send("Token is Invalid");

  const user = await Users.findOne({ email: data.email });
  if (!user) return res.status(401).send("User doesn't exist");

  if (token !== user.accessToken)
    return res.status(401).send("Not the latest issued token");

  req.user = {
    name: user.name,
    email: user.email,
    userObjectId: user._id,
  };

  next();
};
