import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import {
  useAuthToken,
  useDashboard,
  useNuggets,
} from "../../../Shared/Reduxfetcher";
import {
  DecryptionString,
  handleProfileNavigate,
} from "../../../Shared/Utility";
import classes from "../Profile.module.css";
import { useProfileContext } from "../../../Shared/Context";
import { getfollowerfollowingService } from "./Utility";
import { useDispatch } from "react-redux";

const FansThumb = ({ isLoginUser }) => {
  const { FansList, setFansList } = useProfileContext();
  const { nuggetFormData } = useNuggets();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginToken = useAuthToken();
  const params = useParams();
  const display_user_id = DecryptionString(params.user_id);

  const getFollowers = () => {
    let fansList = {
      token: loginToken,
      type: 2,
    };
    if (!isLoginUser) {
      fansList = {
        ...fansList,
        user_id: display_user_id,
      };
    }
    getfollowerfollowingService(fansList)
      .then((res) => {
        setFansList(res);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (parseInt(FansList.allconnectionscount) === 0 && loginToken) {
      getFollowers();
    } else if (params?.user_id) {
      getFollowers();
    }
  }, [loginToken, params]);

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
