const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

const verifyToken = (token) => {
  try {
    let status = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return true;
  } catch (e) {
    return false;
  }
};

const extractIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded.id;
  } catch (err) {
    console.error("Token decoding failed:", err);
    return null;
  }
};

module.exports = { generateToken, verifyToken, extractIdFromToken };
