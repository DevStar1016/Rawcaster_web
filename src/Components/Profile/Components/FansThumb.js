import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { getFollowListService } from "../../../Services/ApiService";
import { useAuthToken } from "../../../Shared/Reduxfetcher";
import {
  DecryptionString,
  EncryptionString,
  JSONtoformdata,
} from "../../../Shared/Utility";
import classes from "../Profile.module.css";

const FansThumb = ({ isLoginUser }) => {
  const navigate = useNavigate();
  const loginToken = useAuthToken();
  const params = useParams();
  const display_user_id = DecryptionString(params.user_id);
  const [FansList, setFansList] = useState({
    fans: [],
    count: 0,
  });

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
    getFollowListService(JSONtoformdata(fansList))
      .then((res) => {
        if (res.data.status === 1) {
          const getFansCount = () => {
            if (parseInt(res.data.follow_count) > 8) {
              return parseInt(res.data.follow_count) - 8;
            } else {
              return 0;
            }
          };
          setFansList({
            fans: res.data.follow_list.slice(0, 8),
            count: getFansCount(),
          });
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (FansList.fans.length === 0 && loginToken) {
      getFollowers();
    } else {
      getFollowers();
    }
  }, [loginToken, params]);

  return (
    <div className={classes.fansList}>
      {FansList.fans?.map((ele) => (
        <img
          className={classes.thumbImg}
          src={ele.profile_img}
          onClick={() => {
            navigate(`/viewprofile/${EncryptionString(ele.user_id)}`);
          }}
        />
      ))}
      {FansList.count !== 0 && (
        <div className={classes.count}>{FansList.count}</div>
      )}
    </div>
  );
};

export default FansThumb;
