const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

// Get all blog posts
exports.getAllBlogPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (category) {
      where.category = category;
    }

    const [posts, total] = await Promise.all([
      prisma.blog_posts.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { created_at: 'desc' },
      }),
      prisma.blog_posts.count({ where })
    ]);

    res.status(200).json({
      data: posts,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get blog post by slug
exports.getBlogPostBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const post = await prisma.blog_posts.findUnique({
      where: { slug },
    });

    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create new blog post
exports.createBlogPost = async (req, res) => {
  const {
    title,
    content,
    excerpt,
    author,
    category,
    featured_image_url,
    tags
  } = req.body;

  try {
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const post = await prisma.blog_posts.create({
      data: {
        title,
        content,
        excerpt,
        author,
        category,
        featured_image_url,
        tags: tags || [],
        slug,
        status: 'published'
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update blog post
exports.updateBlogPost = async (req, res) => {
  const { slug } = req.params;
  const updateData = req.body;

  try {
    const post = await prisma.blog_posts.update({
      where: { slug },
      data: updateData,
    });

    res.status(200).json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete blog post
exports.deleteBlogPost = async (req, res) => {
  const { slug } = req.params;

  try {
    await prisma.blog_posts.delete({
      where: { slug },
    });

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}; 