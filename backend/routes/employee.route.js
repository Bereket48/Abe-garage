//Importing express
import express from "express";
//Calling the router method from express
const router = express.Router();
//Importing the employee controller
import employeeController from "../controllers/employee.controller.js";
// Import middleware 
// const authMiddleware = require("../middlewares/auth.middleware");
import authMiddleware from "../middlewares/auth.middleware.js";
// Create a route to handle the add employee request on post
router.post("/api/employee", [authMiddleware.verifyToken, authMiddleware.isAdmin], employeeController.createEmployee);
//Exporting the router for use in other files
export default router;
