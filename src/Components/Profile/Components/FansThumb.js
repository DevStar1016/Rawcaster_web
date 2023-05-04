import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { useAuthToken, useNuggets } from "../../../Shared/Reduxfetcher";
import {
  DecryptionString,
  handleProfileNavigate,
} from "../../../Shared/Utility";
import classes from "../Profile.module.css";
import { useProfileContext } from "../../../Shared/Context";
import { useDispatch } from "react-redux";

const FansThumb = () => {
  const { FansList, setFansList, getFollowers } = useProfileContext();
  const { nuggetFormData } = useNuggets();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginToken = useAuthToken();

  useEffect(() => {
    if (parseInt(FansList.allconnectionscount) === 0 && loginToken) {
      getFollowers();
    }
  }, [loginToken, FansList]);

  return (
    <div className={classes.fansList}>
      {FansList.connections?.map((ele) => (
        <img
          className={classes.thumbImg}
          src={ele.profile_img}
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
