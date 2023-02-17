import React from "react";
import Events from "../../Sharedcomponents/Events";
import Nuggets from "../../Sharedcomponents/Nuggets";
import SuggesedInfluencers from "../../Sharedcomponents/SuggesedInfluencers";
import classes from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={classes.fullcontainer}>
      {/* <div className={classes.eventSec}>test</div> */}
      <Events />

      {/* <div className={classes.nuggetSec}>
        <div className={classes.nuggetItem}>
            <div className={classes.profilePart}>
                <img className={classes.proImg} src={require("../../Assets/Images/png/sample_profile.png")}/>
            </div>
        </div>
    </div> */}
      <Nuggets />

      <SuggesedInfluencers />
    </div>
  );
};

export default Dashboard;
