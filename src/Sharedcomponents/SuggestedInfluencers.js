import { Button } from "antd";
import React from "react";
import classes from "./SuggestedInfluencers.module.css";
import GoogleIcon from "../Assets/Icons/png/google_logo.png";
import AppleIcon from "../Assets/Icons/png/apple_logo.png";


const SuggestedInfluencers = () => {
  return <div className={classes.suggInfluencersSec}>
     
     <div className={classes.advideoSec}>
     <img src={require("../Assets/Images/png/videoimg.png")}/>
     <h1>New to Rawcaster?</h1>
     <p>Sign up now to get your own space and post a Nuggets, talk shows, Events and more.</p>
     </div>

    <Button  className={classes.altSignBtn}><img src={GoogleIcon} /> Signup with Google</Button>
    <Button className={classes.altSignBtn}><img src={AppleIcon} /> Signup with Apple</Button>
    <Button className={classes.signupbtn}>Signup with a phone number or email</Button>

    </div>;
};

export default SuggestedInfluencers;
