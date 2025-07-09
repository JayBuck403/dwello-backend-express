const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const verifyToken = require("../../firebase_services/authMiddleware");

// User Profile Routes
router.get("/user/profile", verifyToken, userControllers.getUserProfile);
router.put("/user/profile", verifyToken, userControllers.updateUserProfile);

// Saved Properties Routes
router.get("/user/saved-properties", verifyToken, userControllers.getSavedProperties);
router.post("/user/saved-properties", verifyToken, userControllers.saveProperty);
router.delete("/user/saved-properties/:property_id", verifyToken, userControllers.removeSavedProperty);

// User Activity Routes
router.get("/user/activity", verifyToken, userControllers.getUserActivity);
router.post("/user/activity", verifyToken, userControllers.recordActivity);

// User Alerts Routes
router.get("/user/alerts", verifyToken, userControllers.getUserAlerts);
router.post("/user/alerts", verifyToken, userControllers.createAlert);
router.put("/user/alerts/:id", verifyToken, userControllers.updateAlert);
router.delete("/user/alerts/:id", verifyToken, userControllers.deleteAlert);

module.exports = router; 