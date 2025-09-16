//Importing express
import express from "express";  
//Calling the router method from express
const router = express.Router();
//Importing the install controller
import installController from "../controllers/install.controller.js";
//Defining the route for installation
router.get("/install", installController.install);
//Exporting the router for use in other files
export default router;

