const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

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
    fs.writeFile(this.filePath, JSON.stringify(posts, null, 2), "utf8", (err) => {
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

  getPostByToken(token, callback) {
    this.readPostsFromFile((err, posts) => {
      if (err) {
        callback(err);
        return;
      }
      const post = posts.find((post) => post.token === token);
      if (!post) {
        callback(new Error("Post not found"), null);
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
      const token = uuidv4(); // Generate a unique token
      post.token = token;
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

  deletePostByToken(token, callback) {
    this.readPostsFromFile((err, posts) => {
      if (err) {
        callback(err);
        return;
      }
      const updatedPosts = posts.filter((post) => post.token !== token);
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
