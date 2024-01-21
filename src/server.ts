import { createServer } from "http";

import app from "./app";
import { io } from "./socket";

const httpServer = createServer(app);

io.attach(httpServer, {
  cors: {
    origin: ["http://localhost:3000/"],
  },
});

const PORT = 8080;

httpServer.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
