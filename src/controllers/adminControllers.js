const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

// Existing admin controller methods...

// Missing admin controller methods that are referenced in routes
const getAllAgents = async (req, res) => {
  try {
    const agents = await prisma.agents.findMany({
      include: {
        properties: true,
        blog_posts: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};

const approveAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await prisma.agents.update({
      where: { id },
      data: { 
        status: 'approved',
        is_approved: true
      }
    });

    res.json({ agent });
  } catch (error) {
    console.error('Error approving agent:', error);
    res.status(500).json({ error: 'Failed to approve agent' });
  }
};

const rejectAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await prisma.agents.update({
      where: { id },
      data: { status: 'rejected' }
    });

    res.json({ agent });
  } catch (error) {
    console.error('Error rejecting agent:', error);
    res.status(500).json({ error: 'Failed to reject agent' });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.agents.delete({
      where: { id }
    });

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.properties.findMany({
      include: {
        agents: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_picture: true
          }
        },
        property_amenities: {
          include: {
            amenities: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    console.log(properties)

    res.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

const approveProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // If status is provided in body, use it; otherwise default to 'available'
    const newStatus = status || 'available';
    
    const property = await prisma.properties.update({
      where: { id },
      data: { status: newStatus },
      include: {
        agents: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_picture: true
          }
        }
      }
    });

    res.json({ property });
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({ error: 'Failed to approve property' });
  }
};

const rejectProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // If status is provided in body, use it; otherwise default to 'rejected'
    const newStatus = status || 'rejected';
    
    const property = await prisma.properties.update({
      where: { id },
      data: { status: newStatus },
      include: {
        agents: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_picture: true
          }
        }
      }
    });

    res.json({ property });
  } catch (error) {
    console.error('Error rejecting property:', error);
    res.status(500).json({ error: 'Failed to reject property' });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.properties.delete({
      where: { id }
    });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await prisma.blog_posts.findMany({
      include: {
        agents: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({ blogPosts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
};

const createBlogPost = async (req, res) => {
  try {
    const blogPost = await prisma.blog_posts.create({
      data: req.body,
      include: {
        agents: true
      }
    });

    res.status(201).json({ blogPost });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
};

const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await prisma.blog_posts.update({
      where: { id: parseInt(id) },
      data: req.body,
      include: {
        agents: true
      }
    });

    res.json({ blogPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
};

const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.blog_posts.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
};

// New admin controller methods for users management
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        saved_properties: true,
        user_activity: true,
        user_alerts: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: { id },
      include: {
        saved_properties: {
          include: {
            properties: true
          }
        },
        user_activity: {
          orderBy: {
            created_at: 'desc'
          },
          take: 10
        },
        user_alerts: {
          orderBy: {
            created_at: 'desc'
          },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'inactive', 'suspended', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await prisma.users.update({
      where: { id },
      data: { status }
    });

    res.json({ user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['user', 'agent', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.users.update({
      where: { id },
      data: { role }
    });

    res.json({ user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete related data first
    await prisma.saved_properties.deleteMany({
      where: { user_id: id }
    });

    await prisma.user_activity.deleteMany({
      where: { user_id: id }
    });

    await prisma.user_alerts.deleteMany({
      where: { user_id: id }
    });

    // Delete the user
    await prisma.users.delete({
      where: { id }
    });

    // Emit Socket.IO event
    const io = req.app.get("io");
    if (io) {
      io.emit("userDeleted", id);
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// New admin controller methods for settings
const getSettings = async (req, res) => {
  try {
    // In a real application, you might store settings in a database
    // For now, we'll return default settings
    const settings = {
      system: {
        site_name: "Dwello Homes",
        site_description: "Your trusted partner in real estate",
        contact_email: "contact@dwello.com",
        support_phone: "+233247724921",
        maintenance_mode: false,
        registration_enabled: true,
        email_verification_required: true,
        max_properties_per_agent: 50,
        max_images_per_property: 20,
        auto_approve_agents: false,
        auto_approve_properties: false,
        notification_email: true,
        notification_sms: false,
        notification_push: true,
        currency: "GHS",
        timezone: "Africa/Accra",
        date_format: "MM/DD/YYYY",
        language: "en",
        theme: "light",
      },
      security: {
        password_min_length: 8,
        require_special_chars: true,
        require_numbers: true,
        require_uppercase: true,
        session_timeout: 24,
        max_login_attempts: 5,
        two_factor_required: false,
        ip_whitelist: [],
        allowed_domains: ["dwello.com", "gmail.com"],
      }
    };

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { system, security } = req.body;

    // In a real application, you would save these settings to a database
    // For now, we'll just return success
    console.log('Settings updated:', { system, security });

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

// New admin controller methods for dashboard
const getDashboardData = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await prisma.users.count();
    const totalAgents = await prisma.agents.count();
    const totalProperties = await prisma.properties.count();
    const totalBlogPosts = await prisma.blog_posts.count();
    const activeListings = await prisma.properties.count({
      where: { status: 'available' }
    });
    const pendingApprovals = await prisma.properties.count({
      where: { status: 'pending' }
    });

    // Get recent activity
    const recentActivity = await prisma.user_activity.findMany({
      include: {
        users: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 10
    });

    // Get top properties by views (mock data for now)
    const topProperties = await prisma.properties.findMany({
      include: {
        agents: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 5
    });

    // Get top agents by properties count
    const topAgents = await prisma.agents.findMany({
      include: {
        properties: true
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 5
    });

    // Calculate growth percentages (mock data for now)
    const userGrowth = 12.5;
    const propertyGrowth = 8.3;

    const stats = {
      total_users: totalUsers,
      total_agents: totalAgents,
      total_properties: totalProperties,
      total_blog_posts: totalBlogPosts,
      active_listings: activeListings,
      pending_approvals: pendingApprovals,
      total_views: 15678, // Mock data
      total_saves: 2341, // Mock data
      total_inquiries: 567, // Mock data
      monthly_revenue: 45600, // Mock data
      user_growth: userGrowth,
      property_growth: propertyGrowth,
    };

    res.json({
      stats,
      recentActivity,
      topProperties,
      topAgents
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First get the current property to check its featured status
    const currentProperty = await prisma.properties.findUnique({
      where: { id }
    });
    
    if (!currentProperty) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Toggle the featured status
    const property = await prisma.properties.update({
      where: { id },
      data: { is_featured: !currentProperty.is_featured },
      include: {
        agents: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_picture: true
          }
        }
      }
    });

    res.json({ property });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ error: 'Failed to toggle featured status' });
  }
};

// Create a new user (if you have such an endpoint)
const createUser = async (req, res) => {
  // ...existing code to create user...
  try {
    const user = await prisma.users.create({
      // ...
    });
    // Emit Socket.IO event
    const io = req.app.get("io");
    if (io) {
      io.emit("userCreated", user);
    }
    res.status(201).json(user);
  } catch (error) {
    // ...
  }
};

// Update a user (if you have such an endpoint)
const updateUser = async (req, res) => {
  // ...existing code to update user...
  try {
    const user = await prisma.users.update({
      // ...
    });
    // Emit Socket.IO event
    const io = req.app.get("io");
    if (io) {
      io.emit("userUpdated", user);
    }
    res.status(200).json(user);
  } catch (error) {
    // ...
  }
};

module.exports = {
  // Agent management
  getAllAgents,
  approveAgent,
  rejectAgent,
  deleteAgent,
  
  // Property management
  getAllProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
  
  // Blog management
  getAllBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  
  // User management
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  
  // Settings
  getSettings,
  updateSettings,
  
  // Dashboard
  getDashboardData,
  
  // New admin controller methods
  toggleFeatured,
  
  // Create a new user (if you have such an endpoint)
  createUser,
  
  // Update a user (if you have such an endpoint)
  updateUser,
}; 