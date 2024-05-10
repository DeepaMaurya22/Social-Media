import express from "express";
import protectedRoute from "../middleware/ProtectedRoutes.js";
import {
  createPost,
  deletePost,
  feedPost,
  getAllPosts,
  getAllPostsByUser,
  getPost,
  likeUnlikePost,
  replyPost,
} from "../controllers/postController.js";
const router = express.Router();

router.post("/create", protectedRoute, createPost);
router.get("/:id", getPost);
router.get("/", getAllPosts);
router.get("/post/:id", getAllPostsByUser);
router.delete("/:id", protectedRoute, deletePost);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.put("/reply/:id", protectedRoute, replyPost);
router.get("/feed", protectedRoute, feedPost);

export default router;
