import jwt from "jsonwebtoken";
// import User from "../models/UserModel.js";
// import mongoose from "mongoose";

// const protectedRoute = async (req, res, next) => {
//   console.log("Received token:", req.cookies.jwt);

//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const userId = decoded.userId;
//     if (!userId) {
//       return res.status(400).json({ message: "Invalid token structure" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID in token" });
//     }

//     const user = await User.findById(userId).select("-password");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error("protectedRoute error:", error);

//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Token has expired" });
//     }

//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export default protectedRoute;

// verifyToken.js

// const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key
// console.log(secretKey);
const protectedRoute = (req, res, next) => {
  // console.log("Received token:", req.cookies.access_token);
  const tokenString = req.headers.authorization; // Get the token from the request headers
  const token =
    tokenString && tokenString.startsWith("Bearer ")
      ? tokenString.split(" ")[1]
      : req.cookies.access_token;

  // const token = tokenString.split(" ")[1];
  // console.log(token);
  // console.log("token");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey); // Verify the token
    // console.log("decoded user");
    // console.log(decoded);
    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

export default protectedRoute;
