import express, { Request, Response } from "express";

import { UserController } from "../controllers/auth";
import {
  createRoomValidation,
  createUserValidation,
  loginUserValidation,
  roomIdValidation,
} from "../utils/validation";
import { authenticateToken } from "../middlewares/authenticateToken";

const authRouter = express.Router();
const controller = new UserController();

authRouter.post("/register", async (req: Request, res: Response) => {
  const { error, value: body } = createUserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const response = await controller.createUser(body);
    return res.send(response);
  } catch (err: any) {
    return res.status(403).send(err.toString());
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { error, value: body } = loginUserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const response = await controller.loginUser(body);
    return res.send(response);
  } catch (err: any) {
    return res.status(403).send(err.toString());
  }
});

authRouter.post(
  "/join/room",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { error, value: body } = roomIdValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
      const response = await controller.joinRoom(body, req);
      return res.send(response);
    } catch (err: any) {
      return res.status(403).send(err.toString());
    }
  }
);

authRouter.get(
  "/join/room",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const response = await controller.getJoinedRooms(req);
      return res.send(response);
    } catch (err: any) {
      return res.status(403).send(err.toString());
    }
  }
);

export default authRouter;
