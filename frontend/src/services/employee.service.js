//Importing the backend URL from environment variables
// const backendUrl = process.env.VITE_APP_BACKEND_URL; //process.env works in Node.js or CRA (Create React App) setup, not in Vite environment. The reason for this is that Vite uses a different mechanism to inject environment variables into the client-side code, which is why we use import.meta.env instead of process.env.
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

//Creating a function to add an employee by sending a POST request to the backend
const createEmployee = async (formData, loggedInEmployeeToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "X-Authorization": `Bearer ${loggedInEmployeeToken}`
      "x-access-token": loggedInEmployeeToken, //Including the token in the request headers for authentication and authorization.
    },
    body: JSON.stringify(formData),
  };
  // Sending a POST request to the backend to create a new employee
  const response = await fetch(`${backendUrl}/api/employee`, requestOptions);
  return response;
};

// A function to send get request to get all employees
const getAllEmployees = async (token) => {
  // console.log(token);
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${backendUrl}/api/employees`, requestOptions);
  return response;
};

//Exporting all the functions
export const employeeService = {
  createEmployee,
  getAllEmployees,
};
