import React from "react";
import classes from "./Nuggets.module.css";
import hearticon from "../Assets/Images/svg/heart.svg";
import commenticon from "../Assets/Images/svg/comment.svg";
import shareicon from "../Assets/Images/svg/share.svg";

const Nuggets = () => {
  return <div className={classes.nuggetSec}>
  
  <div className={classes.nuggetItem}>
      <div className={classes.profilePart}>
          <div className={classes.proImg}>
            <img src={require("../Assets/Images/png/sample_profile.png")}/>
            <i className={classes.viewCount}>52</i>
          </div>
          <p className={classes.proName}>Solodede</p>
          <p className={classes.detailsRange}>
            1 day ago <span class="material-icons">fiber_manual_record</span> 
            14 Views <span class="material-icons">fiber_manual_record</span> Public
          </p>
      </div>
      <div className={classes.contentSec}>
          <div className={classes.feedsSec}>
            <p>The richest man in the world, Elon Musk, has created a chip (Neuralink) that will be inserted into the human brain. He said that his prime motivation for Neuralink was the question: 'What do we do if there is a super intelligence that is much smarter than human beings? </p>
            <img className={classes.nuggetsFeed} src={require("../Assets/Images/png/nuggetfeed.png")}/>
          </div>
          <div className={classes.floattingSec}>
            <div className={classes.iconsec}>
                <p><img src={hearticon}/></p>
                <span>82.3K</span>
            </div>
            <div className={classes.iconsec}>
                <p><img src={commenticon}/></p>
                <span>172</span>
            </div>
            <div className={classes.iconsec}>
                <p><img src={shareicon}/></p>
                <span>726</span>
            </div>
          </div>
      </div>
  </div>

</div>;
};

export default Nuggets;
