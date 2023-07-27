import React, { useEffect, useState } from "react";
import classes from "./Referel.module.css";
import { useAuthToken, useNuggets } from "../../Shared/Reduxfetcher";
import {
  InfluencerFollowService,
  InfluencerListService,
} from "../../Services/ApiService";
import {
  JSONtoformdata,
  decodeHtml,
  getAuthToken,
  getAuthenticated,
  handleProfileNavigate,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { defaultprofileImg } from "../../Shared/CommonConstants";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import EventLoaders from "../Loaders/EventLoaders";
import { Empty, Skeleton } from "antd";

const SuggestedAccounts = () => {
  const { nuggetFormData } = useNuggets();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useAuthToken();
  const [influencerList, setinfluencerList] = useState([]);
  const [isFetching, setisFetching] = useState(true);

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
          setinfluencerList([]);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setisFetching(false);
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
      .catch((err) => {});
  };

  return (
    <>
      {isFetching ? (
        <div className="mt-5 d-flex flex-column justify-content-center">
          {[...new Array(10)].map((ele) => {
            return <Skeleton active={true} avatar paragraph={{ rows: 1 }} />;
          })}
        </div>
      ) : (
        <div className={classes.suggInfluencersSec}>
          <h3>
            Suggested accounts{" "}
            {influencerList?.length ? `(${influencerList?.length})` : "(0)"}
          </h3>
          <div className={classes.scrollSec}>
            {influencerList?.map((ele) => {
              return (
                <div
                  className={classes.refuserList}
                  onClick={() => {
                    let finalData = {
                      dispatch,
                      navigate,
                      nuggetFormData,
                      user_id: ele.user_id,
                    };
                    handleProfileNavigate(finalData);
                  }}
                >
                  <div className={classes.suggAcc}>
                    <img
                      src={ele?.profile_img}
                      alt={"User_img"}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = defaultprofileImg;
                      }}
                    />
                    <div className="d-flex flex-column w-100">
                      <p className={classes.name}>
                        {decodeHtml(ele?.display_name)}
                      </p>
                      {ele.category && ele.category.length !== 0 && (
                        <p className={classes.username}>
                          {ele.category.toString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={classes.becameFan}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBecomeFan(ele);
                    }}
                  >
                    Became a fan
                  </div>
                  {/* )} */}
                </div>
              );
            })}

            {(influencerList?.length === 0 || !influencerList) && (
              <Empty style={{ marginTop: "40px" }} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SuggestedAccounts;
