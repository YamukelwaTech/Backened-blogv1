class Post {
  constructor(id, title, content, author, imageURL = null) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.imageURL = imageURL;
  }
}

module.exports = Post;
