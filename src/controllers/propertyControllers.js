const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();
// use `prisma` in your application to read and write data in your DB

exports.getAllProperties = async (req, res) => {
  const {
    region,
    property_type,
    listing_type,
    status,
    is_featured,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = req.query;

  const filters = {};

  if (region) filters.region = region;
  if (property_type) filters.property_type = property_type;
  if (listing_type) filters.listing_type = listing_type;
  if (status) filters.status = status;
  if (is_featured !== undefined) filters.is_featured = is_featured === "true";

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.gte = parseInt(minPrice);
    if (maxPrice) filters.price.lte = parseInt(maxPrice);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const [properties, total] = await Promise.all([
      prisma.properties.findMany({
        where: filters,
        skip,
        take: parseInt(limit),
        orderBy: { created_at: "desc" },
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
    res.status(500).json({ error: error.message });
  }
};

// Get a single property by ID
exports.getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.properties.findUnique({
      where: { id },
      include: { property_amenities: true },
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

    console.log("New property created:", newProperty);

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

    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a property
exports.updateProperty = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const property = await prisma.properties.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
    });

    res.json(property);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating property", error: error.message });
  }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.properties.delete({ where: { id } });
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
