const mongoose = require("mongoose");

// Function to connect to the MongoDB database
const connectDB = async () => {
  // Validate the presence of the MongoDB URI
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI environment variable is not defined.");
    process.exit(1);
  }

  try {
    // Set Mongoose configuration to disable strict query checking
    mongoose.set("strictQuery", false);

    // Attempt to connect to the MongoDB database using the connection URI from the environment variables
    const connect = await mongoose.connect(process.env.MONGODB_URI, {});

    // Log a message indicating successful connection along with the host name
    console.log(`Database connected: ${connect.connection.host}`);
  } catch (error) {
    // Log any errors that occur during the connection attempt
    console.error("Error connecting to the database:", error);
    setTimeout(() => connectDB(), 5000); // Retry after 5 seconds
  }
};

module.exports = connectDB;
