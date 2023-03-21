import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { getFollowListService } from "../../../Services/ApiService";
import { useAuthToken } from "../../../Shared/Reduxfetcher";
import { JSONtoformdata } from "../../../Shared/Utility";
import classes from "../Profile.module.css";

const FansThumb = () => {
  const navigate = useNavigate();
  const loginToken = useAuthToken();
  const [FansList, setFansList] = useState({
    fans: [],
    count: 0,
  });

  const getFollowers = () => {
    let fansList = {
      token: loginToken,
      type: 2,
    };
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
    }
  }, [loginToken]);

  return (
    <div className={classes.fansList}>
      {FansList.fans?.map((ele) => (
        <img
          className={classes.thumbImg}
          src={ele.profile_img}
          onClick={() => {
            navigate(`/viewprofile/${ele.user_id}`);
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
