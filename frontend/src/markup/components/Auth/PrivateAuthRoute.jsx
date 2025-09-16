// Import React, the useState and useEffect hooks
import React, { useState, useEffect } from "react";
// Import the Route and Navigate components
import { Navigate } from "react-router-dom";

// Import the Util function we created to handle the reading from the local storage
import getAuth from "../../../util/auth.js";

const PrivateAuthRoute = ({ roles, children }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  //**************************The following useEffect code from lesson is changed because my getAuth function is synchronous. So we don't need the .then method as we are not expecting any promise
  // useEffect(() => {
  //   // Retrieve the logged in user from local storage
  //   const loggedInEmployee = getAuth();
  //   // console.log(loggedInEmployee);
  //   loggedInEmployee?.then((response) => {
  //     if (response.employee_token) {
  //       // If in here, that means the user is logged in
  //       // console.log(response);
  //       // console.log("Set logged in to true");
  //       setIsLogged(true);
  //       // if (
  //       //   roles &&
  //       //   roles.length > 0 &&
  //       //   roles.includes(response.employee_role)
  //       // ) {
  //       //   // If in here, that means the user is logged and has  authorization to access the route
  //       //   // console.log("Set authorized to true");
  //       //   setIsAuthorized(true);
  //       // }
  //       if (roles && roles.length > 0) {
  //         setIsAuthorized(roles.includes(response.employee_role));
  //       } else {
  //         setIsAuthorized(true); // No roles → all logged users allowed
  //       }

  //     }
  //     setIsChecked(true);
  //   });
  // }, [roles]);
  useEffect(() => {
    const loggedInEmployee = getAuth();

    if (loggedInEmployee?.employee_token) {
      setIsLogged(true);

      if (roles && roles.length > 0) {
        setIsAuthorized(roles.includes(loggedInEmployee.employee_role)); //Checking if the array of roles includes the role of the logged in user.
      } else {
        //This else block would only run if no roles are passed to the PrivateAuthRoute component as a prop resulting in undefined roles value. Thus the else block would run
        setIsAuthorized(true); // No roles set→ all logged users allowed
      }
    }

    setIsChecked(true);
  }, [roles]);

  if (isChecked) {
    if (!isLogged) {
      return <Navigate to="/login" />; //Authentication
    }
    if (!isAuthorized) {
      return <Navigate to="/unauthorized" />; //Authorization
    }
  }

  return children;
};

export default PrivateAuthRoute;
