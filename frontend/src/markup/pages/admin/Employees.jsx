import React from "react";
// Import the auth hook
import { useAuth } from "../../../Context/AuthContext.jsx";
// Import the login form component
import LoginForm from "../../components/LoginForm/LoginForm.jsx";
// Import the admin menu component
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu.jsx";
// Import the EmployeesList component
import EmployeesList from "../../components/Admin/EmployeesList/EmployeesList.jsx";
function Employees() {
  // Destructure the auth hook
  const { isLogged, isAdmin } = useAuth();

  if (isLogged) {
    //Page level authentication alternative to PrivateAuthRoute method used in App.jsx
    if (isAdmin) {
      //Page level authorization alternative to PrivateAuthRoute
      return (
        <div>
          <div className="container-fluid admin-pages">
            <div className="row">
              <div className="col-md-3 admin-left-side">
                <AdminMenu />
              </div>
              <div className="col-md-9 admin-right-side">
                <EmployeesList />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      //Conditional rendering for unauthorized access alternative to PrivateAuthRoute
      return (
        <div>
          <h1>You are not authorized to access this page</h1>
        </div>
      );
    }
  } else {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }
}

export default Employees;
