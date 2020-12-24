const User = require("../models/user");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");

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
    if (req.body.message) {
      req.body.sendBy = req.params.id;
      await Message.create(req.body);
      res.send({ msg: "Message Send Successfully!!" });
    }
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
          $expr: {
            $or: [{ sendBy: req.params.id }, { receiveBy: req.params.id }],
          },
        },
      },
      { $project: { _id: 0, text: 1, sendBy: 1, receiveBy: 1, createdAt: 1 } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: req.params.id,
          text: { $first: "$text" },
          sendBy: { $first: "$sendBy" },
          receiveBy: { $first: "$receiveBy" },
          createdAt: { $first: "$createdAt" },
        },
      },
    ]);

    const message = await Message.populate(rawMessages, { path: "sendBy" });

    res.send({ msg: message });
  } catch (error) {
    res.send({ error: "nothing" });
  }
};
