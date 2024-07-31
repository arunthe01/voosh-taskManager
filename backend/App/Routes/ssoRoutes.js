const express = require("express");
const ssoRouter = express.Router();
const { authenticate } = require("../Middlewares/authMiddleWare");
const userModel = require("../../DB/Models/userModel");
const { generateToken } = require("../../AUTH/Jwt.js");

ssoRouter.post("/auth/google", async (req, res) => {
  try {
    const { email, googleId } = req.body;

    if (!email || !googleId) {
      return res
        .status(400)
        .json({ message: "Email and Google ID are required." });
    }
    let user = await userModel.findOne({ googleId: googleId });
    if (!user) {
      user = await userModel.findOne({ email: email });
      if (user) {
        return res.status(400).json({
          devCode: "user-general-email-exists",
          message:
            "User email already exists! Please login with credentials instead of Google.",
        });
      } else {
        user = new userModel({ email: email, googleId: googleId });
        user = await user.save();
        return res.status(201).json({
          message: "User created successfully.",
          token: generateToken({ id: user._id, email: email }),
        });
      }
    }

    const token = generateToken({ id: user._id, email: email });
    return res.json({ token: token });
  } catch (error) {
    console.error("Error in /auth/google route:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = ssoRouter;
