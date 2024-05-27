// Import the required modules
const express = require("express"); // Express framework for building web applications
const multer = require("multer"); // Multer for handling file uploads
const { v4: uuidv4 } = require("uuid"); // Module to generate unique identifiers
const WebSocket = require("ws"); // WebSocket library for real-time communication
const Blog = require("../functions/Blog"); // Blog class for managing blog posts

const router = express.Router(); // Create a new router instance
const blog = new Blog("./storage/blogPosts.json"); // Create a new Blog instance with the specified file path

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination based on the fieldname
    if (file.fieldname === "imageURL") {
      cb(null, "assets/faces/"); // Store face images in 'assets/faces/' directory
    } else if (file.fieldname === "backgroundimg") {
      cb(null, "assets"); // Store background images in 'assets' directory
    } else {
      cb(null, "assets"); // Default storage directory
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`; // Generate a unique filename
    cb(null, uniqueName); // Set the filename for the uploaded file
  },
});

const upload = multer({ storage: storage }); // Create a multer instance with the configured storage

// Handler function to get all posts
const getAllPosts = (req, res) => {
  blog.getAllPosts((err, posts) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    // Modify imageURL and backgroundimg for each post to use the correct API URL dynamically
    posts = posts.map((post) => {
      post.imageURL = req.protocol + "://" + req.get("host") + post.imageURL;
      post.backgroundimg =
        req.protocol + "://" + req.get("host") + post.backgroundimg;
      return post;
    });
    res.json(posts); // Send the modified posts as JSON response
  });
};

// Handler function to get a post by its token
const getPostByToken = (req, res) => {
  const token = req.params.token; // Get the token from request parameters
  blog.getPostByToken(token, (err, post) => {
    if (err) {
      console.error(err);
      return res.status(404).send("Post not found");
    }
    // Modify the imageURL and backgroundimg to use the correct API URL dynamically
    post.imageURL = req.protocol + "://" + req.get("host") + post.imageURL;
    post.backgroundimg =
      req.protocol + "://" + req.get("host") + post.backgroundimg;
    res.json(post); // Send the post as JSON response
  });
};

// Handler function to create a new post
const createPost = (req, res) => {
  upload.fields([
    { name: "imageURL", maxCount: 1 },
    { name: "backgroundimg", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (!req.files || !req.files.imageURL || !req.files.backgroundimg) {
      return res.status(400).send("Both images are required");
    }

    // Prepare post data with the uploaded file paths
    const postData = {
      ...req.body,
      imageURL: req.files.imageURL
        ? `/assets/faces/${req.files.imageURL[0].filename}`
        : null,
      backgroundimg: req.files.backgroundimg
        ? `/assets/${req.files.backgroundimg[0].filename}`
        : null,
    };

    // Create the new post
    blog.createPost(postData, (err, createdPost) => {
      if (err) {
        console.error("Error creating post:", err);
        return res.status(500).send("Internal Server Error");
      }

      broadcastNewPost(createdPost); // Broadcast the new post to all WebSocket clients

      res.status(201).json(createdPost); // Send the created post as JSON response
    });
  });
};

// Handler function to update a post by its token
const updatePostByToken = (req, res) => {
  const token = req.params.token; // Get the token from request parameters
  const updatedPostData = req.body; // Get the updated post data from request body
  blog.updatePostByToken(token, updatedPostData, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.sendStatus(204); // Send 204 No Content status on successful update
  });
};

// Handler function to delete a post by its token
const deletePostByToken = (req, res) => {
  const token = req.params.token; // Get the token from request parameters
  blog.deletePostByToken(token, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.sendStatus(204); // Send 204 No Content status on successful deletion
  });
};

// WebSocket server setup
const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws) => {
  console.log("Client connected"); // Log when a client connects
});

// Function to broadcast new posts to all connected WebSocket clients
function broadcastNewPost(post) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "new_post", post })); // Send new post data to the client
    }
  });
}

// Define routes
router.route("/").get(getAllPosts).post(createPost); // Route for getting all posts and creating a new post

router
  .route("/:token")
  .get(getPostByToken) // Route for getting a post by token
  .put(updatePostByToken) // Route for updating a post by token
  .delete(deletePostByToken); // Route for deleting a post by token

// Export the router and WebSocket server
module.exports = { router, wss };
