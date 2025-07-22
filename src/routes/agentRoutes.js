const express = require("express");
const router = express.Router();
const agentControllers = require("../controllers/agentControllers");
const verifyToken = require("../../firebase_services/authMiddleware");
// Assume you have an admin middleware
const verifyAdmin = require("../../firebase_services/adminAuthMiddleware");

// GET all agents (publicly accessible)
router.get("/agents", agentControllers.getAllAgents);

// POST a new agent profile (requires authentication)
router.post("/agents", verifyToken, agentControllers.createAgent);

// GET agent profile by Firebase UID (requires authentication)
router.get("/agents/me", verifyToken, agentControllers.getAgentByFirebaseUid);

// PUT update the logged-in agent's profile (requires authentication)
router.put("/agents/me", verifyToken, agentControllers.updateAgent);

// Admin: Approve or reject pending agent profile edits
router.post("/agents/:id/approve-edits", verifyAdmin, agentControllers.approveAgentEdits);
router.post("/agents/:id/reject-edits", verifyAdmin, agentControllers.rejectAgentEdits);

// GET agent profile by slug (publicly accessible)
// This route must come AFTER /agents/me to avoid conflicts
router.get("/agents/:slug", agentControllers.getAgentBySlug);

// Add other agent-related routes as needed (e.g., update agent profile)

module.exports = router;
