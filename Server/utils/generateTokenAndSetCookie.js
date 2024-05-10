import jwt from "jsonwebtoken";

// const generateTokenAndSetCookie = (UserId, res) => {
//   const token = jwt.sign({ UserId }, process.env.JWT_SECRET, {
//     expiresIn: "15d",
//   });

//   res.cookie("jwt", token, {
//     httpOnly: true,
//     maxAge: 15 * 24 * 60 * 60 * 1000,
//     // sameSite: "strict",
//     sameSite: "none",
//   });

//   return token;
// };

// export default generateTokenAndSetCookie;

// generateTokenAndSetCookie.js

// Generate a JWT token
const secretKey = process.env.JWT_SECRET;
// console.log(secretKey);
// console.log("secretKey");
// const generateToken = (userId) => {
//   return jwt.sign({ userId }, secretKey, {
//     expiresIn: "15d",
//   });
// };
const generateToken = (user) => {
  // Include additional user information, but exclude sensitive details
  console.log(user);
  if (!user || !user._id) {
    throw new Error("Invalid user data for token generation"); // Guard against invalid user object
  }
  const payload = {
    userId: user._id, // Unique user identifier
    name: user.name, // User's name
    email: user.email, // User's email
    username: user.username, // User's username
    profilePic: user.profilePic, // User's username
  };

  const secretKey = process.env.JWT_SECRET; // Secret key for signing the token

  // Create the JWT with a defined expiration time (e.g., 1 day)
  const token = jwt.sign(payload, secretKey, { expiresIn: "15d" });

  return token; // Return the generated token
};

// Set the token in an HTTP-only cookie
const setCookie = (res, token) => {
  res.cookie("access_token", token, {
    httpOnly: true, // Only accessible via HTTP
    maxAge: 15 * 24 * 60 * 60 * 1000,
    // secure: process.env.NODE_ENV === "production", // Use only in production with HTTPS
  });
};

export { generateToken, setCookie };
