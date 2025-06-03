// const express = require("express");
// const router = express.Router();
// const blogControllers = require("../controllers/blogControllers");
// const verifyToken = require("../firebase_services/authMiddleware"); // Assuming some routes need admin authentication
// const validate = require("../middleware/validationMiddleware");
// const {
//   createBlogSchema,
//   updateBlogSchema,
// } = require("../validations/blogValidation");

// // Publicly accessible routes
// router.get("/blog", blogControllers.getAllBlogPosts);
// router.get("/blog/:slug", blogControllers.getBlogPostBySlug);

// // Admin protected routes (you'll need to adjust your verifyToken middleware for admin roles)
// router.post(
//   "/blog",
//   verifyToken,
//   validate(createBlogSchema),
//   blogControllers.createBlogPost
// );
// router.put(
//   "/blog/:slug",
//   verifyToken,
//   validate(updateBlogSchema),
//   blogControllers.updateBlogPost
// );
// router.delete("/blog/:slug", verifyToken, blogControllers.deleteBlogPost);

// module.exports = router;
