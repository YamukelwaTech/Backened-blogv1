const express = require("express");
const router = express.Router();
const Blog = require("../functions/Blog");

const blog = new Blog("./src/data/blogPosts.json");

// Route to get all posts
router.get("/", (req, res) => {
  blog.getAllPosts((err, posts) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(posts);
  });
});

// Route to get a single post by token
router.get("/:token", (req, res) => {
  const token = req.params.token;

  blog.getPostByToken(token, (err, post) => {
    if (err) {
      console.error(err);
      res.status(404).send("Post not found");
      return;
    }
    res.json(post);
  });
});

// Route to create a new post
router.post("/", (req, res) => {
  const postData = req.body;
  blog.createPost(postData, (err, createdPost) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(201).json(createdPost);
  });
});

// Route to update a post by token
router.put("/:token", (req, res) => {
  const token = req.params.token;
  const updatedPostData = req.body;

  blog.updatePostByToken(token, updatedPostData, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.sendStatus(204);
  });
});

// Route to delete a post by token
router.delete("/:token", (req, res) => {
  const token = req.params.token;

  blog.deletePostByToken(token, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.sendStatus(204);
  });
});

module.exports = router;
