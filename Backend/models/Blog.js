import mongoose from "mongoose";

// Blog post schema
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Only store the image filename (e.g., "image.jpg")
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment', // Reference to Comment model
    }
  ]
}, {
  timestamps: true // ✅ This will add createdAt and updatedAt fields automatically
});

// Corrected model name (Post instead of "Blgomodel")
const PostModel = mongoose.model("Post", BlogSchema);

export default PostModel;
