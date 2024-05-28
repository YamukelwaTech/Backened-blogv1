const express = require("express");
const cors = require("cors");
const http = require("http");
const { router: postsRoutes} = require("./routes/routes");
const sslRedirect = require('express-sslify');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

// Trust the X-Forwarded-Proto header (required for Heroku)
app.set('trust proxy', true);

// Middleware setup
app.use(express.json());
app.use(cors());
app.use("/assets", express.static("assets"));
app.use("/posts", postsRoutes);

// Redirect HTTP to HTTPS
app.use(sslRedirect.HTTPS({ trustProtoHeader: true }));

// // WebSocket upgrade handling
// server.on("upgrade", (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit("connection", ws, request);
//   });
// });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
