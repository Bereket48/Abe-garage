//Importing express
import express from "express";

// Import CORS middleware to enable cross-origin requests
import cors from "cors";
//Importing the dotenv package to load environment variables and call the config method
import dotenv from "dotenv";
// Load environment variables from .env file into process.env
dotenv.config();
// Import DOMPurify to sanitize HTML and prevent XSS attacks
import createDOMPurify from "dompurify";
// Import jsdom to simulate a DOM environment in Node.js so that DOMPurify can work in a non-browser environment
import { JSDOM } from "jsdom";
//Importing the routes
// const router = import("./routes");
// const router= import("./routes/index.js");
import router from "./routes/index.js";
// Define CORS options allowing requests only from the front-end URL
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200, // For legacy browsers
};

//Creating a web server using express
const app = express();

//Creating a variable for the port number
const PORT = process.env.PORT;

// Create a fake browser window using jsdom for DOMPurify to operate on as DOMPurify requires a window object to function properly
// This simulates a browser environment in Node.js
const window = new JSDOM("").window;

// Initialize DOMPurify using the fake window object
const DOMPurify = createDOMPurify(window);

/**
 * Middleware to sanitize all string fields in req.body
 * This prevents malicious HTML/JS from being stored or processed
 */
function sanitizeMiddleware(req, res, next) {
  if (req.body && typeof req.body === "object") {
    // Loop through all keys in req.body
    for (const key in req.body) {
      // If the value is a string, sanitize it
      if (typeof req.body[key] === "string") {
        req.body[key] = DOMPurify.sanitize(req.body[key]);
      }
    }
  }
  // Proceed to the next middleware or route handler
  next();
}

// Enable CORS with the configured options
app.use(cors(corsOptions));

// Enable JSON body parsing for incoming requests
app.use(express.json());

// Use the custom sanitizer middleware instead of the old 'sanitize' package middleware
app.use(sanitizeMiddleware);

//Adding the routes to the application as middleware
app.use(router);
//Starting the server and listening on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//Exporting the app for use in other files
export default app;
