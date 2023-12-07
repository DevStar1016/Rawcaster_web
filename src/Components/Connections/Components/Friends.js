/**
 * A functional component that represents a friend in a friends list.
 * @param {Object} friend - The friend object containing information about the friend.
 * @param {string} searchInput - The search input used to filter the friends list.
 * @returns The JSX representation of a friend in the friends list.
 */
import { Tooltip } from "antd";
import {
  JSONtoformdata,
  decodeHtml,
  handleProfileNavigate,
  instantCall,
} from "../../../Shared/Utility";
import classes from "../Connections.module.css";
import videocall from "../../../Assets/Icons/svg/videocall.svg";
import audiocall from "../../../Assets/Icons/svg/audiocall.svg";
import chatIcon from "../../../Assets/Icons/svg/Chats/chat_icon.svg";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  useAuthData,
  useAuthToken,
  useNuggets,
  useSettings,
} from "../../../Shared/Reduxfetcher";
import { useMainContext } from "../../../Shared/Context";
import { AutoIndividualCreateService } from "../../../Services/ApiService";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { handleUpdateIndividualArnData } from "../../../Store/Redux/Reducer/DashboardReducer";
import { IS_CHIME_ENABLE } from "../../../Shared/Constant";
import { handleEventWindowRef } from "../../../Store/Redux/Reducer/UtilityReducer";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { addEventService } from "../../../Services/ApiService";
import { filterValidObject } from "../../../Shared/Utility";
import { nanoid } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const Friends = ({ friend, searchInput }) => {
  const { setisChatOpen } = useMainContext();
  const [isFetching, setisFetching] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nuggetFormData } = useNuggets();
  const token = useAuthToken();
  const userData = useAuthData();
  const userSettings = useSettings();

  const HandleIndividualCreate = () => {
    setisFetching(friend.user_id);
    const FormData = {
      token,
      friend_request_id: friend.friend_request_id,
    };
    AutoIndividualCreateService(JSONtoformdata(FormData))
      .then((res) => {
        if (res.data.status === 1) {
          dispatch(
            handleUpdateIndividualArnData({
              id: friend.user_id,
              channel_arn: res.data.channel_arn,
            })
          );
          setisChatOpen({
            show: true,
            type: "friend",
            id: friend.user_id,
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        setisFetching(false);
      });
  };

  /**
   * Handles the opending and manipulation of a popup window for a instant call
   * @param {Object} data - Add private event param
   * @returns None
   */

  const HandlePopup = (data) => {
    const EventWindowRef = window.open("", "_blank", { popup: true });
    addEventService(JSONtoformdata(filterValidObject(data)))
      .then((res) => {
        if (res.data.status === 1) {
          EventWindowRef.location.href = `${window.location.origin}/room/${res.data.ref_id}`;
          dispatch(EventWindowRef);
          ChimesendMessage(
            {
              type: "InviteCall",
              event_detail: {
                sender_id: userData.user_id,
                sender_name: userData.name,
                profile_image: userData.profile_image,
                meeting_link: `${window.location.origin}/room/${res.data.ref_id}`,
                meeting_attendee_list: data.user_id_list,
                meeting_type: data.event_screenshare === 0 ? "Audio" : "Video",
              },
            },
            CHIME_SOCKET_EVENTS.NOTIFICATIONS
          );
        } else {
          toast.remove("Error");
          toast.error(res.data.msg, {
            id: "Error",
          });
        }
      })
      .catch((err) => {
        console.error("Errors occured in instant-call", err);
      });

    EventWindowRef.onload = () => {
      const EventData = {
        type: "EventData",
        message: data,
      };
      EventWindowRef.postMessage(EventData, "*");
      ChimesendMessage(
        { refId: data?.reference_id },
        CHIME_SOCKET_EVENTS.JOIN_MEETING_ROOM
      );
      ChimesendMessage(
        {
          userId: userData.user_id,
          userRefId: userData.user_ref_id ?? nanoid(),
          refId: data?.reference_id,
          name: userData?.name,
          image: userData?.profile_image,
        },
        CHIME_SOCKET_EVENTS.JOIN_REQUEST
      );
    };

    EventWindowRef.onclose = (e) => {
      e.stopPropagation();
    }
  };

  return (
    <>
      <div
        className={classes.friendslist}
        onClick={() => {
          let finalData = {
            dispatch,
            navigate,
            nuggetFormData,
            user_id: friend.user_id,
          };
          handleProfileNavigate(finalData);
        }}
        style={{
          position: "relative",
          display: decodeHtml(friend.display_name)
            .toLowerCase()
            .includes(searchInput.toLowerCase())
            ? "block"
            : "none",
        }}
        id={"friends_" + friend.user_id}
      >
        <div className={classes.list}>
          <img
            src={friend?.profile_img ? friend?.profile_img : ""}
            alt={decodeHtml(friend.display_name)}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = defaultprofileImg;
            }}
          />
          {friend.online !== "" ? (
            <i
              className={friend.online === 1 ? classes.online : classes.offline}
            ></i>
          ) : null}

          <span className={classes.disName}>
            {decodeHtml(friend.display_name)}
          </span>
          {friend.online == 1 ? (
            <div className={classes.userlogedin_icon}>
              <i
                className="material-icons"
                style={{
                  display:
                    friend.login_from_app === 1 ? "inline-block" : "none",
                  fontSize: "16px",
                }}
              >
                phone_iphone
              </i>
              <i
                className="material-icons"
                style={{
                  display:
                    friend.login_from_web === 1 ? "inline-block" : "none",
                  fontSize: "16px",
                }}
              >
                desktop_mac
              </i>
            </div>
          ) : null}
        </div>

        {IS_CHIME_ENABLE && (
          <div
            id={"menu_" + friend.user_id}
            className={`${classes.friendsmenu}`}
          >
            <Tooltip
              title={"Video call"}
              color={friend.online ? "#5dbc3a" : "#F7965B"}
            >
              <img
                src={videocall}
                alt={"video call"}
                onClick={(e) => {
                  e.stopPropagation();
                  instantCall(
                    token,
                    userData,
                    userSettings,
                    "Video",
                    [].concat(friend),
                    HandlePopup
                  );
                }}
              />
            </Tooltip>
            <Tooltip
              title={"Audio call"}
              color={friend.online ? "#5dbc3a" : "#F7965B"}
            >
              <img
                src={audiocall}
                alt={"audio call"}
                onClick={(e) => {
                  e.stopPropagation();
                  instantCall(
                    token,
                    userData,
                    userSettings,
                    "Audio",
                    [].concat(friend),
                    HandlePopup
                  );
                }}
              />
            </Tooltip>
            <Tooltip
              title={"chat"}
              color={friend.online ? "#5dbc3a" : "#F7965B"}
            >
              {isFetching === friend.user_id ? (
                <Spinner size="sm" className="ms-2" />
              ) : (
                <img
                  src={chatIcon}
                  alt={"Group Chat"}
                  onClick={(event) => {
                    if (!isFetching) {
                      event.stopPropagation();
                      if (!friend.channel_arn || friend.channel_arn === "") {
                        HandleIndividualCreate();
                      } else {
                        setisChatOpen({
                          show: true,
                          type: "friend",
                          id: friend.user_id,
                        });
                      }
                    }
                  }}
                />
              )}
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
};

export default Friends;
