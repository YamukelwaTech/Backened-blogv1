const express = require("express");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

// Serve static files
app.use("/assets", express.static("assets"));

// Import routes
const postsRoutes = require("./routes/routes");

// Use multer middleware
// app.use(upload.any());

// Use routes
app.use("/posts", postsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
