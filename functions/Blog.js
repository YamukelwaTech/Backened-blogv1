const fs = require("fs");

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

  getPostById(id, callback) {
    this.readPostsFromFile((err, posts) => {
      if (err) {
        callback(err);
        return;
      }
      const post = posts.find((post) => post.id === id);
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
      const newId = posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1; 
      post.id = newId;
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
