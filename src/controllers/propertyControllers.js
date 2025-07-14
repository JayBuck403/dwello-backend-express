const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// use `prisma` in your application to read and write data in your DB
exports.getAllProperties = async (req, res) => {
  const {
    region,
    location,
    property_type,
    type,
    listing_type,
    status,
    is_featured,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    area_min,
    area_max,
    minArea,
    maxArea,
    page = 1,
    limit = 10,
    amenities,
  } = req.query;
  const filters = {};
  // Support both region and location (frontend may send either)
  if (region) filters.region = region;
  else if (location) filters.region = location;
  // Support both property_type and type
  if (property_type) filters.property_type = property_type;
  else if (type) filters.property_type = type;
  if (listing_type) filters.listing_type = listing_type;
  if (status) filters.status = status;
  if (is_featured !== undefined) filters.is_featured = is_featured === "true";
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.gte = parseInt(minPrice);
    if (maxPrice) filters.price.lte = parseInt(maxPrice);
  }
  // Bedrooms filter (exact or minimum)
  if (bedrooms) {
    const num = parseInt(bedrooms);
    if (!isNaN(num)) filters.bedrooms = { gte: num };
  }
  // Bathrooms filter (exact or minimum)
  if (bathrooms) {
    const num = parseInt(bathrooms);
    if (!isNaN(num)) filters.bathrooms = { gte: num };
  }
  // Area filter (area is a string, so compare as number if possible)
  const areaField = {};
  const areaMin = parseFloat(area_min || minArea);
  const areaMax = parseFloat(area_max || maxArea);
  if (!isNaN(areaMin)) areaField.gte = areaMin;
  if (!isNaN(areaMax)) areaField.lte = areaMax;
  if (Object.keys(areaField).length > 0) {
    // Prisma expects string, so use a custom filter
    filters.AND = filters.AND || [];
    if (areaField.gte !== undefined) {
      filters.AND.push({
        area: { not: null, gte: String(areaField.gte) }
      });
    }
    if (areaField.lte !== undefined) {
      filters.AND.push({
        area: { not: null, lte: String(areaField.lte) }
      });
    }
  }
  // Amenities filter (must have ALL specified amenities)
  if (amenities) {
    let amenityIds = [];
    if (Array.isArray(amenities)) {
      amenityIds = amenities.map(id => parseInt(id)).filter(id => !isNaN(id));
    } else if (typeof amenities === "string") {
      const id = parseInt(amenities);
      if (!isNaN(id)) amenityIds = [id];
    }
    if (amenityIds.length > 0) {
      filters.AND = filters.AND || [];
      amenityIds.forEach((id) => {
        filters.AND.push({
          property_amenities: {
            some: {
              amenity_id: id
            }
          }
        });
      });
    }
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  try {
    const [properties, total] = await Promise.all([
      prisma.properties.findMany({
        where: filters,
        skip,
        take: parseInt(limit),
        orderBy: { created_at: "desc" },
        include: {
          agents: {
            select: {
              id: true,
              name: true,
              email: true,
              profile_picture: true,
              phone_call: true,
              phone_whatsapp: true,
              title: true,
              bio: true,
              experience: true,
              slug: true,
            }
          },
          property_amenities: {
            include: {
              amenities: true
            }
          }
        },
      }),
      prisma.properties.count({ where: filters }),
    ]);
    res.json({
      data: properties,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single property by ID
exports.getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.properties.findUnique({
      where: { id },
      include: { 
        property_amenities: {
          include: {
            amenities: true
          }
        },
        agents: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_picture: true,
            phone_call: true,
            phone_whatsapp: true,
            title: true,
            bio: true,
            experience: true,
            slug: true,
          }
        }
      },
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new property
exports.createProperty = async (req, res) => {
  const { amenities, ...propertyData } = req.body;
  try {
    // Create the main property first
    const newProperty = await prisma.properties.create({
      data: {
        ...propertyData,
        price: parseInt(propertyData.price, 10), // ensure price is an integer
      },
    });
    // Create property_amenities junction records
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      const propertyAmenitiesData = amenities.map((amenityId) => ({
        property_id: newProperty.id,
        amenity_id: amenityId,
      }));
      await prisma.property_amenities.createMany({
        data: propertyAmenitiesData,
        skipDuplicates: true,
      });
    }
    // Emit Socket.IO event for real-time updates
    const io = req.app.get("io");
    if (io) {
      io.emit("propertyCreated", newProperty);
    }
    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const { amenities, removed_images, ...propertyData } = req.body;
  try {
    // Start a transaction to handle property update and amenities
    const result = await prisma.$transaction(async (tx) => {
      // Update the main property
      const updatedProperty = await tx.properties.update({
        where: { id },
        data: {
          ...propertyData,
          price: parseInt(propertyData.price, 10),
          bedrooms: parseInt(propertyData.bedrooms, 10),
          bathrooms: parseInt(propertyData.bathrooms, 10),
          updated_at: new Date(),
        },
      });
      // Handle amenities if provided
      if (amenities && Array.isArray(amenities)) {
        // First, remove all existing amenities for this property
        await tx.property_amenities.deleteMany({
          where: { property_id: id },
        });
        // Then add the new amenities
        if (amenities.length > 0) {
          const propertyAmenitiesData = amenities.map((amenityName) => ({
            property_id: id,
            amenity_id: amenityName, // This should be the amenity name for now
          }));
          await tx.property_amenities.createMany({
            data: propertyAmenitiesData,
            skipDuplicates: true,
          });
        }
      }
      // Handle image removal if provided
      if (removed_images && Array.isArray(removed_images)) {
        // For now, we'll just log the removed images
        // In a real implementation, you'd want to delete from storage
        console.log('Images to be removed:', removed_images);
      }
      return updatedProperty;
    });
    // Fetch the updated property with amenities and agent
    const updatedPropertyWithAmenities = await prisma.properties.findUnique({
      where: { id },
      include: { 
        property_amenities: {
          include: {
            amenities: true
          }
        },
        agents: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_picture: true,
            phone_call: true,
            phone_whatsapp: true,
            title: true,
            bio: true,
            experience: true,
            slug: true,
          }
        }
      },
    });
    // Emit Socket.IO event for real-time updates
    const io = req.app.get("io");
    if (io) {
      io.emit("propertyUpdated", updatedPropertyWithAmenities);
    }
    res.json(updatedPropertyWithAmenities);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ 
      message: "Error updating property", 
      error: error.message 
    });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.properties.delete({ where: { id } });
    // Emit Socket.IO event for real-time updates
    const io = req.app.get("io");
    if (io) {
      io.emit("propertyDeleted", id);
    }
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.properties.findUnique({
      where: { id },
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    const updatedProperty = await prisma.properties.update({
      where: { id },
      data: { is_featured: !property.is_featured },
    });
    res.json(updatedProperty);
  } catch (error) {
    console.error("Error toggling featured status:", error);
    res.status(500).json({ error: error.message });
  }
};
