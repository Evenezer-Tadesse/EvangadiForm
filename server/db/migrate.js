const fs = require("fs").promises;
const path = require("path");
const dbPool = require("./dbConfig");

async function createdbTable(req, res) {
  try {
    const sqlPath = path.join(__dirname, "../sql", "create_schema.sql");
    const sqlScript = await fs.readFile(sqlPath, "utf-8");

    // Enhanced SQL splitting that handles:
    // 1. Nested semicolons in ENUM definitions
    // 2. Dollar-quoted strings ($$)
    // 3. Comments (both single-line and multi-line)
    const commands = [];
    let currentCommand = "";
    let inComment = false;
    let inDollarQuote = false;
    let dollarTag = "";
    let inSingleQuote = false;

    for (let i = 0; i < sqlScript.length; i++) {
      const char = sqlScript[i];
      const nextChar = sqlScript[i + 1] || "";

      // Handle comments
      if (!inDollarQuote && !inSingleQuote) {
        if (!inComment && char === "-" && nextChar === "-") {
          inComment = "single";
          i++; // Skip next dash
          continue;
        }
        if (!inComment && char === "/" && nextChar === "*") {
          inComment = "multi";
          i++; // Skip asterisk
          continue;
        }
        if (inComment === "single" && char === "\n") {
          inComment = false;
        }
        if (inComment === "multi" && char === "*" && nextChar === "/") {
          inComment = false;
          i++; // Skip slash
          continue;
        }
        if (inComment) continue;
      }

      // Handle dollar quoting
      if (char === "$" && !inSingleQuote) {
        const match = sqlScript.slice(i).match(/^\$([A-Za-z]*)\$/);
        if (match) {
          if (inDollarQuote && match[0] === dollarTag) {
            inDollarQuote = false;
            dollarTag = "";
            i += match[0].length - 1;
          } else if (!inDollarQuote) {
            inDollarQuote = true;
            dollarTag = match[0];
            i += match[0].length - 1;
          }
        }
      }

      // Handle single quotes
      if (char === "'" && !inDollarQuote && !inComment) {
        inSingleQuote = !inSingleQuote;
      }

      // Handle command termination
      if (char === ";" && !inDollarQuote && !inSingleQuote && !inComment) {
        if (currentCommand.trim()) {
          commands.push(currentCommand.trim());
        }
        currentCommand = "";
        continue;
      }

      // Accumulate character if not in comment
      if (!inComment) {
        currentCommand += char;
      }
    }

    // Add last command if exists
    if (currentCommand.trim()) {
      commands.push(currentCommand.trim());
    }

    // Execute commands sequentially
    for (const command of commands) {
      if (command) {
        try {
          await dbPool.query(command);
        } catch (error) {
          console.error(
            `Error executing command: ${command.substring(0, 50)}...`
          );
          throw error;
        }
      }
    }

    res.send("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error.message);
    res.status(500).send(`Error creating tables: ${error.message}`);
  }
}

module.exports = { createdbTable };
