import React from "react";
import { Link } from "react-router-dom";
import { useAuthData, useDashboard } from "../../Shared/Reduxfetcher";
import DashboardSignup from "../../Sharedcomponents/DashboardSignup";
import Events from "../../Sharedcomponents/Events";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import classes from "./Dashboard.module.css";

const Dashboard = () => {
  const loginUserData = useAuthData();
  const { dashboardMenu } = useDashboard();
  return (
    <div>
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
      <div className="d-none d-sm-block">
        <div className={classes.fullcontainer}>
          <Events />
          <Nuggets />
          <DashboardSignup />
        </div>
      </div>
      
      <div className="d-block d-sm-none">
        <div className={classes.fullcontainer}>
          {dashboardMenu === "event" && <Events />}
          {dashboardMenu === "nugget" && <Nuggets />}
          {dashboardMenu === "usermenu" && <DashboardSignup />} 
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
