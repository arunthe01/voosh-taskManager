const express = require("express");
const Authrouter = express.Router();
const { isValidUser, saveUser, userAlreadyExists } = require("../../DB/users");
const { generateToken } = require("../../AUTH/Jwt.js");
const { emailRegex } = require("../../Utils/regex.js");

// Signup Route
Authrouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("insided signup");
  try {
    if (await userAlreadyExists(email)) {
      //console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    if (emailRegex.test(email) && password.length > 3) {
      const savedUser = saveUser(email, password);
      if (savedUser) {
        return res.status(200).json({
          message: "User saved successfully",
          user: savedUser, // Combine into a single object
        });
      } else {
        return res.status(500).json({ message: "Error saving user" }); // Change to 500 for server error
      }
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error during signup:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Login Route
Authrouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const valid = await isValidUser(email, password);
    if (valid) {
      const token = generateToken({ email: email, id: valid._id });
      return res.status(200).json({ message: "Success", token: token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { Authrouter };
