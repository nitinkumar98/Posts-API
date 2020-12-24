const User = require("../models/user");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// for creating the new user
exports.createNewUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
    res.send({ token: token });
  } catch (error) {
    res.send({ error: error });
  }
};

// for finding all users
exports.findAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ users: users });
  } catch (error) {
    res.send({ error: error });
  }
};

// to sending the messages to users
exports.sendMessagesToUsers = async (req, res) => {
  try {
    req.body.sendBy = req.params.id;

    req.body.roomId = [req.params.id, req.body.receiveBy].sort().join("");
    await Message.create(req.body);
    res.send({ msg: "Message Send Successfully!!" });
  } catch (error) {
    res.send({ error: error });
  }
};

// to getting all messages of specific user
exports.getAllMessagesOfUser = async (req, res) => {
  try {
    const rawMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sendBy: mongoose.Types.ObjectId(req.params.id) },
            { receiveBy: mongoose.Types.ObjectId(req.params.id) },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          text: 1,
          sendBy: 1,
          receiveBy: 1,
          createdAt: 1,
          roomId: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$roomId",
          text: { $first: "$text" },
          sendBy: { $first: "$sendBy" },
          receiveBy: { $first: "$receiveBy" },
          createdAt: { $first: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.send({ msg: rawMessages });
  } catch (error) {
    res.send({ error: error });
  }
};
