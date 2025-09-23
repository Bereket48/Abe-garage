//Importing the customer service
import customerService from "../services/customer.service.js";
//Creating the add customer controller
async function createCustomer(req, res, next) {
  // //Check if the request body is empty
  //   if (Object.keys(req.body).length === 0) {
  //     return res.status(400).json({ message: "Request body cannot be empty" });
  //   }
  //   //Check if the required fields are present
  //   const { customer_email, customer_first_name, customer_last_name, customer_phone, customer_password, active_customer, company_role_id } = req.body;
  //   if (!customer_email || !customer_first_name || !customer_last_name || !customer_phone || !customer_password || !company_role_id) {
  //     return res.status(400).json({ message: "All fields are required" });
  //   }
  //   //Check if the email is valid
  //   const emailRegex = /^\S+@\S+\.\S+$/;
  //     if (!emailRegex.test(customer_email)) {
  //         return res.status(400).json({ message: "Invalid email format" });
  //     }
  //     //Check if the password is at least 6 characters long
  //     if (customer_password.length < 6) {
  //         return res.status(400).json({ message: "Password must be at least 6 characters long" });
  //     }
  //Check if customer email already exists
  const customerExists = await customerService.checkIfCustomerExists(
    req.body.customer_email
  ); //The variable customerExists will have any value that the customer service function "checkIfCustomerExists" decides to return, a boolean true or false in our case 
  if (customerExists) {
    return res
      .status(400)
      .json({ message: "Customer with this email already exists" });
  } else {
    try {
      const customerData = req.body;
      // Call the customer service to create a new customer
      const newCustomer = await customerService.createCustomer(customerData);
      // If the customer is created successfully, send a success response
      if (!newCustomer) {
        return res.status(400).json({ error: "Something went wrong!" });
      } else {
        res.status(200).json({ status: "true" });
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(400).json({ error: "Failed to create customer" });
    }
  }
}

//Exporting the create customer controller
export default {
  createCustomer,
};
