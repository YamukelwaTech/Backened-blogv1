class Post {
  constructor(token, title, description, content, author, imageURL, backgroundimg, comments = []) {
    this.token = token;
    this.title = title;
    this.description = description;
    this.content = content;
    this.author = author;
    this.imageURL = imageURL;
    this.backgroundimg = backgroundimg;
    this.comments = comments;
  }
}

module.exports = Post;

