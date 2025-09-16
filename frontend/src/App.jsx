import { useState } from "react";
import "./App.css";
// Importing routing functionalities
import { Routes, Route } from "react-router-dom"; // Step 2: Importing Routes and Route
// Importing the different pages
import Home from "./markup/pages/Home.jsx";
import Login from "./markup/pages/Login.jsx";
import AddEmployee from "./markup/pages/admin/AddEmployee.jsx";
import Unauthorized from "./markup/pages/Unauthorized.jsx";

// Import the Orders and Customers components
import Orders from "./markup/pages/admin/Orders.jsx";
import Customers from "./markup/pages/admin/Customers.jsx";
// Import the Employees component
import Employees from "./markup/pages/admin/Employees.jsx";

// Importing the different components
import Header from "./markup/components/Header/Header.jsx";
// import Footer from "./markup/components/Footer/Footer.jsx";
import Footer from "./markup/components/Footer/Footer.jsx";
//Import the PrivateAuthRoute component
import PrivateAuthRoute from "./markup/components/Auth/PrivateAuthRoute.jsx";

//Importing the css files
import "./assets/template_assets/css/bootstrap.css";
import "./assets/template_assets/css/style.css";
import "./assets/template_assets/css/responsive.css";
import "./assets/template_assets/css/color.css";
import "./assets/styles/custom.css";

function App() {
  return (
    <>
      {/* Including the Header component */}
      <Header />
      <Routes>
        {/* Defining routes for different pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* // Add the Orders Route  */}
        <Route
          path="/admin/orders"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <Orders />
            </PrivateAuthRoute>
          }
        />
        {/* Auth (signing in) is required above to access Orders page (authentication) but no role restriction (authorization). So, PrivateAuthRoute is working both AUTHENTICATION and AUTHORIZATION. This would still work if we don't apply the roles prop because we have set setIsAuthorized(true) in the else clause*/}
        {/* // Add the Customers Route  */}
        <Route
          path="/admin/customers"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <Customers />
            </PrivateAuthRoute>
          }
        />
        {/* // Add the Employees Route  */}
        <Route path="/admin/employees" element={<Employees />} /> {/*For this route, we alternatively handled both the authentication and authorization inside the Employees page's jsx using conditional rendering. So, we didn't need to wrap Employees route with PrivateAuthRoute. This is the second way of handling authentication and authorization. The first way is using PrivateAuthRoute as shown in Orders and Customers routes above.*/}
        <Route
          path="/admin/add-employee"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AddEmployee />
            </PrivateAuthRoute>
          }
        />
        {/* 
          Customers (/admin/customers) - managers and admins
          Orders (/admin/orders) - Can be accessed by all employees
          Add employee (/admin/add-employee) - admins only 
            - Admin: 3 
            - Manager: 2 
            - Employee: 1 
        */}

        {/* Add more routes as needed */}
      </Routes>
      {/* Including the Footer component */}
      <Footer />
    </>
  );
}

export default App;
