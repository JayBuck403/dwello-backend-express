const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const getAmenities = async (req, res) => {
  try {
    const amenities = await prisma.amenities.findMany();
    res.status(200).json(amenities);
  } catch (error) {
    console.error("Error fetching amenities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAmenities,
};
