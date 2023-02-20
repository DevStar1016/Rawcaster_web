import React, { useState } from "react";
import Postmodal from "../../Modal/Postmodal";
import classes from "./PostNuggets.module.css";
import sampleuser from "../../Assets/Images/svg/userImg.svg";
import cameraIcon from "../../Assets/Images/svg/camera.svg";
import imageIcon from "../../Assets/Images/svg/picture.svg";
import pollIcon from "../../Assets/Images/svg/thumb.svg";
import { Input } from "antd";

const PostNuggets = () => {
  const [postModalShow, setpostModalShow] = useState(false);

  return (
    <>
      <div className={classes.postNuggets}
        onClick={() => {
          setpostModalShow(true);
        }}
      >
       <div className={classes.searchUser}>
          <img src={sampleuser} />
          <Input placeholder="hey daniyal, share some nuggets..." className={classes.searchbar} />
          <div className={classes.iconSec}>
            <div className={classes.item}>
              <img src={cameraIcon}/> Video
            </div>
            <div className={classes.item}>
              <img src={imageIcon}/> Image
            </div>
            <div className={classes.item}>
              <img src={pollIcon}/> Poll
            </div>
          </div>
       </div>
      </div>
      <Postmodal
        visible={postModalShow}
        onClose={() => {
          console.log("tstysty");
          setpostModalShow(false);
        }}
      />
    </>
  );
};

export default PostNuggets;
