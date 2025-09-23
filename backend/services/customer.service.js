//Importing the query function from the db.config file
// import conn from "../config/db.config.js"; // This would import the plain connection object, not the query function as the default export is this not the query function
import { sql } from "../config/db.config.js"; // Importing a named export query from the db.config file

//Importing bcrypt for password hashing
import bcrypt from "bcrypt";
//Creating the checkIfCustomerExists function
async function checkIfCustomerExists(emailData) {
  const query = "SELECT * FROM customer_identifier WHERE customer_email = ?";
  const rows = await sql(query, [emailData]);
  //   console.log(rows);
  if (rows.length > 0) {
    return true; // Either of these returned boolean values will be fed to the variable "customerExists" in the controller
  }
  return false; // Customer does not exist
}

//Creating the createCustomer function
async function createCustomer(customerData) {
  let createdCustomer = {};
  try {
    // //Generate a salt and hash the email

    // Hash email with its own random salt
    const hashedEmail = await bcrypt.hash(customerData.customer_email, 10);

    //Start with populating the customer_identifier table with the customer_email, customer_phone_number and customer_hash, then use the insert id to populate the rest of the customer data in their respective tables
    const query =
      "INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)";
    const rows = await sql(query, [
      customerData.customer_email,
      customerData.customer_phone_number,
      hashedEmail,
    ]);
    console.log(rows);
    if (rows.affectedRows !== 1) {
      return false; // If this is the case, we return and stop the execution of the function as there is no point in continuing to insert the rest of the customer data
    }
    //Grab the insert id of the customer from the rows object to use it to insert the rest of the customer data
    const customer_id = rows.insertId;
    //Insert the remaining customer data into the respective tables
    const query2 =
      "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)";
    const rows2 = await sql(query2, [
      customer_id,
      customerData.customer_first_name,
      customerData.customer_last_name,
      1, // Active customer status set to 1 by default
    ]);

    // Construct the createdCustomer object with the necessary data
    createdCustomer = {
      customer_id: customer_id,
    };
  } catch (err) {
    console.log("Error creating customer:", err);
  }
  return createdCustomer; // Return the created customer object
}


// // A function to get customer by email
// async function getCustomerByEmail(customer_email) {
//   const query =
//     "SELECT * FROM customer INNER JOIN customer_info ON customer.customer_id = customer_info.customer_id INNER JOIN customer_pass ON customer.customer_id = customer_pass.customer_id INNER JOIN customer_role ON customer.customer_id = customer_role.customer_id WHERE customer.customer_email = ?";
//   const rows = await sql(query, [customer_email]);
//   return rows;
// }
// // A function to get all customers
// async function getAllCustomers() {
//   const query =
//     "SELECT * FROM customer INNER JOIN customer_info ON customer.customer_id = customer_info.customer_id INNER JOIN customer_role ON customer.customer_id = customer_role.customer_id INNER JOIN company_roles ON customer_role.company_role_id = company_roles.company_role_id ORDER BY customer.customer_id DESC limit 10";
//   const rows = await sql(query);
//   return rows;
// }
// Export the functions for use in the controller
export default {
  checkIfCustomerExists,
  createCustomer,
//   getCustomerByEmail,
//   getAllCustomers,
};
