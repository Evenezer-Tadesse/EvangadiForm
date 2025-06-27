const { Pool } = require("pg");
const fs = require("fs"); // Add this line to import fs module

const isProduction = process.env.NODE_ENV === "production";

// Configure SSL based on environment
let sslConfig = false;
if (isProduction) {
  try {
    // Using the certificate you downloaded
    sslConfig = {
      ca: fs.readFileSync("render-cert.pem"),
      rejectUnauthorized: true,
    };
    console.log("Using custom SSL certificate");
  } catch (err) {
    console.error(
      "Failed to read SSL certificate, using fallback:",
      err.message
    );
    sslConfig = { rejectUnauthorized: false };
  }
}

// Create the pool instance
const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log connection events
dbPool.on("connect", () => console.log("Database connected"));
dbPool.on("error", (err) => console.error("Database error:", err));
dbPool.on("acquire", () => console.log("Connection acquired"));
dbPool.on("remove", () => console.log("Connection removed"));

// Keep-alive for Render free tier
setInterval(() => {
  dbPool
    .query("SELECT 1")
    .then(() => console.log("Keep-alive ping successful"))
    .catch((e) => console.error("Keep-alive failed:", e));
}, 300000); // Every 5 minutes

module.exports = dbPool;
