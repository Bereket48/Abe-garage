//Importing mysql package
import mysql from "mysql2/promise";

// Importing environment variables from .env file
import dotenv from "dotenv";
dotenv.config(); //Not very sure why but i needed these lines here at the top too as using them in app.js only didn't work

//db.configuration file for database connection
const dbConfig = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
};
export default dbConfig;

// Creating a connection pool with the database configuration
const pool = mysql.createPool(dbConfig);
// Function to execute SQL queries asynchronously
// async function sql(query, params) {
//   const [rows, fields] = await pool.execute(query, params);
//   return rows;
// }
async function sql(query, params) {
  try {
    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (err) {
    console.error("Database query error:", err);
    throw err; // or handle it more gracefully
  }
}

// Exporting the query function for use in the application
export { sql }; //Named export for the sql function
