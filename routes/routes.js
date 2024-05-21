const express = require("express");
const router = express.Router();
const Blog = require("../functions/Blog");

const blog = new Blog("./storage/blogPosts.json");

// Handler functions
const getAllPosts = (req, res) => {
  blog.getAllPosts((err, posts) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.json(posts);
  });
};

const getPostByToken = (req, res) => {
  const token = req.params.token;
  blog.getPostByToken(token, (err, post) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Post not found");
    }
    res.json(post);
  });
};

const createPost = (req, res) => {
  const postData = req.body;
  blog.createPost(postData, (err, createdPost) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    res.status(201).json(createdPost);
  });
};

const updatePostByToken = (req, res) => {
  const token = req.params.token;
  const updatedPostData = req.body;
  blog.updatePostByToken(token, updatedPostData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.sendStatus(204);
  });
};

const deletePostByToken = (req, res) => {
  const token = req.params.token;
  blog.deletePostByToken(token, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.sendStatus(204);
  });
};

// Route definitions
router.route("/")
  .get(getAllPosts)
  .post(createPost);

router.route("/:token")
  .get(getPostByToken)
  .put(updatePostByToken)
  .delete(deletePostByToken);

module.exports = router;
