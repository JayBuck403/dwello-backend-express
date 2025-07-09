const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const propertyRoutes = require("./src/routes/propertyRoutes");
const agentRoutes = require("./src/routes/agentRoutes");
const amenityRoutes = require("./src/routes/amenityRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");

dotenv.config(); // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
});

app.set("io", io);

const port = process.env.PORT || 8000; // Use port from .env or default to 8000

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Dwello Backend (Express) is running!");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/properties", propertyRoutes);
app.use("/api", agentRoutes);
app.use("/api", amenityRoutes);
app.use("/api", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`CORS origin: ${process.env.CORS_ORIGIN || "http://localhost:3000"}`);
});
