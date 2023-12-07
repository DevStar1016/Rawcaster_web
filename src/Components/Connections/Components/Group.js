/**
 * A React component that represents a group in a connections list.
 * @param {Object} group - The group object containing information about the group.
 * @param {string} searchInput - The search input used to filter the groups.
 * @param {function} onClick - The function to be called when the group is clicked.
 * @returns A React component representing a group in a connections list.
 */
import React, { useState } from "react";
import { Tooltip } from "antd";
import {
  JSONtoformdata,
  decodeHtml,
  getAuthToken,
  filterValidObject,
  instantCall,
} from "../../../Shared/Utility";
import classes from "../Connections.module.css";
import videocall from "../../../Assets/Icons/svg/videocall.svg";
import audiocall from "../../../Assets/Icons/svg/audiocall.svg";
import chatIcon from "../../../Assets/Icons/svg/Chats/chat_icon.svg";
import { useMainContext } from "../../../Shared/Context";
import {
  useAuth,
  useAuthData,
  useAuthToken,
  useSettings,
} from "../../../Shared/Reduxfetcher";
import { AutoChannelCreateService } from "../../../Services/ApiService";
import { useDispatch } from "react-redux";
import { handleUpdateGroupArnData } from "../../../Store/Redux/Reducer/DashboardReducer";
import { Spinner } from "react-bootstrap";
import { defaultGroupImg } from "../../../Shared/CommonConstants";
import { IS_CHIME_ENABLE } from "../../../Shared/Constant";
import { handleEventWindowRef } from "../../../Store/Redux/Reducer/UtilityReducer";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { nanoid } from "@reduxjs/toolkit";
import { addEventService } from "../../../Services/ApiService";
import { toast } from "react-hot-toast";

const Group = ({ group, searchInput, onClick }) => {
  const { setisChatOpen } = useMainContext();
  const [isFetching, setisFetching] = useState(false);
  const dispatch = useDispatch();
  const token = useAuthToken();
  const userData = useAuthData();
  const userSettings = useSettings();

  const HandleGroupCreate = () => {
    setisFetching(group.group_id);
    const FormData = {
      token,
      group_id: group.group_id,
    };
    AutoChannelCreateService(JSONtoformdata(FormData))
      .then((res) => {
        if (res.data.status === 1) {
          dispatch(
            handleUpdateGroupArnData({
              id: group.group_id,
              channel_arn: res.data.channel_arn,
            })
          );
          setisChatOpen({
            show: true,
            type: "group",
            id: group.group_id,
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
          if (onClick) {
            onClick();
          }
        }}
        style={{
          position: "relative",
          display: decodeHtml(group.group_name)
            .toLowerCase()
            .includes(searchInput.toLowerCase())
            ? "block"
            : "none",
        }}
        id={"groups_" + group.group_id}
      >
        <div className={classes.list}>
          <img
            src={group.group_icon}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = defaultGroupImg;
            }}
            alt={decodeHtml(group.group_name)}
          />
          <div>
            <p className={classes.groupdisName}>
              {decodeHtml(group.group_name)}
            </p>
            <span className={classes.groupdisName}>
              {group?.group_member_count + " Members"}
            </span>
          </div>
        </div>
        {IS_CHIME_ENABLE && (
          <div className={`${classes.friendsmenu}`}>
            <Tooltip title={"Video call"} color={"#F7965B"}>
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
                    group.group_members_list,
                    HandlePopup
                  );
                }}
              />
            </Tooltip>
            <Tooltip title={"Audio call"} color={"#F7965B"}>
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
                    group.group_members_list,
                    HandlePopup
                  );
                }}
              />
            </Tooltip>

            <Tooltip title={"Group chat"} color={"#F7965B"}>
              {isFetching === group.group_id ? (
                <Spinner size="sm" className="ms-2" />
              ) : (
                <img
                  src={chatIcon}
                  alt={"Group Chat"}
                  onClick={(event) => {
                    if (!isFetching) {
                      event.stopPropagation();
                      if (
                        group.my_group === 1 &&
                        (!group.channel_arn || group.channel_arn === "")
                      ) {
                        HandleGroupCreate();
                      } else {
                        setisChatOpen({
                          show: true,
                          type: "group",
                          id: group.group_id,
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

export default Group;
