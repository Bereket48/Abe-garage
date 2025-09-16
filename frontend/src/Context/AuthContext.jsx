//Import React and the Hooks we need
import React, { useState, useEffect, useContext, use } from "react";
//Import the util function
import getAuth from "../util/auth";
//Create a context object
const AuthContext = React.createContext();
//Create a custom hook to use the context
export const useAuth = () => {  ``
  return useContext(AuthContext);
};

//Create a provider component

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState(null);

  const value = {
    isLogged,
    isAdmin,
    setIsAdmin,
    setIsLogged,
    employee,
  };

  // useEffect(() => {
  //   // Retrieve the logged in user from local storage
  //   const loggedInEmployee = getAuth();
  //   // console.log(loggedInEmployee);
  //   loggedInEmployee.then((response) => { //getAuth is a sync function we don't call "then" on a sync func'n.
  //     // console.log(response);
  //     if (response.employee_token) {
  //       setIsLogged(true);
  //       // 3 is the employee_role for admin
  //       if (response.employee_role === 3) {
  //         setIsAdmin(true);
  //       }
  //       setEmployee(response);
  //     }
  //   });
  // }, []);
  
  useEffect(() => {
    const loggedInEmployee = getAuth();
    if (loggedInEmployee && loggedInEmployee.employee_token) {
      setIsLogged(true);
      if (loggedInEmployee.employee_role === 3) {
        setIsAdmin(true);
      }
      setEmployee(loggedInEmployee);
    }
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
