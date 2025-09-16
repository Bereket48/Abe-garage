//Importing the query function from db.config.js
import { sql } from "../config/db.config.js"; //or perhaps as follows too
// import { conn } from "../config/db.config.js";
//Importing fs module for file system operations
// import fs from "fs"; // Changed to a promise-based one
import fs from "fs/promises";
// Emulating __dirname in ES modules
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Writing a function to create tables in the database
async function install() {
  //Create a variable to hold the SQL query for creating tables
  //   const queryfile = __dirname + "../services/initial-sql-queries/initial-queries.sql"; //Common JS way
  const queryfile = path.join(
    __dirname,
    "./initial-sql-queries/initial-queries.sql"
  ); //ES module way);
  console.log("Query file path:", queryfile);
  //Temporary variable to hold all queries, the return message and current query
  let queries = [];
  let finalMessage = {};
  let tempLine = "";
  //Reading the SQL file containing table creation queries
  //   const lines = await fs.readFileSync(queryfile, "utf-8").split("\n"); //readFileSync is synchronous so await doesn't go with it
  //    const lines = await fs.readFile(queryfile, "utf-8").split("\n"); // Needs to be awaited as it would otherwise be applying .split() method on a promise, not a string. It can be syntactically corrected as follows by implementing parentheses around the await expression:
  const lines = (await fs.readFile(queryfile, "utf-8")).split("\n"); // .split("\n") splits the long string into an array of lines dividing at every newline character \n. Thus lines is an array of strings
  //Creating a promise to handle the asynchronous execution of queries
  //   const executed = await new Promise((resolve, reject) => {... // Unnecessary as the block below is completely synchronous and the loop finishes immediately without any async calls or delays.
  //Iterating through each line of the SQL file
  lines.forEach((line) => {
    if (line.trim().startsWith("--") || line.trim() === "") {
      //Skipping comments and empty lines. The .trim() removes whitespace from both ends of the string
      return;
    }
    // tempLine += line;
    tempLine += line + "\n"; //To keep multi-line SQL readable.

    if (line.trim().endsWith(";")) {
      //If the line ends with a semicolon, it indicates the end of a query
      //Preparing the individual query
      const sqlQuery = tempLine.trim();
      //Adding the query to the queries array
      queries.push(sqlQuery);
      tempLine = ""; //Resetting tempLine for the next query
    }
  });
  //Looping through the queries array to asynchronously execute each query
  for (let i = 0; i < queries.length; i++) {
    try {
      const result = await sql(queries[i]);
      //   const result = await conn.query(queries[i]); //Had i imported the function above as a named variable {conn}
    //   console.log("Table created successfully:", result);
      console.log("Table created successfully:");
    } catch (err) {
      console.error("Error creating table:", err);
      finalMessage.message = "Not all tables were created successfully";
      // If any query fails, set the message accordingly
      finalMessage.status = 500;
      finalMessage.error = err.message || err.toString();
      break; // Stop executing further queries if one fails in order to avoid cascading errors if later queries depend on earlier ones.
    }
  }
  //Preparing the final message to be returned to the controller
  if (!finalMessage.message) {
    finalMessage.message = "All tables created successfully";
    finalMessage.status = 200;
  } else {
    finalMessage.status = 500;
  }
  //Returning the final message
  return finalMessage;
}

//Exporting the createTables function for use in other files
export default {
  install,
};
