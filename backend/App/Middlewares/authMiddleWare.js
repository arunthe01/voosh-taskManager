const {verifyToken} = require("../../AUTH/Jwt")
function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (token && verifyToken(token)) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" }); // No token, unauthorized
  }
}



module.exports ={authenticate};
