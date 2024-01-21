import express, { Request, Response } from "express";

import { RoomController } from "../controllers/rooms";
import { createRoomValidation } from "../utils/validation";

const roomRouter = express.Router();
const controller = new RoomController();

roomRouter.post("/", async (req: Request, res: Response) => {
  const { error, value: body } = createRoomValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const response = await controller.createRoom(body, req);
    return res.send(response);
  } catch (err: any) {
    return res.status(403).send(err.toString());
  }
});

roomRouter.get("/", async (req: Request, res: Response) => {
  try {
    const response = await controller.getRooms();
    return res.send(response);
  } catch (err: any) {
    return res.status(403).send(err.toString());
  }
});

export default roomRouter;
