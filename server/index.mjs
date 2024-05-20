import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
dotenv.config();

//declaration
const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 3001;
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//middleware
app.use(cors());

io.on("connect", (socket) => {
  socket.on("send-message", (data) => {
    socket.broadcast.emit("message-from-server", data);
  });

  socket.on("join-room", (data) => {
    socket.broadcast.emit("message-from-server", data);
  });

  socket.on("disconnect", (socket) => {
    console.log("User left");
  });
});

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
