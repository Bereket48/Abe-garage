//Importing express
import express from "express";
const router = express.Router();
//Importing the install router
import installRouter from "./install.route.js";
//Adding the installRouter to the main router
router.use(installRouter);
//Importing the employee router
import employeeRouter from "./employee.route.js";
//Adding the employeeRouter to the main router
router.use(employeeRouter);
//Importing the login router
import loginRouter from "./login.route.js";
//Adding the loginRouter to the main router
router.use(loginRouter);
//Importing the customer router
import customerRouter from "./customer.route.js";
//Adding the customerRouter to the main router
router.use(customerRouter);

//Exporting the main router for use in other files
export default router;
