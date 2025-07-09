const express = require("express");
const router = express.Router();
const blogControllers = require("../controllers/blogControllers");
const verifyToken = require("../../firebase_services/authMiddleware");

// Publicly accessible routes
router.get("/blog", blogControllers.getAllBlogPosts);
router.get("/blog/:slug", blogControllers.getBlogPostBySlug);

// Admin protected routes
router.post("/blog", verifyToken, blogControllers.createBlogPost);
router.put("/blog/:slug", verifyToken, blogControllers.updateBlogPost);
router.delete("/blog/:slug", verifyToken, blogControllers.deleteBlogPost);

module.exports = router;
