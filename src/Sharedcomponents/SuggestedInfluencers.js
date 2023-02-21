import React from "react";
import classes from "./SuggestedInfluencers.module.css";

const SuggestedInfluencers = () => {
  return <div className={classes.suggInfluencersSec}>
    <h3>Suggested accounts</h3>

    <div className={classes.suggAcc}>
      <img src={require("../Assets/Images/png/godfrey.png")}/>
      <p className={classes.name}>David.thomps <span class="material-icons">check_circle</span></p>
      <p className={classes.username}>david.rapper</p>
    </div>
    <div className={classes.suggAcc}>
      <img src={require("../Assets/Images/png/godfrey.png")}/>
      <p className={classes.name}>David.thomps <span class="material-icons">check_circle</span></p>
      <p className={classes.username}>david.rapper</p>
    </div>
    <div className={classes.suggAcc}>
      <img src={require("../Assets/Images/png/godfrey.png")}/>
      <p className={classes.name}>David.thomps <span class="material-icons">check_circle</span></p>
      <p className={classes.username}>david.rapper</p>
    </div>
    <div className={classes.suggAcc}>
      <img src={require("../Assets/Images/png/godfrey.png")}/>
      <p className={classes.name}>David.thomps <span class="material-icons">check_circle</span></p>
      <p className={classes.username}>david.rapper</p>
    </div>
 
  
  </div>;
};

export default SuggestedInfluencers;
