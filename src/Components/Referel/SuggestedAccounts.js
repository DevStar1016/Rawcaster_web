import React, { useEffect, useState } from "react";
import classes from "./Referel.module.css";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import {
  InfluencerFollowService,
  InfluencerListService,
} from "../../Services/ApiService";
import {
  JSONtoformdata,
  decodeHtml,
  getAuthToken,
  getAuthenticated,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { Col, Row } from "react-bootstrap";
import { defaultprofileImg } from "../../Shared/CommonConstants";

const SuggestedAccounts = () => {
  const token = useAuthToken();
  const [influencerList, setinfluencerList] = useState();
  const getInfluencerList = () => {
    let influencerData = {
      token: token,
      auth_code: getAuthToken(token),
      page_number: 1,
    };
    InfluencerListService(JSONtoformdata(influencerData))
      .then((res) => {
        if (res.data.status === 1) {
          setinfluencerList(res.data.users_list);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (getAuthenticated()) {
      getInfluencerList();
    }
  }, []);

  const handleBecomeFan = (ele) => {
    let becameFanData = {
      token: token,
      auth_code: getAuthToken(token),
      follow_userid: JSON.stringify([ele?.user_ref_id]),
    };
    InfluencerFollowService(JSONtoformdata(becameFanData))
      .then((res) => {
        if (res.data.status === 1) {
          getInfluencerList();
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className={classes.suggInfluencersSec}>
      <h3>Suggested accounts ({influencerList?.length})</h3>
      <div className={classes.scrollSec}>
        {influencerList?.map((ele) => {
          return (
            <div className={classes.refuserList}>
                <div className={classes.suggAcc}>
                  <img
                    src={ele?.profile_img}
                    alt={ele?.display_name}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = defaultprofileImg;
                    }}
                  />
                  <p className={classes.name}>
                    {decodeHtml(ele?.display_name)}
                  </p>
                  <br />
                  {ele.category && ele.category.length !== 0 && (
                    <p className={classes.username}>
                      {ele.category.toString()}
                    </p>
                  )}
                </div>  
                <div
                  className={classes.becameFan}
                  onClick={() => {
                    handleBecomeFan(ele);
                  }}
                >
                  Became a fan
                </div>            
              {/* )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedAccounts;
