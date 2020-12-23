const User = require("../models/user");
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
    if (req.query.message) {
      await User.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            messages: {
              $each: [
                {
                  text: req.body.text,
                  senderId: req.body.senderId,
                  time: new Date(),
                },
              ],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await User.findByIdAndUpdate(
        req.body.senderId,
        {
          $push: {
            messages: {
              $each: [
                {
                  text: req.body.text,
                  receiver: req.params.id,
                  time: new Date(),
                },
              ],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      res.send({ msg: "Message Send Successfully!!" });
    }
  } catch (error) {
    res.send({ error: error });
  }
};

// to getting all messages of specific user
exports.getAllMessagesOfUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.send({ msg: user.messages });
  } catch (error) {
    res.send({ error: error });
  }
};
