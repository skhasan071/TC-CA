import Blog from '../models/blogs.js';


// Create a new blog
export const createBlog = async (req, res) => {
  const { title, category, readingTime, description, content, contributors, image } = req.body;

  try {
    const newBlog = new Blog({
      title,
      category,
      readingTime,
      description,
      content,
      contributors,
      image: image || 'assets/gmail-logo.jpg', // Default image if not provided
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error });
  }
};

// Fetch all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find(); // Fetch all blogs from the database
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error });
  }
};
export default { createBlog,getAllBlogs};
