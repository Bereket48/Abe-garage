//Importing the query function from the db.config file
// import conn from "../config/db.config.js"; // This would import the plain connection object, not the query function as the default export is this not the query function
import { sql } from "../config/db.config.js"; // Importing a named export query from the db.config file

//Importing bcrypt for password hashing
import bcrypt from "bcrypt";
//Creating the checkIfEmployeeExists function
async function checkIfEmployeeExists(emailData) {
  const query = "SELECT * FROM employee WHERE employee_email = ?";
  const rows = await sql(query, [emailData]);
  console.log(rows);
  if (rows.length > 0) {
    return true; // Either of these returned boolean values will be fed to the variable "employeeExists" in the controller
  }
  return false; // Employee does not exist
}

//Creating the createEmployee function
async function createEmployee(employeeData) {
  let createdEmployee = {};
  try {
    //Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds which is a good balance between security and performance
    // Hash the password with the generated salt
    const hashedPassword = await bcrypt.hash(
      employeeData.employee_password,
      salt
    );
    //Start with populating the employee table with the employee email and active status, then use the insert id to populate the rest of the employee data in their respective tables
    const query =
      "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)";
    const rows = await sql(query, [
      employeeData.employee_email,
      employeeData.active_employee,
    ]);
    console.log(rows);
    if (rows.affectedRows !== 1) {
      return false; // If this is the case, we return and stop the execution of the function as there is no point in continuing to insert the rest of the employee data
    }
    //Grab the insert id of the employee from the rows object to use it to insert the rest of the employee data
    const employee_id = rows.insertId;
    //Insert the remaining employee data into the respective tables
    const query2 =
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)";
    const rows2 = await sql(query2, [
      employee_id,
      employeeData.employee_first_name,
      employeeData.employee_last_name,
      employeeData.employee_phone,
    ]);
    const query3 =
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)";
    const rows3 = await sql(query3, [employee_id, hashedPassword]);
    const query4 =
      "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)";
    const rows4 = await sql(query4, [
      employee_id,
      employeeData.company_role_id,
    ]);
    // Construct the createdEmployee object with the necessary data
    createdEmployee = {
      employee_id: employee_id,
    };
  } catch (err) {
    console.log("Error creating employee:", err);
  }
  return createdEmployee; // Return the created employee object
}

// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query = "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const rows = await sql(query, [employee_email]);
  return rows;
}
// A function to get all employees
async function getAllEmployees() {
  const query = "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id ORDER BY employee.employee_id DESC limit 10";
  const rows = await sql(query);
  return rows;
}
// Export the functions for use in the controller
export default {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getAllEmployees,
};