import React from "react";
import classes from "./ProfilerRight.module.css";
import msgIcon from "../../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../../Assets/Images/svg/talkshowIcon.svg";
import { useProfileContext } from "../../../Shared/Context";
import { useNavigate } from "react-router";
import { EncryptionString } from "../../../Shared/Utility";

const Fans = () => {
  const { FansList } = useProfileContext();
  const navigate = useNavigate();
  return (
    <div className={classes.profileThumb}>
      <h2>
        Fans ({FansList.fans.length})
        <img className={classes.actionIcon} src={msgIcon} />
        <img className={classes.actionIcon} src={talkshowIcon} />
        {FansList.fans.length > 8 && <span>See All</span>}
      </h2>

      <div className={classes.listSec}>
        {FansList.fans.map((ele) => {
          return (
            <div
              className={classes.list}
              onClick={() => {
                navigate(`/viewprofile/${EncryptionString(ele.user_id)}`);
              }}
            >
              <img src={ele.profile_img} />
              <p>{ele?.display_name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Fans;
