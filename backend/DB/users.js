const bcrypt = require("bcrypt"); // Add bcrypt for password hashing
const userModel = require("../DB/Models/userModel");

// Check if user is valid
const isValidUser = async (email, password) => {
  try {
    const user = await userModel.findOne({ email: email });
    if (user && bcrypt.compare(password, user.password)) {
      // Compare hashed password
      return user;
    }
    return false;
  } catch (err) {
    console.error("Error checking user validity:", err);
    return false;
  }
};

// Save a new user
const saveUser = async (email, password) => {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email: email,
      password: hashedPassword, // Store hashed password
    });
    const savedUser = await newUser.save();
    return savedUser; // Return the saved user
  } catch (err) {
    console.error("Error saving user:", err);
    return null;
  }
};

// Check if user already exists
const userAlreadyExists = async (email) => {
  try {
    const userExists = await userModel.findOne({ email: email });
    return userExists ? true : false;
  } catch (err) {
    console.error("Error checking user existence:", err);
    return false;
  }
};

module.exports = { isValidUser, saveUser, userAlreadyExists };
