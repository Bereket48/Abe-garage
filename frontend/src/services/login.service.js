//Importing the backend API URL from environment variables for Vite
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL; 



// Creating a function to send the login request to the server
const logIn = async (formData) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };
  console.log("About to send request");
  console.log(requestOptions.body);
  const response = await fetch(
    `${backendUrl}/api/employee/login`,
    requestOptions
  );
  return response;
};

// A function to log out the user
const logOut = () => {
  localStorage.removeItem("employee");
};

// Export the functions to be used as a named object
export const loginService = {
  logIn,
  logOut,
};