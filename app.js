const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();
const Blog = require("./functions/Blog");

app.use(express.json());
app.use(cors());

const blog = new Blog("blogPosts.json");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Route to get all posts
app.get("/posts", (req, res) => {
  blog.getAllPosts((err, posts) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.json(posts);
  });
});

// Route to get a single post by ID
app.get("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  blog.getPostById(postId, (err, post) => {
    if (err) {
      console.error(err);
      res.status(404).send("Post not found");
      return;
    }
    res.json(post);
  });
});

// Route to create a new post
app.post("/posts", (req, res) => {
  const postData = req.body;
  blog.createPost(postData, (err, createdPost) => {
    if (err) {
      res
        .status(err.statusCode || 500)
        .send(err.message || "Internal Server Error");
      return;
    }
    res.json(createdPost);
  });
});

// Route to delete a post by ID
app.delete("/posts/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  blog.deletePostById(postId, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.sendStatus(204);
  });
});
