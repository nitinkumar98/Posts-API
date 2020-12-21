const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = 8080;
const url = "mongodb://localhost/posts";
const Post = require("./models/post");
const Comment = require("./models/comment");
const User = require("./models/user");
const { isTokenValid, getRequestInfo } = require("./middleware/index");

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((error) => {
    res.send({ error: error });
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root route '/'
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Route to create Post '/posts'
app.post("/posts", [getRequestInfo, isTokenValid], async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.send({ msg: "Post created" });
  } catch (error) {
    res.send({ error: error });
  }
});

// Route to find all Posts '/posts'
app.get("/posts", isTokenValid, async (req, res) => {
  try {
    const allPost = await Post.find({});
    res.send({ posts: allPost });
  } catch (error) {
    res.send({ error: error });
  }
});

// Route to find particular Post '/posts/:id'
app.get("/posts/:id", isTokenValid, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send({ msg: post });
  } catch (error) {
    res.send({ error: error });
  }
});

// Route to delete Post '/posts/:id'
app.delete("/posts/:id", isTokenValid, async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.send({ msg: "Deleted Successfully" });
  } catch (error) {
    res.send({ error: error });
  }
});

// Route to update Post '/posts/:id'
app.put("/posts/:id", isTokenValid, async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, req.body);
    res.send({ msg: "Updated Successfully" });
  } catch (error) {
    res.send({ error: error });
  }
});

// Route to create comments on Post '/posts/:id/comments'
app.post("/posts/:id/comments", isTokenValid, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await Comment.create(req.body);
    comment.save();
    post.comments.push(comment);
    post.save();
    res.send({ msg: "Comments added successfully to the post" });
  } catch (error) {
    res.send({ error: error });
  }
});

// Route to likes the Post '/posts/:id/?likes=true'
app.patch("/posts/:id", isTokenValid, async (req, res) => {
  try {
    if (req.query.likes) {
      const user = await User.findById(req.body.userId);

      await Post.findByIdAndUpdate(req.params.id, {
        $inc: { likes: 1 },
        $push: {
          likes_by: {
            $each: [
              {
                name: user.name,
              },
            ],
            $position: 0,
          },
        },
      });
      res.send({ msg: `${user.name} liked this post` });
    }
  } catch (error) {
    res.send({ error: error });
  }
});

/// ==== Messages Routes === ///

// Route to create the users '/users'
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
    res.send({ token: token });
  } catch (error) {
    res.send({ error: error });
  }
});

// Route to find all the users '/users'
app.get("/users", isTokenValid, async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ users: users });
  } catch (error) {
    res.send({ error: error });
  }
});

// Route to send message to different user '/users/:id/?message=true'
app.patch("/users/:id", isTokenValid, async (req, res) => {
  try {
    if (req.query.message) {
      const receiverUser = await User.findById(req.params.id);
      const senderUser = await User.findById(req.body.senderId);
      await User.findByIdAndUpdate(req.params.id, {
        $push: {
          messages: {
            $each: [
              {
                text: req.body.text,
                sender: senderUser.name,
                time: new Date(),
              },
            ],
            $position: 0,
          },
        },
      });
      await User.findByIdAndUpdate(req.body.senderId, {
        $push: {
          messages: {
            $each: [
              {
                text: req.body.text,
                receiver: receiverUser.name,
                time: new Date(),
              },
            ],
            $position: 0,
          },
        },
      });

      res.send({ msg: "Message Send Successfully!!" });
    }
  } catch (error) {
    res.send({ error: error });
  }
});

// Route to find all the messages of a users '/users/:id/messages'
app.get("/users/:id/messages", isTokenValid, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.send({ msg: user.messages });
  } catch (error) {
    res.send({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
