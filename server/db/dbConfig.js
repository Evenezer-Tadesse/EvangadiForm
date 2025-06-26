const mysql = require("mysql2");

// ✅ Add SSL option for cloud providers like Aiven or PlanetScale
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 8000, // Optional: in case it's different from default
  ssl: {
    rejectUnauthorized: true,
  },
  connectionLimit: 10,
  multipleStatements: true,
});

module.exports = dbConnection.promise();
