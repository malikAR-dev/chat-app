import express, { Request, Response } from "express";

import { ChatController } from "../controllers/chats";
import {
  createPersonalChatValidation,
  createRoomChatValidation,
  roomAndUserIdValidation,
  roomIdValidation,
} from "../utils/validation";

const chatRouter = express.Router();
const controller = new ChatController();

chatRouter.post("/rooms/:roomId", async (req: Request, res: Response) => {
  const { error, value: body } = createRoomChatValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { error: paramsError, value: params } = roomIdValidation(req.params);
  if (paramsError) return res.status(400).send(paramsError.details[0].message);

  try {
    const response = await controller.sendMessageToRoom(
      body,
      params.roomId,
      req
    );
    return res.send(response);
  } catch (err: any) {
    return res.status(403).send(err.toString());
  }
});

chatRouter.get("/rooms/:roomId", async (req: Request, res: Response) => {
  const { error: paramsError, value: params } = roomIdValidation(req.params);
  if (paramsError) return res.status(400).send(paramsError.details[0].message);

  try {
    const response = await controller.getRoomMessages(params.roomId);
    return res.send(response);
  } catch (err: any) {
    return res.status(403).send(err.toString());
  }
});

chatRouter.post(
  "/rooms/:roomId/users/:userId",
  async (req: Request, res: Response) => {
    const { error, value: body } = createPersonalChatValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { error: paramsError, value: params } = roomAndUserIdValidation(
      req.params
    );
    if (paramsError)
      return res.status(400).send(paramsError.details[0].message);

    try {
      const response = await controller.sendMessageToUser(
        body,
        params.roomId,
        params.userId,
        req
      );
      return res.send(response);
    } catch (err: any) {
      return res.status(403).send(err.toString());
    }
  }
);

chatRouter.get(
  "/rooms/:roomId/users/:userId",
  async (req: Request, res: Response) => {
    const { error: paramsError, value: params } = roomAndUserIdValidation(
      req.params
    );
    if (paramsError)
      return res.status(400).send(paramsError.details[0].message);

    try {
      const response = await controller.getPersonalMessages(
        params.roomId,
        params.userId,
        req
      );
      return res.send(response);
    } catch (err: any) {
      return res.status(403).send(err.toString());
    }
  }
);

export default chatRouter;
