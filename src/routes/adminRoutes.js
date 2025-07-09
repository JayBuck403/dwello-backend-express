const express = require("express");
const router = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const adminControllers = require('../controllers/adminControllers');

// Apply admin authentication middleware to all routes
router.use(adminAuthMiddleware);

// Agent management routes
router.get('/agents', adminControllers.getAllAgents);
router.put('/agents/:id/approve', adminControllers.approveAgent);
router.put('/agents/:id/reject', adminControllers.rejectAgent);
router.delete('/agents/:id', adminControllers.deleteAgent);

// Property management routes
router.get('/properties', adminControllers.getAllProperties);
router.put('/properties/:id/approve', adminControllers.approveProperty);
router.put('/properties/:id/reject', adminControllers.rejectProperty);
router.put('/properties/:id/feature', adminControllers.toggleFeatured);
router.delete('/properties/:id', adminControllers.deleteProperty);

// Blog management routes
router.get('/blog', adminControllers.getAllBlogPosts);
router.post('/blog', adminControllers.createBlogPost);
router.put('/blog/:id', adminControllers.updateBlogPost);
router.delete('/blog/:id', adminControllers.deleteBlogPost);

// User management routes
router.get('/users', adminControllers.getAllUsers);
router.get('/users/:id', adminControllers.getUserById);
router.put('/users/:id/status', adminControllers.updateUserStatus);
router.put('/users/:id/role', adminControllers.updateUserRole);
router.delete('/users/:id', adminControllers.deleteUser);

// Settings routes
router.get('/settings', adminControllers.getSettings);
router.put('/settings', adminControllers.updateSettings);

// Dashboard routes
router.get('/dashboard', adminControllers.getDashboardData);

module.exports = router; 