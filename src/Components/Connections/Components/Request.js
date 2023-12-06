/**
 * A React component that represents a friend request.
 * @param {Object} request - The friend request object.
 * @param {Function} setrequests - A function to update the list of friend requests.
 * @param {Function} onSuccess - A callback function to be called when the friend request is accepted successfully.
 * @param {Function} onReject - A callback function to be called when the friend request is rejected.
 * @returns A React component that displays the friend request and handles the response.
 */
import React from "react";
import { toast } from "react-hot-toast";
import { respondToFriendRequestsService } from "../../../Services/ApiService";
import {
  useAuthData,
  useAuthToken,
  useNuggets,
} from "../../../Shared/Reduxfetcher";
import {
  decodeHtml,
  handleProfileNavigate,
  JSONtoformdata,
} from "../../../Shared/Utility";
import classes from "../Connections.module.css";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
const Request = ({ request, setrequests, onSuccess, onReject }) => {
  const token = useAuthToken();
  const profileData = useAuthData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nuggetFormData } = useNuggets();

  /**
   * Handles a friend request by sending a response to the server.
   * @param {number} action - The action to take on the friend request (1 for accept, 0 for reject).
   * @returns None
   */
  const handleRequest = (action) => {
    let respondData = {
      token: token,
      friend_request_id: request.friend_request_id,
      response: action,
    };
    respondToFriendRequestsService(JSONtoformdata(respondData))
      .then((res) => {
        if (res.data.status === 1) {
          setrequests((pre) =>
            pre.filter(
              (ele) => ele.friend_request_id !== request.friend_request_id
            )
          );
          if (action === 1) {
            let data = {
              friend_request_id: request.friend_request_id,
              user_id: profileData.user_id,
              email_id: profileData.email_id,
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              display_name: profileData.name,
              gender: profileData.gender,
              profile_img: profileData.profile_image,
              online: 1,
              last_seen: "",
              typing: 0,
              unreadmsg: 0,
              login_from_app: 0,
              login_from_web: 1,
              login_from: 1,
            };

            toast.remove("rawcaster");
            toast.success(
              `You and ${decodeHtml(
                res.data.friend_details.display_name
              )} connected`,
              { id: "rawcaster" }
            );
            onSuccess(res.data.friend_details);
          } else {
            toast.remove("rawcaster");
            toast.success(res.data.msg, { id: "rawcaster" });
            onReject();
          }
        } else {
          toast.remove("Error");
          toast.error(res.data.msg, {
            id: "Error",
          });
        }
      })
      .catch((err) => {});
  };

  return (
    <div key={"request" + request.friend_request_id}>
      <div
        onClick={() => {
          let finalData = {
            dispatch,
            navigate,
            nuggetFormData,
            user_id: request.user_id,
          };
          handleProfileNavigate(finalData);
        }}
        className={classes.list}
      >
        <img
          src={request.profile_img ? request.profile_img : ""}
          onClick={() => {
            let finalData = {
              dispatch,
              navigate,
              nuggetFormData,
              user_id: request.user_id,
            };
            handleProfileNavigate(finalData);
          }}
          alt={decodeHtml(request.display_name)}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = defaultprofileImg;
          }}
        ></img>
        <span className={classes.disName}>
          {request.display_name.length > 18
            ? decodeHtml(request.display_name.substring(0, 15)) + "..."
            : decodeHtml(request.display_name)}
        </span>

        <div
          className={classes.greenicon}
          onClick={(e) => {
            e.stopPropagation();
            handleRequest(1);
          }}
        >
          <i className="material-symbols-outlined">done</i>
        </div>
        <div
          className={classes.redicon}
          onClick={(e) => {
            e.stopPropagation();
            handleRequest(2);
          }}
        >
          <i className="material-symbols-outlined">close</i>
        </div>
      </div>
    </div>
  );
};

export default Request;
