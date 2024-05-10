import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import {
  generateToken,
  setCookie,
} from "../utils/generateTokenAndSetCookie.js";
import cloudinary from "../utils/cloudinary.js";

const signUpUser = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      // const token = generateToken(newUser);
      // setCookie(res, token);
      res.status(200).json({
        newUser: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
        },
        // token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

const LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "Invalid Username or Password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Invalid Username or Password" });
    }

    // const userId = user._id;

    const token = generateToken(user);
    setCookie(res, token);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Login error:", error.message);
  }
};

const userLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.status(200).json({ message: "Logged Out" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
};

const followUnfollow = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User information not found" });
    }
    console.log(req.user.userId);
    const currentUserId = req.user.userId;

    if (id === currentUserId) {
      return res
        .status(400)
        .json({ message: "You cannot follow/unfollow yourself" });
    }

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(currentUserId);

    // console.log("userToModify");
    // console.log(userToModify);
    // console.log("currentUser");
    // console.log(currentUser);
    if (!userToModify || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { follower: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { follower: currentUserId } });
      await User.findByIdAndUpdate(currentUserId, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error("Error in followUnfollow:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UpdateProfile = async (req, res) => {
  const {
    username,
    name,
    email,
    password,
    bio,
    profilePic, // New profilePic URL
    coverImage, // New coverPage URL
    liveIn,
    workAt,
  } = req.body;

  const userId = req.user.userId;

  try {
    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.params.id && req.params.id !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this profile" });
    }

    // Handle password update with encryption
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Handle Cloudinary uploads for profilePic and coverPage
    let newProfilePicUrl = user.profilePic; // Default to existing value
    if (profilePic && typeof profilePic === "string") {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "profilePics",
      });
      newProfilePicUrl = uploadResponse.secure_url; // Expect a string
    }
    // console.log(newProfilePicUrl);

    // Verify newProfilePicUrl is a string
    if (typeof newProfilePicUrl !== "string") {
      console.error(
        "Expected string for newProfilePicUrl, but got:",
        typeof newProfilePicUrl
      );
      throw new Error("Invalid data type for newProfilePicUrl");
    }

    let newCoverImageUrl = user.coverPage; // Default to existing value
    if (coverImage && typeof coverImage === "string") {
      const uploadResponse = await cloudinary.uploader.upload(coverImage, {
        folder: "coverImages",
      });
      newCoverImageUrl = uploadResponse.secure_url; // Expect a string
    }
    // console.log(newCoverImageUrl);

    if (typeof newCoverImageUrl !== "string") {
      console.error(
        "Expected string for newCoverImageUrl, but got:",
        typeof newCoverImageUrl
      );
      throw new Error("Invalid data type for newCoverImageUrl");
    }

    // Update user profile with new values
    const updateFields = {
      bio: bio || user.bio,
      name: name || user.name,
      email: email || user.email,
      liveIn: liveIn || user.liveIn,
      workAt: workAt || user.workAt,
      username: username || user.username,
      coverPage: newCoverImageUrl, // Use new URL if provided
      profilePic: newProfilePicUrl, // Use new URL if provided
    };

    user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("UpdateProfile Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSingleProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("userController " + error.message);
  }
};

const ListFollowers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const followerIds = user.follower;
    const followers = await User.find(
      { _id: { $in: followerIds } },
      "-password"
    );
    const followingIds = user.following;
    const following = await User.find(
      { _id: { $in: followingIds } },
      "-password"
    );
    res.status(200).json({ followers, following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const user = await User.find().select("-password").sort({ createdAt: -1 });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const getProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("userControllerssssss " + error.message);
  }
};
export {
  signUpUser,
  LoginUser,
  userLogout,
  followUnfollow,
  UpdateProfile,
  getSingleProfile,
  ListFollowers,
  getAllProfiles,
  getProfileById,
};
