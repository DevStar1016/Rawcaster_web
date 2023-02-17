import React from "react";
import classes from "./Dashboard.module.css";

const Dashboard = () => {
  return <div className={classes.fullcontainer}>
    
    <div className={classes.eventSec}>
      test
    </div>

    <div className={classes.nuggetSec}>
        <div className={classes.nuggetItem}>
            <div className={classes.profilePart}>
                <img className={classes.proImg} src={require("../../Assets/Images/png/sample_profile.png")}/>
            </div>
        </div>
    </div>
    
    <div className={classes.connectionSec}>df</div>

  </div>  ;
};

export default Dashboard;
