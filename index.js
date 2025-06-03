const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const propertyRoutes = require("./src/routes/propertyRoutes");
const agentRoutes = require("./src/routes/agentRoutes");
const amenityRoutes = require("./src/routes/amenityRoutes");
const blogRoutes = require("./src/routes/blogRoutes");

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Dwello Backend (Express) is running!");
});

app.use("/api/properties", propertyRoutes);
app.use("/api", agentRoutes);
app.use("/api", amenityRoutes);
// app.use("/api", blogRoutes);

// const errorHandler = require("./middleware/errorHandler");
// app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
