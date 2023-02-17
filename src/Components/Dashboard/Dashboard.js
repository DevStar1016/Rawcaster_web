import React from "react";
import Events from "../../Sharedcomponents/Events";
import Nuggets from "../../Sharedcomponents/Nuggets";
import SuggestedInfluencers from "../../Sharedcomponents/SuggestedInfluencers";
import classes from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={classes.fullcontainer}>
      <Events />
      <Nuggets />
      <SuggestedInfluencers />
    </div>
  );
};

export default Dashboard;
