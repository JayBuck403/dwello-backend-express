const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

exports.createAgent = async (req, res) => {
  const { firebase_uid, name, phone_call, phone_whatsapp, email, bio } =
    req.body;

  try {
    const existingAgent = await prisma.agents.findUnique({
      where: { firebase_uid },
    });

    if (existingAgent) {
      return res.status(400).json({ message: "Agent already registered" });
    }

    const agent = await prisma.agents.create({
      data: {
        firebase_uid,
        name,
        phone_call,
        phone_whatsapp,
        email,
        bio,
        status: "pending",
      },
    });

    res.status(201).json(agent);
  } catch (error) {
    console.error("Error registering agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route to get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await prisma.agent.findMany();
    res.status(200).json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route to get a specific agent by ID
exports.getAgentById = async (req, res) => {
  const { id } = req.params;

  try {
    const agent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route to get agent by slug
// This route is publicly accessible
// and can be used to fetch agent profiles by their slug
// This is useful for displaying agent profiles on the frontend
// without requiring authentication
exports.getAgentBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const agent = await prisma.agent.findUnique({
      where: { slug },
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route to get the logged-in agent's profile by Firebase UID
exports.getAgentByFirebaseUid = async (req, res) => {
  console.log(req.user);
  const { uid } = req.user; // Assuming req.user is set by the authentication middleware

  try {
    const agent = await prisma.agents.findUnique({
      where: { firebase_uid: uid },
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json(agent);
  } catch (error) {
    console.error("Error fetching agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route to update an agent
exports.updateAgent = async (req, res) => {
  const { id } = req.params;
  const { full_name, phone, company, license_number } = req.body;

  try {
    const agent = await prisma.agent.update({
      where: { id },
      data: {
        full_name,
        phone,
        company,
        license_number,
      },
    });

    res.status(200).json(agent);
  } catch (error) {
    console.error("Error updating agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Route to delete an agent - Admin only
// This route should be protected and only accessible to admins
exports.deleteAgent = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.agent.delete({
      where: { id },
    });

    res.status(200).json({ message: "Agent deleted successfully" });
  } catch (error) {
    console.error("Error deleting agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin route to get all pending agents
exports.getPendingAgents = async (_req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      where: { status: "pending" },
    });
    res.status(200).json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin route to approve an agent
// This route should be protected and only accessible to admins
exports.approveAgent = async (req, res) => {
  const { id } = req.params;

  try {
    const agent = await prisma.agent.update({
      where: { id },
      data: { status: "approved" },
    });
    res.status(200).json(agent);
  } catch (error) {
    console.error("Error approving agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
