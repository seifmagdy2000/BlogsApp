const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");

// Admin registration
async function adminRegister(req, res) {
  console.log("Registration function");
  const { username, password, email } = req.body;
  console.log(username, password, email);
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: "Password is too weak" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Try to create the user in the database
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // User successfully created, send response
    return res.status(201).json({ message: "User created", user });
  } catch (error) {
    // Check if the error is due to a duplicate key (e.g., username or email already in use)
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Username or Email already in use" });
    } else {
      // For any other errors, send a 500 response
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
// Function for loggingout
async function logout(req, res) {
  res.clearCookie("token");
  await req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session: ", err);
      return res.redirect("/dashboard");
    }
    res.redirect("/admin"); // Redirect to login page after session destruction
  });
}

// Function for admin account validation (login)
async function loginCheck(req, res) {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.jwtSecret, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });

    // Redirect to dashboard
    res.redirect("dashboard");
  } catch (error) {
    console.log("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = { loginCheck, adminRegister, logout };
