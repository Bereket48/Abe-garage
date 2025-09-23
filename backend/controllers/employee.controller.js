//Importing the employee service
import employeeService from "../services/employee.service.js";
//Creating the add employee controller
async function createEmployee(req, res, next) {
  // //Check if the request body is empty
  //   if (Object.keys(req.body).length === 0) {
  //     return res.status(400).json({ message: "Request body cannot be empty" });
  //   }
  //   //Check if the required fields are present
  //   const { employee_email, employee_first_name, employee_last_name, employee_phone, employee_password, active_employee, company_role_id } = req.body;
  //   if (!employee_email || !employee_first_name || !employee_last_name || !employee_phone || !employee_password || !company_role_id) {
  //     return res.status(400).json({ message: "All fields are required" });
  //   }
  //   //Check if the email is valid
  //   const emailRegex = /^\S+@\S+\.\S+$/;
  //     if (!emailRegex.test(employee_email)) {
  //         return res.status(400).json({ message: "Invalid email format" });
  //     }
  //     //Check if the password is at least 6 characters long
  //     if (employee_password.length < 6) {
  //         return res.status(400).json({ message: "Password must be at least 6 characters long" });
  //     }
  //Check if employee email already exists
  const employeeExists = await employeeService.checkIfEmployeeExists(
    req.body.employee_email
  ); //The variable employeeExists will have any value that the employee service function "checkIfEmployeeExists" decides to return, a boolean true or false in our case 
  if (employeeExists) {
    return res
      .status(400)
      .json({ message: "Employee with this email already exists" });
  } else {
    try {
      const employeeData = req.body;
      // Call the employee service to create a new employee
      const newEmployee = await employeeService.createEmployee(employeeData);
      // If the employee is created successfully, send a success response
      if (!newEmployee) {
        return res.status(400).json({ error: "Something went wrong!" });
      } else {
        res.status(200).json({ status: "true" });
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(400).json({ error: "Failed to create employee" });
    }
  }
}

// Create the getAllEmployees controller 
async function getAllEmployees(req, res, next) {
  // Call the getAllEmployees method from the employee service 
  const employees = await employeeService.getAllEmployees();
  // console.log(employees);
  if (!employees) {
    res.status(400).json({
      error: "Failed to get all employees!"
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employees,
    });
  }
}

//Exporting the create employee controller
export default {
  createEmployee,
  getAllEmployees,
};
