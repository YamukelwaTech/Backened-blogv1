const express = require("express");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

// Serve static files (images) from the "public" directory
app.use('/assets', express.static(path.join(__dirname, './assets')));

// Import routes
const postsRoutes = require("./routes/routes");

// Use routes
app.use("/posts", postsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
