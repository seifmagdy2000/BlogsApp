require("dotenv").config();

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;

function authMiddleware(req, res, next) {
  const token = req.cookies.token; // Ensure you're using cookie-parser
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
module.exports = authMiddleware;
