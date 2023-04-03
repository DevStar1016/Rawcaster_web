import React from "react";
import classes from "./ProfilerRight.module.css";
import msgIcon from "../../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../../Assets/Images/svg/talkshowIcon.svg";
import { useProfileContext } from "../../../Shared/Context";
import { useNavigate } from "react-router";
import { EncryptionString } from "../../../Shared/Utility";
import { Skeleton } from "antd";

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

      {FansList.isLoaded ? (
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
      ) : (
        <div className={classes.listSec}>
          {[...Array(8)].map((ele) => {
            return (
              <div className={classes.list}>
                <Skeleton.Node
                  active={true}
                  style={{ height: "70px", width: "70px", borderRadius: 50 }}
                >
                  <img src={""} />
                </Skeleton.Node>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Fans;
