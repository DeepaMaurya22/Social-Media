import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import { v2 } from "cloudinary";
v2.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createPost = async (req, res) => {
  const { postedBy, text, imageUrl } = req.body;

  if (!text || !postedBy) {
    return res
      .status(400)
      .json({ message: "text and postedBy fields are required" });
  }

  try {
    let cloudinaryRes = null;
    if (imageUrl) {
      cloudinaryRes = await cloudinary.uploader.upload(imageUrl, {
        folder: "cloudinary",
      });
      console.log("Cloudinary upload response:", cloudinaryRes);
    } else {
      console.warn("No image provided, skipping Cloudinary upload");
    }

    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() !== req.user.userId.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post" });
    }

    const newPost = new Post({
      postedBy,
      text,
      imageUrl: cloudinaryRes ? cloudinaryRes.secure_url : "", // Set to empty string if no image
    });

    await newPost.save(); // Save the new post
    res.status(200).json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.error("Error occurred:", error); // Detailed error logging
    res.status(500).json({ message: "Internal server error" });
  }
};

// single Post
const getPost = async (req, res) => {
  try {
    // console.log(req.params.id);
    const post = await Post.findById(req.params.id.toString());
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorised to delete post" });
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log("delete " + error.message);
    res.status(500).json(error.message);
  }
};

const likeUnlikePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.error("Error while liking/unliking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const replyPost = async (req, res) => {
  // console.log("post");

  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user.userId;
    const userProfilePic = req.user.profilePic;

    const post = await Post.findById(postId.toString());
    if (!text) {
      return res.status(400).json({ message: "Text field is required" });
    }
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const reply = { userId, text, userProfilePic, username: req.user.username };
    post.replies.push(reply);

    await post.save();
    res.status(200).json({
      reply,
      updatedReplyCount: post.replies.length,
      message: "Reply added successfully",
    });
  } catch (error) {
    console.log("reply " + error.message);
    res.status(500).json(error.message);
  }
};

const feedPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });
    res.status(200).json({ feedPosts });
  } catch (error) {
    console.error("Feed Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "name username ")
      .sort({
        createdAt: -1,
      });
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" }); // Handle no posts case
    }

    res.status(200).json({ posts }); // Return all posts as JSON
  } catch (error) {
    console.error("Error retrieving posts:", error); // Detailed error logging
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPostsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ postedBy: userId })
      .populate("postedBy", "name username profilePic")
      .sort({ createdAt: -1 });
    // console.log(posts);
    const postCount = posts.length;
    res.status(200).json({ posts, postCount });
  } catch (error) {
    console.error("getAllPostsByUser Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyPost,
  feedPost,
  getAllPosts,
  getAllPostsByUser,
};
