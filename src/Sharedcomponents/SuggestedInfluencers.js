import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { InfluencerListService } from "../Services/ApiService";
import { getAuthToken, JSONtoformdata } from "../Shared/Utility";
import { handleloginModalShow } from "../Store/Redux/Reducer/DashboardReducer";
import { setSessionStorageData } from "../Store/Storage";
import classes from "./SuggestedInfluencers.module.css";

const SuggestedInfluencers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [influencerList, setinfluencerList] = useState();
  const getInfluencerList = () => {
    let influencerData = {
      token: "RAWCAST",
      auth_code: getAuthToken("RAWCAST"),
      page_number: 1,
    };
    InfluencerListService(JSONtoformdata(influencerData))
      .then((res) => {
        if (res.data.status === 1) {
          setinfluencerList(res.data.users_list.slice(0, 10));
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    getInfluencerList();
  }, []);

  return (
    <div>
      <div className={classes.suggInfluencersSec}>
        <h3>Suggested accounts ({influencerList?.length})</h3>

        {influencerList?.map((ele) => {
          return (
            <div
              className={classes.suggAcc}
              onClick={() => {
                setSessionStorageData("influencerData", JSON.stringify(ele));
                dispatch(handleloginModalShow(true));
              }}
            >
              <img src={ele?.profile_img} />
              <p className={classes.name}>{ele?.display_name}</p>
              <br />
              {ele.category && ele.category.length !== 0 && (
                <p className={classes.username}>{ele.category.toString()}</p>
              )}
            </div>
          );
        })}
      </div>
      <div
        className={classes.seemoreSec}
        onClick={() => {
          setSessionStorageData("influencerData", "All");
          dispatch(handleloginModalShow(true));
        }}
      >
        See More <span class="material-icons">arrow_forward</span>
      </div>
    </div>
  );
};

export default SuggestedInfluencers;
