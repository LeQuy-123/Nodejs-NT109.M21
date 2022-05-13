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
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./controllers/userController');

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

  socket.on('join', ({userId, username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name: username, room }); // add user with socket id and room info
    if (error) return callback(error);
    if(onlineRooms.has(room)){
      onlineRooms.get(room).push(username);
    } else {
      onlineRooms.set(room, [...onlineRooms.get(room), userId]);
    }
    console.log("🚀 ~ file: index.js ~ line 91 ~ socket.on ~ onlineRooms", onlineRooms)

    socket.join(user.room);
    socket.emit('message', {
      user: 'adminX',
      text: `${user.name.toUpperCase()}, Welcome to ${user.room} room.`
    });
    socket.broadcast.to(user.room).emit('message', {
      user: 'adminX',
      text: `${user.name.toUpperCase()} has joined!`
    });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room) // get user data based on user's room
    });
    callback();
  });
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', {
        user: 'adminX',
        text: `${user.name.toUpperCase()} has left.`
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
  socket.on('sendMessageRoom', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message-room-recieve', { user: user.name, text: message });
    callback();
  });
});
