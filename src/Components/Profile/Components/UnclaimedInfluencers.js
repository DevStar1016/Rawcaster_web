import React, { useEffect } from "react";
import classes from "./ProfilerRight.module.css";
import { getfollowerfollowingService } from "./Utility";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthToken } from "../../../Shared/Reduxfetcher";
import { DecryptionString, EncryptionString } from "../../../Shared/Utility";
import { useNavigate, useParams } from "react-router";

const UnclaimedInfluencers = ({ isLoginUser }) => {
  const [InfluencerList, setInfluencerList] = useState({
    fans: [],
    count: 0,
  });
  const params = useParams();
  const display_user_id = DecryptionString(params.user_id);
  const loginToken = useAuthToken();
  const navigate = useNavigate();

  const getFollowers = () => {
    let fansList = {
      token: loginToken,
      type: 1,
    };
    if (!isLoginUser) {
      fansList = {
        ...fansList,
        user_id: display_user_id,
      };
    }
    getfollowerfollowingService(fansList)
      .then((res) => {
        setInfluencerList(res);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (InfluencerList.fans.length === 0) {
      getFollowers();
    }
  }, [loginToken]);

  return (
    <div className={classes.profileThumb}>
      <h2>
        Influencers ({InfluencerList.fans.length}) <span>See All</span>
      </h2>

      <div className={classes.listSec}>
        {InfluencerList?.fans?.map((ele) => {
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

export default UnclaimedInfluencers;
