import React, { useEffect } from "react";
import classes from "./ProfilerRight.module.css";
import { getfollowerfollowingService } from "./Utility";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthToken } from "../../../Shared/Reduxfetcher";
import { DecryptionString, EncryptionString } from "../../../Shared/Utility";
import { useNavigate, useParams } from "react-router";
import { Skeleton } from "antd";

const UnclaimedInfluencers = ({ isLoginUser }) => {
  const [InfluencerList, setInfluencerList] = useState({
    fans: [],
    count: 0,
    isLoaded: false,
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
        Influencers ({InfluencerList.fans.length}){" "}
        {InfluencerList?.fans.length > 8 && <span>See All</span>}
      </h2>

      {InfluencerList.isLoaded ? (
        <div className={classes.listSec}>
          {InfluencerList.fans.map((ele) => {
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

export default UnclaimedInfluencers;
