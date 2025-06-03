const express = require("express");
const router = express.Router();
const amenityControllers = require("../controllers/amenityController");
// const verifyToken = require("../firebase_services/authMiddleware"); // For protecting admin routes (you'll need to define admin roles later)

// // POST /api/amenities - Create a new amenity (admin protected)
// router.post("/amenities", verifyToken, amenityControllers.createAmenity);

// GET /api/amenities - Get a list of all amenities
router.get("/amenities", amenityControllers.getAmenities);

// // GET /api/amenities/:id - Get details of a specific amenity
// router.get("/amenities/:id", amenityControllers.getAmenityById);

// // PUT /api/amenities/:id - Update an amenity (admin protected)
// router.put("/amenities/:id", verifyToken, amenityControllers.updateAmenity);

// // DELETE /api/amenities/:id - Delete an amenity (admin protected)
// router.delete("/amenities/:id", verifyToken, amenityControllers.deleteAmenity);

module.exports = router;
