const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { router: postsRoutes, wss } = require("./routes/routes");

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

// Ensure this part is correctly set up in your server code
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// Listen on the specified port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
