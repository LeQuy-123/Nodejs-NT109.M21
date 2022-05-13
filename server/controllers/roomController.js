const Room = require("../models/roomModel");

const bcrypt = require("bcrypt");

module.exports.findOrCreateRoom = async (req, res, next) => {
  try {
    const { roomName, password, hostUser } = req.body;
    const roomNameCheck = await Room.findOne({ roomName });
    if (roomNameCheck) return res.json({ msg: "Room name already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const Room = await Room.create({
      roomName,
      host: hostUser,
      password: hashedPassword,
      user: [],
    });
    return res.json({ status: true, Room });
  } catch (ex) {
    console.log("🚀 ~ file: userController.js ~ line 57 ~ module.exports.findOrCreateRoom= ~ ex", ex)
    next(ex);
  }
};

module.exports.getAllRooms = async (req, res, next) => {
  try {
    const users = await Room.find({ roomName: { $ne: req.params.roomName } }).select([
      "roomName",
      "password",
      "user",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

//Array of users
const users = [];

module.exports.addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    user => user.room === room && user.name === name
  );

  if (!name || !room) return { error: 'Username and room are required.' };
  if (existingUser) return { error: 'Username already exists.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
};

module.exports.removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

module.exports.getUser = id => users.find(user => user.id === id);

module.exports.getUsersInRoom = room => users.filter(user => user.room === room);

