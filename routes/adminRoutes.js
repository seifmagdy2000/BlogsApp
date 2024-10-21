const express = require("express");
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware");
// Middleware for caching control
router.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Authentication-related routes
router.get("/logout", authController.logout);

// Route to show form for adding a new post
router.get("/addPost", authMiddleware, adminController.addPostPage);

// Route to handle adding a new post
router.post("/addPost", authMiddleware, adminController.addNewPost);

// Route to show form for editing a post
router.get("/editPost/:id", authMiddleware, adminController.editPostPage);

// Route to handle updating a post (use method-override in the form for PUT request)
router.put("/editPost/:id", authMiddleware, adminController.EditPost);

// Other routes
router.post("/register", authController.adminRegister);
router.post("/login", authController.loginCheck);
router.get("/dashboard", authMiddleware, adminController.dashboardPage);
router.get("/signup", adminController.adminSignupPage);
router.post("/deletePost/:id", authMiddleware, adminController.deletePost);

// Login page
router.get("/", adminController.adminLogin);

module.exports = router;
