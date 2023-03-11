import React from "react";
import classes from "./Profile.module.css";
import { Button } from "react-bootstrap";

import {
  decodeHtml,
  getAuthToken,
  JSONtoformdata,
  ReadMore,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import {
  FollowandunfollowService,
  sendFriendRequestsService,
} from "../../Services/ApiService";
import { useAuthToken } from "../../Shared/Reduxfetcher";

const SearchProfile = ({ ele, setPeopleList, PeopleList }) => {
  const token = useAuthToken();
  const handleBecomeFan = (ele) => {
    let becameFanData = {
      token: token,
      auth_code: getAuthToken(token),
      follow_userid: ele.user_ref_id,
      type: 1,
    };
    FollowandunfollowService(JSONtoformdata(becameFanData))
      .then((res) => {
        if (res.data.status === 1) {
          let findIndex = PeopleList.findIndex(
            (elem) => elem.user_id === ele.user_id
          );
          let tempData = [...PeopleList];
          tempData[findIndex].follow = true;
          setPeopleList(tempData);
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleFriendRequest = (ele) => {
    let becameFanData = {
      token: token,
      auth_code: getAuthToken(token),
      user_ids: JSON.stringify([ele.user_id]),
    };
    sendFriendRequestsService(JSONtoformdata(becameFanData))
      .then((res) => {
        if (res.data.status === 1) {
          let findIndex = PeopleList.findIndex(
            (elem) => elem.user_id === ele.user_id
          );
          let tempData = [...PeopleList];

          // tempData[findIndex].follow = true;
          // setPeopleList(tempData);
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className={classes.profileContainer}>
      <div className={classes.leftSec}>
        <img src={ele.profile_img} />
      </div>
      <div className={classes.rightSec}>
        <div className={classes.nameSectop}>
          <div className={classes.nameSec}>
            <p>{decodeHtml(ele.display_name)}</p>
            {/* <span>@TheTweetOfGod</span> */}
          </div>
          <div className={classes.actionBtn}>
            {!ele?.follow && (
              <Button
                htmlType="Continue"
                size="large"
                className={classes.fanBtn}
                onClickCapture={() => {
                  handleBecomeFan(ele);
                }}
              >
                Become a Fan{" "}
                <span class="material-symbols-outlined">arrow_forward</span>
              </Button>
            )}
            <div className="d-none d-sm-block">
            <Button
              type="primary"
              htmlType="Continue"
              size="large"
              className={` ${classes.connectBtn}`}
              onClick={() => {
                handleFriendRequest(ele);
              }}
            >
              Request to connect{" "}
              <span class="material-symbols-outlined">arrow_forward</span>
            </Button>
            </div>
            <Button
              type="primary"
              htmlType="Continue"
              size="large"
              className={`d-block d-sm-none ${classes.connectBtn}`}
              onClick={() => {
                handleFriendRequest(ele);
              }}
            >
              <span class="material-symbols-outlined">add</span>
            </Button>
          </div>
        </div>
        <div className={classes.bioSec}>
          <p>
            <ReadMore>
              I’ve left Muskville. Come join Me at
              @TheTweetOfGod@universeodon.com. Still can’t help plugging My book
              “The Book of Pslam” out now: tinyurl.com/yckjn828
            </ReadMore>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchProfile;
