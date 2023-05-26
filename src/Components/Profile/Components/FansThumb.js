import React from "react";
import { useNavigate } from "react-router";
import { useNuggets } from "../../../Shared/Reduxfetcher";
import { handleProfileNavigate } from "../../../Shared/Utility";
import classes from "../Profile.module.css";
import { useProfileContext } from "../../../Shared/Context";
import { useDispatch } from "react-redux";
import { defaultprofileImg } from "../../../Shared/CommonConstants";

const FansThumb = () => {
  const { FansList, setFansList } = useProfileContext();
  const { nuggetFormData } = useNuggets();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className={classes.fansList}>
      {FansList.connections?.map((ele) => (
        <img
          className={classes.thumbImg}
          alt="User_img"
          src={ele.profile_img ? ele.profile_img : ""}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = defaultprofileImg;
          }}
          onClick={() => {
            let finalData = {
              dispatch,
              navigate,
              nuggetFormData,
              user_id: ele.user_id,
            };
            handleProfileNavigate(finalData);
            setFansList({
              connections: [],
              allconnections: [],
              connectionscount: 0,
              allconnectionscount: 0,
              isLoaded: true,
            });
          }}
        />
      ))}
      {FansList.connectionscount !== 0 && (
        <div className={classes.count}>{FansList.connectionscount}</div>
      )}
    </div>
  );
};

export default FansThumb;
