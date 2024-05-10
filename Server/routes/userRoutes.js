import express from "express";
import {
  // CheckUser,
  ListFollowers,
  LoginUser,
  UpdateProfile,
  followUnfollow,
  getAllProfiles,
  getProfileById,
  getSingleProfile,
  signUpUser,
  userLogout,
} from "../controllers/userController.js";
import protectedRoute from "../middleware/ProtectedRoutes.js";
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", LoginUser);
router.post("/logout", userLogout);
router.post("/follow/:id", protectedRoute, followUnfollow);
router.put("/update/:id", protectedRoute, UpdateProfile);
router.get("/all-profiles", getAllProfiles);
router.get("/profile/:username", getSingleProfile);
router.get("/followerfollowing/:id", ListFollowers);
router.get("/:id", getProfileById);
// router.get("/check-user", protectedRoute, CheckUser);
export default router;
