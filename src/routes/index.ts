import express from "express";
import swaggerUi from "swagger-ui-express";

import authRouter from "./auth";
import roomRouter from "./rooms";
import chatRouter from "./chats";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.use("/users", authRouter);
router.use("/rooms", authenticateToken, roomRouter);
router.use("/chats", authenticateToken, chatRouter);

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.yaml",
    },
  })
);

export default router;
