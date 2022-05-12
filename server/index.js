const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log('new user connected', userId);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    console.log('message send', data);
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("🚀 ~ file: index.js ~ line 49 ~ socket.on ~ sendUserSocket", sendUserSocket);
    if (sendUserSocket) {
      console.log('message recive', data);
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
