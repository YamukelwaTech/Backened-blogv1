// Import required modules
const express = require("express"); // Importing Express.js framework
const cors = require("cors"); // Importing CORS middleware
// const path = require("path"); 
const http = require("http"); // Importing Node.js HTTP module for creating HTTP server
const { router: postsRoutes, wss } = require("./routes/routes"); // Importing router and WebSocket instance from custom routes module

// Define the port number to listen on, default to 5000 if not provided by the environment
const PORT = process.env.PORT || 5000;

// Initialize Express application
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing for all routes

// Serve static files from the 'assets' directory
app.use("/assets", express.static("assets"));

// Use the defined routes for handling requests starting with '/posts'
app.use("/posts", postsRoutes);

// WebSocket upgrade handling
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Start the server, listening on the specified port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
