const express = require("express");
const router = express.Router();
const propertyControllers = require("../controllers/propertyControllers");

// Get all properties with filters, pagination, and amenities
router.get("/", propertyControllers.getAllProperties);

// Get a specific property by ID
router.get("/:id", propertyControllers.getPropertyById);

// Create a new property
router.post("/", propertyControllers.createProperty);

// Update a property
router.put("/:id", propertyControllers.updateProperty);

// Add amenities to a property
// router.post(
//   "/:propertyId/amenities",
//   propertyControllers.addAmenitiesToProperty
// );

// Remove a specific amenity from a property
// router.delete(
//   "/:propertyId/amenities/:amenityId",
//   propertyControllers.removeAmenityFromProperty
// );

// Delete a property
router.delete("/:id", propertyControllers.deleteProperty);

module.exports = router;
