const mongoose = require("mongoose");

const userSchema = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
  },
};

const usermodel = mongoose.model("Users", userSchema);

module.exports = usermodel;
