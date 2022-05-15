const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/roomChat");

const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());
const {
  getUsersInRoom
} = require('./controllers/roomController');
const { getMessages } = require("./controllers/messageController");

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
app.use("/api/room", roomRoutes);
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
global.onlineRooms = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        to: data.to,
        msg: data.msg,
      });
    }
  });

  socket.on("user_is_typing", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("user_is_typing", data.from);
    }
  });
  socket.on("user_stop_typing", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("user_stop_typing", data.from);
    }
  });

  socket.on("user_seen", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("user_seen", data.from);
    }
  });

  socket.on('join-room', async ({user, room}) => {
    socket.join(room);
    socket.broadcast.to(room).emit('welcome-message', {
      user: 'admin',
      text: `${user.username} has joined!`,
      userJoin: user,

    });
  });


  socket.on('user-leave', async ({ user, room}) => {
    socket.broadcast.to(room).emit('user-leave', {
      user: 'admin',
      text: `${user.username} has left the room!`,
      userLeft: user,
    });
  });
  socket.on('send-message-room', ({ from, to, msg }) => {
    io.to(to).emit('message-room-recieve', { from, to, msg });
  });
});
