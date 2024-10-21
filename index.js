require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./DB/config");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const mainRouter = require("./routes/mainRoutes");
const adminRoutes = require("./routes/adminRoutes");
const session = require("express-session");
const PORT = process.env.PORT || 8000;
const app = express();

// Use methodOverride middleware to support DELETE, PUT requests
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "I love mango",
    resave: false, // Prevents session being saved back to the store if it hasn't been modified
    saveUninitialized: false, // Prevents uninitialized sessions from being saved
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day (in milliseconds)
      secure: false, // Set to true if using HTTPS
      httpOnly: true, // Helps mitigate XSS attacks
      sameSite: "lax", // Protects against CSRF attacks
    },
  })
);
// //middleware to prevent caching
// app.use((req, res, next) => {
//   res.set("Cache-Control", "no-store");
//   next();
// });
//for managing cookies
app.use(cookieParser());
//for DB connection
connectDB();
//for basic protection
app.use(helmet());
//for basic optimization
app.use(compression());
// Middleware to serve static files
app.use(express.static("public"));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Set up EJS for templating
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// Use main router for all routes
app.use("/", mainRouter);
app.use("/admin", adminRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500");
});
// Error handling for unhandled routes
app.use((req, res, next) => {
  res.status(404).render("404");
});
