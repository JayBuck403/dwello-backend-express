const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

// Get or create user by Firebase UID
const getOrCreateUser = async (firebaseUid, userData) => {
  let user = await prisma.users.findUnique({
    where: { firebase_uid: firebaseUid },
  });

  if (!user) {
    user = await prisma.users.create({
      data: {
        firebase_uid: firebaseUid,
        name: userData.name || null,
        email: userData.email || '',
        phone: userData.phone || null,
      },
    });
  }

  return user;
};

// Saved Properties Controllers
exports.getSavedProperties = async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await getOrCreateUser(uid, req.user);

    const savedProperties = await prisma.saved_properties.findMany({
      where: { user_id: user.id },
      include: {
        properties: {
          include: {
            agents: {
              select: {
                name: true,
                email: true,
                phone_call: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(savedProperties.map(sp => sp.properties));
  } catch (error) {
    console.error("Error fetching saved properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveProperty = async (req, res) => {
  try {
    const { uid } = req.user;
    const { property_id } = req.body;

    const user = await getOrCreateUser(uid, req.user);

    const savedProperty = await prisma.saved_properties.create({
      data: {
        user_id: user.id,
        property_id,
      },
      include: {
        properties: true,
      },
    });

    res.status(201).json(savedProperty);
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: "Property already saved" });
    } else {
      console.error("Error saving property:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.removeSavedProperty = async (req, res) => {
  try {
    const { uid } = req.user;
    const { property_id } = req.params;

    const user = await getOrCreateUser(uid, req.user);

    await prisma.saved_properties.deleteMany({
      where: {
        user_id: user.id,
        property_id,
      },
    });

    res.json({ message: "Property removed from saved list" });
  } catch (error) {
    console.error("Error removing saved property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User Activity Controllers
exports.getUserActivity = async (req, res) => {
  try {
    const { uid } = req.user;
    const { limit = 10 } = req.query;

    const user = await getOrCreateUser(uid, req.user);

    const activity = await prisma.user_activity.findMany({
      where: { user_id: user.id },
      include: {
        properties: {
          include: {
            agents: {
              select: {
                name: true,
                email: true,
                phone_call: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      take: parseInt(limit),
    });

    res.json(activity);
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.recordActivity = async (req, res) => {
  try {
    const { uid } = req.user;
    const { property_id, action } = req.body;

    const user = await getOrCreateUser(uid, req.user);

    const activity = await prisma.user_activity.create({
      data: {
        user_id: user.id,
        property_id,
        action,
      },
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error("Error recording activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User Alerts Controllers
exports.getUserAlerts = async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await getOrCreateUser(uid, req.user);

    const alerts = await prisma.user_alerts.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
    });

    res.json(alerts);
  } catch (error) {
    console.error("Error fetching user alerts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const { uid } = req.user;
    const { name, criteria, frequency } = req.body;

    const user = await getOrCreateUser(uid, req.user);

    const alert = await prisma.user_alerts.create({
      data: {
        user_id: user.id,
        name,
        criteria,
        frequency,
      },
    });

    res.status(201).json(alert);
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const updateData = req.body;

    const user = await getOrCreateUser(uid, req.user);

    const alert = await prisma.user_alerts.update({
      where: {
        id,
        user_id: user.id,
      },
      data: updateData,
    });

    res.json(alert);
  } catch (error) {
    console.error("Error updating alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;

    const user = await getOrCreateUser(uid, req.user);

    await prisma.user_alerts.deleteMany({
      where: {
        id,
        user_id: user.id,
      },
    });

    res.json({ message: "Alert deleted successfully" });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User Profile Controllers
exports.getUserProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await getOrCreateUser(uid, req.user);

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const updateData = req.body;

    const user = await prisma.users.update({
      where: { firebase_uid: uid },
      data: updateData,
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 