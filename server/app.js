require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
// db connection
const dbPool = require("./db/dbConfig");

// authentication middleware
const authMiddleware = require("./middleware/authMiddleware");

// Initialize Express
const app = express();
const port = process.env.PORT || 3000; // Fallback for local dev

// Middleware
app.use(
  cors({
    origin: (process.env.FRONTEND_URL || "http://localhost:5173").trim(),
    credentials: true,
  })
);
//json middleware to extract json data
app.use(express.json());
// Serve static frontend if needed
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
}

// Test the backend listening
app.get("/", (req, res) => {
  res.send("Welcome to the Evangadi Forum API");
});

// Table creation route
const setupRoute = require("./routes/setupRoute");
app.use("/api/setup", setupRoute);

// User routes middleware
const userRoutes = require("./routes/userRoute");
app.use("/api/users", userRoutes);

// Question routes middleware
const questionRoutes = require("./routes/questionRoute");
app.use("/api/questions", authMiddleware, questionRoutes);

// Answer routes middleware
const answerRoutes = require("./routes/answerRoute");
app.use("/api/answers", authMiddleware, answerRoutes);
// SPA fallback

async function start() {
  try {
    const res = await dbPool.query("SELECT 'test'");
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
    console.log("✅ Successfully connected to PostgreSQL Database");
  } catch (error) {
    console.error("❌ Error setting up the server:", error.message);
  }
}

start();
