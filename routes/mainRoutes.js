const express = require("express");
const blogsController = require("../controllers/blogsController");
const router = express.Router();

//about route
router.get("/about", blogsController.aboutPage);

router.get("/admin");
// home page route
router.get("/", blogsController.homePage);

// post a new post
router.get("/post/:id", blogsController.blogDetails);

//search functionality in posts
router.get("/search", blogsController.searchBlogs);

module.exports = router;
