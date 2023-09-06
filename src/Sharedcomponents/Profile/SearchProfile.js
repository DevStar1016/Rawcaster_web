/**
 * A React component that represents a profile in a search result.
 * @param {Object} ele - The profile data object.
 * @param {function} setPeopleList - A function to update the list of people.
 * @param {Array} PeopleList - The list of people.
 * @returns A React component that displays the profile information.
 */
import React from "react";
import classes from "./Profile.module.css";
import { Button } from "react-bootstrap";
import {
  decodeHtml,
  getAuthToken,
  getisAddFriend,
  handleProfileNavigate,
  JSONtoformdata,
  ReadMore,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import {
  FollowandunfollowService,
  sendFriendRequestsService,
} from "../../Services/ApiService";
import {
  useAuthData,
  useAuthToken,
  useNuggets,
} from "../../Shared/Reduxfetcher";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { defaultprofileImg } from "../../Shared/CommonConstants";
import { friendRequestSocket } from "../../Services/SocketList";
import { replaceBiodataHandler } from "../../Components/Profile/Utility";

const SearchProfile = ({ ele, setPeopleList, PeopleList }) => {
  const navigate = useNavigate();
  const token = useAuthToken();
  const profileData = useAuthData();
  const dispatch = useDispatch();
  const { nuggetFormData } = useNuggets();
  /**
   * Handles the action of becoming a fan of a user.
   * @param {Object} ele - The element representing the user to become a fan of.
   * @returns None
   */
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
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
        } else if (res.data.status === 0) {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Handles sending a friend request to a user.
   * @param {Object} ele - The element containing user information.
   * @returns None
   */
  const handleFriendRequest = (ele) => {
    let finalData = {
      dispatch,
      navigate,
      nuggetFormData,
      user_id: ele.user_id,
    };
    let becameFanData = {
      token: token,
      auth_code: getAuthToken(token),
      user_ids: JSON.stringify([ele.user_ref_id]),
    };
    sendFriendRequestsService(JSONtoformdata(becameFanData))
      .then((res) => {
        if (res.data.status === 1) {
          let data = {
            friend_request_id: res.data.friend_request_ids[0],
            display_name: profileData.name,
            profile_img: profileData.profile_image,
            user_id: profileData.user_id,
          };

          handleProfileNavigate(finalData);
          friendRequestSocket(ele.user_id, data);
          let findIndex = PeopleList.findIndex(
            (elem) => elem.user_id === ele.user_id
          );
          let tempData = [...PeopleList];
          tempData[findIndex].friend_request_status = "0";
          setPeopleList(tempData);
          toast.success(res.data.msg);
        } else if (res.data.status === 0) {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Retrieves the bio data for the given element.
   * If the bio data is not available, it calls the replaceBiodataHandler function to generate it.
   * @returns The bio data for the element.
   */
  const getBioData = () => {
    if (ele.bio !== "") {
      return ele.bio;
    } else {
      return replaceBiodataHandler(ele);
    }
  };

  return (
    <div
      style={{
        cursor: "pointer",
      }}
      onClick={() => {
        let finalData = {
          dispatch,
          navigate,
          nuggetFormData,
          user_id: ele.user_id,
        };
        handleProfileNavigate(finalData);
      }}
      className={classes.profileContainer}
    >
      <div className={classes.leftSec}>
        <img
          src={ele.profile_img}
          alt={decodeHtml(ele.display_name)}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = defaultprofileImg;
          }}
        />
      </div>
      <div className={classes.rightSec}>
        <div
          className={classes.nameSectop}
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
          <div className={classes.nameSec}>
            <p>{decodeHtml(ele.display_name)}</p>
            {/* <span>@TheTweetOfGod</span> */}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={classes.actionBtn}
          >
            {!ele?.follow && (
              <Button
                htmlType="Continue"
                size="large"
                className={classes.fanBtn}
                onClickCapture={(e) => {
                  e.stopPropagation();
                  handleBecomeFan(ele);
                }}
              >
                Become a Fan{" "}
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            )}
            <div className="d-none d-md-block">
              {getisAddFriend(ele.friend_request_status) && (
                <Button
                  type="primary"
                  htmlType="Continue"
                  size="large"
                  className={` ${classes.connectBtn}`}
                  onClick={(e) => {
                    handleFriendRequest(ele);
                  }}
                >
                  Request to connect{" "}
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Button>
              )}
            </div>
            <Button
              type="primary"
              htmlType="Continue"
              size="large"
              className={`d-block d-md-none ${classes.connectBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                handleFriendRequest(ele);
              }}
            >
              <span className="material-symbols-outlined">add</span>
            </Button>
          </div>
        </div>
        <div
          className={classes.bioSec}
          onClick={(e) => {
            let finalData = {
              dispatch,
              navigate,
              nuggetFormData,
              user_id: ele.user_id,
            };
            handleProfileNavigate(finalData);
          }}
        >
          <p>
            <ReadMore isReadMoreValid={() => {}}>{getBioData()}</ReadMore>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchProfile;
