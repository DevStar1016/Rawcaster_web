import React from "react";
import { Link } from "react-router-dom";
import { useAuthData } from "../../Shared/Reduxfetcher";
import DashboardSignup from "../../Sharedcomponents/DashboardSignup";
import Events from "../../Sharedcomponents/Events";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import classes from "./Dashboard.module.css";

const Dashboard = () => {
  const loginUserData = useAuthData();
  return (
    <div className={classes.fullcontainer}>
      {loginUserData === null && (
        <div className={classes.ribbon}>
          <Link to="/login">
            <img
              className={classes.smlogo}
              src={require("../../Assets/Images/png/mob-rlogo.png")}
            />
            Log in/Sign up to explore Rawcaster features{" "}
            <span class="material-icons">arrow_forward</span>
          </Link>
        </div>
      )}
      <Events />
      <Nuggets />
      <DashboardSignup />
    </div>
  );
};

export default Dashboard;
