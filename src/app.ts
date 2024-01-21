import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

import router from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/", router);

if (process.env.NODE_ENV !== "test") {
  console.log("Connecting to DB...");
  mongoose.connect(process.env.DB_CONNECT).then(() => {
    console.log("DB Connected!!");
  });
}

export default app;
