const fs = require("fs").promises; // Use promise-based API
const path = require("path");
const dbPool = require("./dbConfig");

async function createdbTable(req, res) {
  try {
    const sqlPath = path.join(__dirname, "../sql", "create_schema.sql");
    const sqlScript = await fs.readFile(sqlPath, "utf-8");

    // Split script into individual commands
    const commands = sqlScript.split(";").filter((cmd) => cmd.trim());

    // Execute commands sequentially
    for (const command of commands) {
      if (command.trim()) {
        await dbPool.query(command);
      }
    }

    res.send("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error.message);
    res.status(500).send("Error creating tables");
  }
}

module.exports = { createdbTable };
