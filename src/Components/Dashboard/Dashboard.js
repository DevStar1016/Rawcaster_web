import React from "react";
import { Link } from "react-router-dom";
import Events from "../../Sharedcomponents/Events";
import Nuggets from "../../Sharedcomponents/Nuggets";
import SuggestedInfluencers from "../../Sharedcomponents/SuggestedInfluencers";
import classes from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={classes.fullcontainer}>
       {/* <div className={classes.ribbon}>
          <Link>
            <img className={classes.smlogo} src={require("../../Assets/Images/png/mob-rlogo.png")}/>
            Log in/Sign up to explore Rawcaster features <span class="material-icons">arrow_forward</span>
          </Link>
      </div>   */}
      <Events />
      <Nuggets />
      <SuggestedInfluencers />
    </div>
  );
};

export default Dashboard;
