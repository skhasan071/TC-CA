import mongoose from 'mongoose';

// Schema for Blog Content (Text, Bold, Scrollable)
const blogContentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['regular', 'bold', 'scrollable'], // Allowed types for content
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
}, { _id: false }); // Disable auto generation of _id for each content section

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  readingTime: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  publishedDate: { 
    type: Date, 
    default: Date.now 
  },
  image: { 
    type: String, 
    default: 'assets/gmail-logo.jpg'  // Default image if not provided
  },
  content: [blogContentSchema], // Store content sections
  contributors: [
    {
      name: { type: String, required: true },
      title: { type: String, required: true },
    }
  ]
}, { timestamps: true });  // Automatically add createdAt and updatedAt fields

// Model
const Blog = mongoose.model('Blog', blogSchema);

export default Blog;