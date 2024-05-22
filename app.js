const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http"); // Import http module
const { router: postsRoutes, wss } = require("./routes/routes"); // Import router and WebSocket server

const PORT = process.env.PORT || 5000;
const app = express();

// Create HTTP server
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

// Serve static files
app.use("/assets", express.static("assets"));

// Use routes
app.use("/posts", postsRoutes);

// Integrate WebSocket server with HTTP server
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
