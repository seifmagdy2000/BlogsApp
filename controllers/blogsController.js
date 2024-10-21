const post = require("../models/post");

async function homePage(req, res) {
  try {
    const perPage = 15;
    const page = parseInt(req.query.page) || 1;

    const totalPosts = await post.countDocuments();
    const skip = (page - 1) * perPage;
    const data = await post
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    const totalPages = Math.ceil(totalPosts / perPage);

    const locals = {
      title: "Home",
      desc: "Home page description",
    };

    res.status(200).render("index", {
      locals,
      data,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
    });
  } catch (error) {
    console.error("Error in homePage function:", error.message, error.stack);
    res.status(500).render("500");
  }
}

function aboutPage(req, res) {
  const locals = { title: "about page", desc: "about page description" };
  res.status(200).render("about", locals);
}

async function blogDetails(req, res) {
  try {
    const data = await post.findById({ _id: req.params.id });
    const locals = {
      title: "Blog derails",
      desc: "displays a post details",
    };

    res.status(200).render("blogDetails", {
      locals,
      data,
    });
  } catch (error) {
    console.error("Error in blogDetails function:", error.message, error.stack);
    res.status(500).render("500");
  }
}
async function searchBlogs(req, res) {
  try {
    const perPage = 15;
    const page = parseInt(req.query.page, 10) || 1;
    let query = req.query.post || ""; // Match the form field name 'post'
    query = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const totalPosts = await post.countDocuments({
      title: { $regex: query, $options: "i" }, // Case-insensitive search
    });

    const totalPages = Math.ceil(totalPosts / perPage);
    const skip = (page - 1) * perPage;

    const data = await post
      .find({
        title: { $regex: query, $options: "i" }, // Case-insensitive search
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    const locals = {
      title: "Blog Details",
      desc: "Displays the blog details",
    };

    if (data.length > 0) {
      res.status(200).render("index", {
        locals,
        data,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
      });
    } else {
      res.status(404).render("404", {
        locals,
      });
    }
  } catch (error) {
    console.error("Error in searchBlogs function:", error.message, error.stack);
    res.status(500).render("500", {
      title: "Server Error", // Passing title for the 500 error page
    });
  }
}

module.exports = { homePage, aboutPage, blogDetails, searchBlogs };
