import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const port = 3000;
const app = express();
const server = createServer(app);
const corsOptions = {
  origin: "https://simple-chat-app-plum.vercel.app",
  credentials: true,
  methods: ["GET", "POST"],
};
const io = new Server(server, {
  cors: corsOptions,
});

// Middlewares
app.use(cors());
app.get("/", (req, res) => {
  res.send("This is our Backend of chat Application");
});

io.on("connection", (socket) => {
  console.log(`User connected with : ${socket.id}`);
  socket.on("message", ({ data, roomID }) => {
    io.to(roomID).emit("receive-message", data);
  });

  socket.on("room-details", (roomName) => {
    socket.join(roomName);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
