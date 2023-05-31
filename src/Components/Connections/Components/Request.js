import React from "react";
import { toast } from "react-hot-toast";
import { respondToFriendRequestsService } from "../../../Services/ApiService";
import { sendMessage } from "../../../Services/SocketService";
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
            const socketMes = {
              event: "friendresponse",
              receiverId: parseInt(request.user_id),
              data: data,
            };
            sendMessage(socketMes, "message");
            toast.success(
              `You and ${decodeHtml(
                res.data.friend_details.display_name
              )} connected`
            );
            onSuccess(res.data.friend_details);
          } else {
            toast.success(`Sucessfully rejected`);
            onReject();
          }
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {});
  };

  return (
    <div key={"request" + request.friend_request_id}>
      <div className={classes.list}>
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
          onClick={() => {
            handleRequest(1);
          }}
        >
          <i class="material-symbols-outlined">done</i>
        </div>
        <div
          className={classes.redicon}
          onClick={() => {
            handleRequest(2);
          }}
        >
          <i class="material-symbols-outlined">close</i>
        </div>
      </div>
    </div>
  );
};

export default Request;
