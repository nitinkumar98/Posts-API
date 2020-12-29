const Post = require("../models/post");
const Comment = require("../models/comment");
const client = require("../services/redis");

// for creating the new post
exports.createNewPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.send({ msg: "Post created" });
  } catch (error) {
    res.send({ error: error });
  }
};

// for finding all posts
exports.findAllPosts = async (req, res) => {
  try {
    const allPost = await Post.find({});
    res.send({ posts: allPost });
  } catch (error) {
    res.send({ error: error });
  }
};

// for finding the post by id
exports.findPostById = async (req, res) => {
  try {
    const postCache = await client.getAsync(req.params.id);
    if (!postCache) {
      const post = await Post.findById(req.params.id);
      await client.setAsync(req.params.id, JSON.stringify(post));
      client.expire(req.params.id, 300);
      res.send({ post });
    } else {
      res.send({ post: JSON.parse(postCache) });
    }
    // client.del(req.params.id);
  } catch (error) {
    res.send({ error: error });
  }
};

// for deleting the post by id
exports.deletePostById = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.id);
    res.send({ msg: "Deleted Successfully" });
  } catch (error) {
    res.send({ error: error });
  }
};

// for updating the post by id
exports.updatePostById = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, req.body);
    res.send({ msg: "Updated Successfully" });
  } catch (error) {
    res.send({ error: error });
  }
};

// to commenting on posts
exports.toCommentOnPost = async (req, res) => {
  try {
    req.body.onPost = req.params.id;
    const cacheComments = await client.getAsync(req.params.id + "comment");
    //res.send(JSON.parse(cacheComments));
    const newComment = await Comment.create(req.body);
    const comment = newComment + cacheComments;
    await client.setAsync(req.params.id + "commit", JSON.stringify(comment));
    res.send({ msg: "Comments added successfully to the post" });
  } catch (error) {
    res.send({ error: error });
  }
};

// to like the post
exports.toLikeThePost = async (req, res) => {
  try {
    if (req.body.like) {
      const userId = req.body.userId;
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $inc: { likes: 1 },
          $push: {
            likes_by: {
              $each: [
                {
                  userId,
                },
              ],
              $position: 0,
            },
          },
        },
        { new: true }
      );
      await client.setAsync(req.params.id, JSON.stringify(post));
      client.expire(req.params.id, 300);
      res.send({ msg: "Someone liked the post" });
    }
  } catch (error) {
    res.send({ error: error });
  }
};

//for getting all comments of the specific post
exports.getAllCommentsOfPost = async (req, res) => {
  try {
    const cacheComments = await client.getAsync(req.params.id + "comment");
    if (!cacheComments) {
      const postComments = await Comment.find({
        onPost: req.params.id,
      }).populate("commentedBy");
      await client.setAsync(
        req.params.id + "comment",
        JSON.stringify(postComments)
      );
      client.expire(req.params.id + "comment", 300);
      res.send({ comments: postComments });
    } else {
      res.send({ comments: JSON.parse(cacheComments) });
    }
  } catch (error) {
    res.send({ error: error });
  }
};
