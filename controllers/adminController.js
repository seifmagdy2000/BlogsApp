const adminLayouts = "../views/layouts/adminHomePage";
const post = require("../models/post");
const tagsHandeler = require("../util/tagsHandeler");

// Function for requesting the admin Homepage
function adminHomePage(req, res) {
  const locals = { title: "adminHomePage", desc: "admin homepage" };

  res
    .status(200)
    .render("admin/adminHomePage", { locals, layout: adminLayouts });
}

// Function for requesting the dashboard page
async function dashboardPage(req, res) {
  try {
    const perPage = 5; // Number of posts per page
    const page = parseInt(req.query.page) || 1; // Current page number from query params

    // Get the total count of posts
    const totalPosts = await post.countDocuments();

    // Calculate the number of pages needed
    const totalPages = Math.ceil(totalPosts / perPage);

    // Fetch posts for the current page with sorting and pagination
    const data = await post
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage) // Skip the posts for the previous pages
      .limit(perPage); // Limit to the number of posts per page

    const locals = {
      title: "dashboard",
      desc: "admin editable dashboard",
    };

    res.status(200).render("dashboard", {
      layout: adminLayouts,
      locals,
      data, // Posts data
      currentPage: page, // Pass the current page
      totalPages, // Pass total number of pages
      totalPosts, // Total posts count
    });
  } catch (error) {
    console.error("Error in homePage function:", error.message, error.stack);
    res.status(500).render("500");
  }
}

// Function for requesting the admin login page
function adminLogin(req, res) {
  const locals = { title: "adminLogin", desc: "admin login" };
  res
    .status(200)
    .render("partials/loginPage", { locals, layout: adminLayouts });
}

// Function for admin signup Page
function adminSignupPage(req, res) {
  const locals = { title: "sign up", desc: "creating accounts page" };
  res.status(200).render("register.ejs", { locals, layout: adminLayouts });
}

//Founction for requesting add post page
function addPostPage(req, res) {
  const locals = { title: "add post page", desc: "add a new post" };
  res
    .status(200)
    .render("../views/admin/addPost", { locals, layout: adminLayouts });
}
//Function for requesting new post creation
async function addNewPost(req, res) {
  const { title, body, tags } = req.body;
  // Create a new post in the database
  const newPost = new post({
    title,
    body,
    tags: tagsHandeler.parseTags(tags),
  });

  await newPost.save();
  res.redirect("dashboard");
}
//Function handels deleting posts
async function deletePost(req, res) {
  try {
    const postId = req.params.id;

    // Find the post by ID and remove it from the database
    await post.findByIdAndDelete(postId);

    // Redirect back to the dashboard
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).render("500", { message: "Error deleting post" });
  }
}
//Function for requesting edit page
async function editPostPage(req, res) {
  try {
    const postId = req.params.id;
    const postData = await post.findById(postId);

    if (!postData) {
      return res.status(404).render("404", { message: "Post not found" });
    }

    const locals = {
      title: "Edit Post Page",
      desc: "Edit existing posts",
    };

    res
      .status(200)
      .render("editPost.ejs", { post: postData, locals, layout: adminLayouts });
  } catch (error) {
    console.error("Error fetching post for edit:", error.message);
    res.status(500).render("500", { message: "Error loading edit post page" });
  }
}
async function EditPost(req, res) {
  try {
    const postId = req.params.id;

    // Extract data from the request body
    const { title, body, tags } = req.body;

    // Create an object with the updated post data
    const updatedPost = {
      title,
      body,
      tags: tagsHandeler.parseTags(tags),
    };

    // Find the post by ID and update it with the new data
    await post.findByIdAndUpdate(postId, updatedPost, { new: true });

    // Redirect back to the dashboard after update
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).render("500", { message: "Error updating post" });
  }
}

module.exports = {
  EditPost,
  editPostPage,
  deletePost,
  addNewPost,
  adminHomePage,
  adminLogin,
  adminSignupPage,
  dashboardPage,
  addPostPage,
};
