const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

// Import routes
const postsRoutes = require("./routes/routes");

// Use routes
app.use("/posts", postsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
