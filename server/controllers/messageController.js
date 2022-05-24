const Messages = require("../models/messageModel");
const { deleteImageFunction } = require("./imageController");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const { page = 0, size = 10, numberOfNewMessager = 0 } = req.query;
    const skip = parseInt(page) * parseInt(size) + parseInt(numberOfNewMessager);
    console.log('page', page, 'size', size, 'numberOfNewMessager', skip);
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ createdAt: -1 }).skip(skip).limit(size);
    console.log('messages', messages);
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        images: msg.message.images,
        id: msg._id,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, images=[] } = req.body;
    const data = await Messages.create({
      message: { text: message, images: images  },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json(data);
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllImageInChat = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: -1 });
    const images = [];
    messages.forEach(message => {
      if (message?.message?.images && message?.message?.images.length > 0) {
        images.push(...message.message.images);
      }
    });
    return res.json(images);
  } catch (ex) {
    next(ex);
  }
};


module.exports.deleteMessage = async (req, res, next) => {
  try {
    const id = req.params?.id;
    const msg = await Messages.findOne({
      _id: id
    });
    if (msg) {
      if (msg.message.images) {
        await deleteImageFunction(msg.message.images);
      }
      const deletedMsg = await Messages.findByIdAndUpdate(
        id,
        {
          message: { text: "", images: [] },
        },
        { new: true }
      );
      return res.json(deletedMsg);
    } else {
      return res.json({ status: true, msg: 'no message found' });
    }
  } catch (ex) {
    next(ex);
  }
};