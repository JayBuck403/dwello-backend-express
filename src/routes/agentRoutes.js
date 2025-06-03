const express = require("express");
const router = express.Router();
const agentControllers = require("../controllers/agentControllers");
const verifyToken = require("../../firebase_services/authMiddleware");

// GET all agents (publicly accessible)
router.get("/agents", agentControllers.getAllAgents);

// POST a new agent profile (requires authentication)
router.post("/agents", verifyToken, agentControllers.createAgent);

// GET agent profile by Firebase UID (requires authentication to ensure users can only access their own profile or if you have admin roles)
router.get("/agents/me", verifyToken, agentControllers.getAgentByFirebaseUid);

// GET agent profile by agent ID (publicly accessible if you want agent profiles visible)
router.get("/agents/:id", agentControllers.getAgentById);

// GET agent profile by agent ID (publicly accessible if you want agent profiles visible)
router.get("/agents/:slug", agentControllers.getAgentBySlug);

// PUT /api/agents/me - Update the logged-in agent's profile (requires authentication)
router.put("/agents/me", verifyToken, agentControllers.updateAgent);

// Add other agent-related routes as needed (e.g., update agent profile)

module.exports = router;
