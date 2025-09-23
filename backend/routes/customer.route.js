//Importing express
import express from "express";
//Calling the router method from express
const router = express.Router();
//Importing the employee controller
import customerController from "../controllers/customer.controller.js";
// Import middleware
// const authMiddleware = require("../middlewares/auth.middleware");
import authMiddleware from "../middlewares/auth.middleware.js";
// Create a route to handle the add customer request on post
router.post(
  "/api/customer",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  customerController.createCustomer
);
//Exporting the router for use in other files
export default router;
