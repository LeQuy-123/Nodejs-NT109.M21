const Room = require("../models/roomModel");
const User = require("../models/userModel");
const { ObjectId } = require('mongodb');

const bcrypt = require("bcrypt");

module.exports.findOrCreateRoom = async (req, res, next) => {
  try {
    const { roomName, password, hostUser } = req.body;
    const roomNameCheck = await Room.findOne({ roomName });
    if (roomNameCheck) {
      const editRoom = await Room.findOneAndUpdate(
        roomName,
        {
          user: roomNameCheck.user.concat(hostUser),
        },
        { new: true }
      );
      return res.json({ status: true, editRoom });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const CurrentRoom = await Room.create({
        roomName: roomName,
        host: hostUser,
        password: hashedPassword,
        user: [hostUser],
      });
      return res.json({ status: true, CurrentRoom });
    }
    
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

module.exports.leaveRoom = async (req, res, next) => {
  try {
    const { roomName, hostUser } = req.body;
    const roomNameCheck = await Room.findOne({ roomName });
    if (roomNameCheck) {
      const filterUser = roomNameCheck.user.filter(user => user !== hostUser);
      if (filterUser.length === 0) {
        await Room.deleteOne({ roomName });
        return res.json({ status: true, msg: 'last user leaver so the room will be delete' });
      } else {
        const editRoom = await Room.findOneAndUpdate(
          roomName,
          {
            user: roomNameCheck.user.filter(function (item) {
              return item !== hostUser
            }),
          },
          { new: true }
        );
        return res.json({ status: true, editRoom });
      }
    } else {
      return res.json({ status: false, error: 'error room not found' });
    }

  } catch (ex) {
    console.log("🚀 ~ file: userController.js ~ line 57 ~ module.exports.findOrCreateRoom= ~ ex", ex)
    next(ex);
  }
};
//Array of users
const users = [];

module.exports.addUser = ({ userId, userName, roomName }) => {


  return {  };
};

module.exports.removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

module.exports.getUser = id => users.find(user => user.id === id);

module.exports.getUsersInRoom = async roomName => {
  try {
    const roomNameCheck = await Room.findOne({ roomName });
    console.log("🚀 ~ file: roomController.js ~ line 103 ~ roomNameCheck.user", roomNameCheck.user)
    const userList = await User.find({
      "_id": {
        "$in": roomNameCheck.user?.map((user) => ObjectId(user))
      }
    }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return userList;
  } catch (ex) {
    console.log("🚀 ~ file: userController.js ~ line 57 ~ module.exports.findOrCreateRoom= ~ ex", ex)
    next(ex);
  }
};

