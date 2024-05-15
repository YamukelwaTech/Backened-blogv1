const fs = require("fs");
const Post = require("../functions/Post");

class Blog {
  constructor(filePath) {
    this.filePath = filePath;
  }

  readPostsFromFile(callback) {
    fs.readFile(this.filePath, "utf8", (err, data) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, JSON.parse(data));
    });
  }

  writePostsToFile(posts, callback) {
    fs.writeFile(this.filePath, JSON.stringify(posts), "utf8", (err) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null);
    });
  }

  getAllPosts(callback) {
    this.readPostsFromFile(callback);
  }

  getPostById(id, callback) {
    this.readPostsFromFile((err, posts) => {
      if (err) {
        callback(err);
        return;
      }
      const post = posts.find((post) => post.id === id);
      if (!post) {
        callback("Post not found", null);
        return;
      }
      callback(null, post);
    });
  }
  createPost(post, callback) {
    this.readPostsFromFile((err, posts) => {
      if (err) {
        callback(err);
        return;
      }
      const existingIds = posts.map((post) => post.id);
      let id = posts.length + 1;
      while (existingIds.includes(id)) {
        id++;
      }
      if (existingIds.includes(post.id)) {
        const error = new Error(
          "This ID already exists, please use another one."
        );
        error.statusCode = 400;
        return callback(error);
      }
      post.id = id;
      posts.push(post);
      this.writePostsToFile(posts, (err) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, post);
      });
    });
  }

  deletePostById(id, callback) {
    this.readPostsFromFile((err, posts) => {
      if (err) {
        callback(err);
        return;
      }
      const updatedPosts = posts.filter((post) => post.id !== id);
      this.writePostsToFile(updatedPosts, (err) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null);
      });
    });
  }
}

module.exports = Blog;
