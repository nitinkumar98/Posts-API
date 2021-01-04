const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = 8080;
const url = "mongodb://localhost/posts";
const { isTokenValid, logRequestInfo } = require("./middleware/index");
const { findDataFromOmdbApi } = require("./routes/movies");
const {
  createNewUser,
  findAllUsers,
  sendMessagesToUsers,
  getAllMessagesOfUser,
} = require("./routes/users");
const {
  createNewPost,
  findAllPosts,
  findPostById,
  deletePostById,
  updatePostById,
  toCommentOnPost,
  toLikeThePost,
  getAllCommentsOfPost,
} = require("./routes/posts");

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch((error) => {
    console.log(error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/// ====  POST ROUTES ====  ///

// Route to create Post '/posts'
app.post("/posts", [logRequestInfo, isTokenValid], (req, res) => {
  createNewPost(req, res);
});

// Route to find all Posts '/posts'
app.get("/posts", isTokenValid, (req, res) => {
  findAllPosts(req, res);
});

// Route to find particular Post '/posts/:id'
app.get("/posts/:id", isTokenValid, (req, res) => {
  findPostById(req, res);
});

// Route to delete Post '/posts/:id'
app.delete("/posts/:id", isTokenValid, (req, res) => {
  deletePostById(req, res);
});

// Route to update Post '/posts/:id'
app.patch("/posts/:id", isTokenValid, (req, res) => {
  updatePostById(req, res);
});

// Route to create comments on Post '/posts/:id/comments'
app.post("/posts/:id/comments", isTokenValid, (req, res) => {
  toCommentOnPost(req, res);
});

app.get("/posts/:id/comments", isTokenValid, (req, res) => {
  getAllCommentsOfPost(req, res);
});

// Route to likes the Post '/posts/:id/likes'
app.post("/posts/:id/likes", isTokenValid, (req, res) => {
  toLikeThePost(req, res);
});

/// ==== Messages Routes === ///

// Route to create the users '/users'
app.post("/users", (req, res) => {
  createNewUser(req, res);
});

// Route to find all the users '/users'
app.get("/users", isTokenValid, (req, res) => {
  findAllUsers(req, res);
});

// Route to send message to different user '/users/:id/messages'
app.patch("/users/:id/messages", isTokenValid, (req, res) => {
  sendMessagesToUsers(req, res);
});

// Route to find all the messages of a users '/users/:id/messages'
app.get("/users/:id/messages", isTokenValid, (req, res) => {
  getAllMessagesOfUser(req, res);
});

// === Movies API routes === //
app.get("/omdb/api", (req, res) => {
  findDataFromOmdbApi(req, res);
});
//Listening Sever at port 8080
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
