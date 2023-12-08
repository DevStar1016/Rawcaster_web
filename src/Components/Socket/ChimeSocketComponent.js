import {
  ChimesendMessage,
  ChimesocketListen,
} from "../../Services/SocketService";
import { Outlet, useParams } from "react-router";
import { useEffect, useState } from "react";
import { CHIME_SOCKET_EVENTS } from "../../Services/ServiceConstants";
import { useAuthData, useEventWindow } from "../../Shared/Reduxfetcher";
import {
  useLocalVideo,
  useToggleLocalMute,
} from "amazon-chime-sdk-component-library-react";
import { useEvent } from "../../Sharedcomponents/EventProvider";
import { Button, notification, Space, Avatar, Card } from "antd";
import { handleEventWindowRef } from "../../Store/Redux/Reducer/UtilityReducer";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
const { Meta } = Card;

const ChimeSocketComponent = () => {
  const EventWindowRef = useEventWindow();
  const userData = useAuthData();
  const dispatch = useDispatch();
  const { muted } = useLocalVideo();
  const { isVideoEnabled } = useToggleLocalMute();
  const { ref_id } = useParams();
  const { emit } = useEvent();

  const HandlePopup = (data) => {
    const EventWindowRef = window.open(`/room/${data?.reference_id}`, "_blank", {
      popup: true,
    });
    dispatch(handleEventWindowRef(EventWindowRef));

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
          userId: userData?.user_id,
          userRefId: userData?.user_ref_id ?? nanoid(),
          refId: data?.reference_id,
          name: userData?.name,
          image: userData?.profile_image,
        },
        CHIME_SOCKET_EVENTS.JOIN_REQUEST
      );
    };

    EventWindowRef.onclose = (e) => {
      e.stopPropagation();
    };
    // when the popup unloads
  };

  // Trigger Invite notification
  const inviteMessage = (data) => {
    const sender_id = data.original_user_id;
    const targetId = data.invite_friends_id?.filter(
      (ele) =>
        String(ele) === String(userData?.user_id) &&
        String(sender_id) !== String(userData?.user_id)
    );
    if (targetId?.length) {
      const key = `open${Date.now()}`;
      const btn = (
        <Space style={{marginBottom: 10, marginLeft:'auto', marginRight:'auto' }}>
          <Button
            type="link"
            size="middle"
            shape="round"
            onClick={() => notification.destroy()}
          >
            Decline
          </Button>
          <Button
            type="primary"
            size="middle"
            shape="round"
            onClick={() => {
              notification.destroy();
              HandlePopup(data);
              }
            }
          >
            Accept
          </Button>
        </Space>
      );
      notification.open({
        message: '',
        description: (
          <Card
            style={{
              width: 300,
              marginLeft: 30,
              marginTop: 30,
              marginBottom: 10,
            }}
            cover={
              <img
              alt="image"
              src={require("../../Assets/Images/notification_back.jpg")}></img>
            }
          >
            <Meta
              avatar={<Avatar src={`${data?.profile_image}`} />}
              title={`${data.sender_name} `}
              description={`is calling you to ${data.meeting_type} meeting `}
            />
          </Card>
        ),
        placement: "bottomLeft",
        btn,
        key,
        duration: 10,
        onClose: () => {},
      });
    }
  };

  // Socket Emitter from Parent Window to Child Window

  const HandleSendToNewWindow = (type, message) => {
    if (EventWindowRef) {
      const EventData = {
        type: type,
        message: message,
      };
      EventWindowRef.postMessage(EventData, "*");
    }
  };

  // Connect Socket URL

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.CONNECT_SOCKET, () => {
      if (!ref_id && userData) {
        ChimesendMessage(
          { userId: userData.user_id },
          CHIME_SOCKET_EVENTS.JOIN_SOCKET
        );
      }
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.CONNECT_SOCKET);
    };
  }, [userData]);

  //  Notifications Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.NOTIFICATIONS, (message) => {
      if (message.type === "InviteCall") {
        emit(message.type, message.event_detail);
        inviteMessage(message.event_detail);
      } else if (message && message.type) {
        emit(message.type, message);
      }
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.NOTIFICATIONS);
    };
  }, [userData, emit]);

  //  Join Request From Attendees to Host Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER,
      (message) => {
        HandleSendToNewWindow(
          CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER,
          message
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER);
    };
  }, [EventWindowRef]);

  //  New User Joined Status Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING,
      (message) => {
        HandleSendToNewWindow(
          CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING,
          message
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING);
    };
  }, [EventWindowRef]);

  // Join Request Answer For new Joined user Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER, (message) => {
      if (EventWindowRef) {
        HandleSendToNewWindow(CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER, message);
      }
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER);
    };
  }, [EventWindowRef]);

  // Meeting In-call events Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS,
      (message) => {
        HandleSendToNewWindow(
          CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS,
          message
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS);
    };
  }, [isVideoEnabled, muted, EventWindowRef]);

  // Meeting Raise Hand status Received Here - Socket

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND, (message) => {
      HandleSendToNewWindow(CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND, message);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND);
    };
  }, [EventWindowRef]);

  // Renamed user data Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER, (message) => {
      HandleSendToNewWindow(CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER, message);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER);
    };
  }, [EventWindowRef]);

  // Screen share Enable/Disable Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER,
      (message) => {
        HandleSendToNewWindow(
          CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER,
          message
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER);
    };
  }, [EventWindowRef]);

  // Audio Enable/Disable Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER, (message) => {
      HandleSendToNewWindow(CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER, message);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER);
    };
  }, [EventWindowRef]);

  // View Status Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER,
      (message) => {
        HandleSendToNewWindow(
          CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER,
          message
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER);
    };
  }, [EventWindowRef]);

  // Meeting Ended Status Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.END_MEETING_ANSWER, (message) => {
      HandleSendToNewWindow(CHIME_SOCKET_EVENTS.END_MEETING_ANSWER, message);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.END_MEETING_ANSWER);
    };
  }, [EventWindowRef]);

  // Attendee Kicked Status Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.KICK_USER_ANSWER, (message) => {
      HandleSendToNewWindow(CHIME_SOCKET_EVENTS.KICK_USER_ANSWER, message);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.KICK_USER_ANSWER);
    };
  }, [EventWindowRef]);

  // Message in Meeting Room Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG, (message) => {
      HandleSendToNewWindow(CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG, message);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG);
    };
  }, [EventWindowRef]);

  // Video Enable/Disable Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.ENABLE_VIDEO_ANSWER, (message) => {
      HandleSendToNewWindow(CHIME_SOCKET_EVENTS.ENABLE_VIDEO_ANSWER, message);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.ENABLE_VIDEO_ANSWER);
    };
  }, [EventWindowRef]);

  // Promote Host Statue Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.MAKE_HOST_ANSWER, (message) => {
      HandleSendToNewWindow(CHIME_SOCKET_EVENTS.MAKE_HOST_ANSWER, message);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MAKE_HOST_ANSWER);
    };
  }, [EventWindowRef]);

  // Remove Host Statue Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.REMOVE_HOST_ANSWER, (message) => {
      HandleSendToNewWindow(CHIME_SOCKET_EVENTS.REMOVE_HOST_ANSWER, message);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.REMOVE_HOST_ANSWER);
    };
  }, [EventWindowRef]);

  // Join Request Response Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.HANDLE_ACCEPT_REJECT_JOIN_REQUEST,
      (message) => {
        HandleSendToNewWindow(
          CHIME_SOCKET_EVENTS.HANDLE_ACCEPT_REJECT_JOIN_REQUEST,
          message
        );
      }
    );
    return () => {
      ChimesocketListen.off(
        CHIME_SOCKET_EVENTS.HANDLE_ACCEPT_REJECT_JOIN_REQUEST
      );
    };
  }, [EventWindowRef]);

  // Reaction in Talkshow Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.POST_REACTION_ANSWER,
      (message) => {
        if (EventWindowRef) {
          HandleSendToNewWindow(
            CHIME_SOCKET_EVENTS.POST_REACTION_ANSWER,
            message
          );
        }
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.POST_REACTION_ANSWER);
    };
  }, [EventWindowRef]);

  // End Event Meeting Alert Received Here - Socket
  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.END_MEETING_ALERT_ANSWER,
      (message) => {
        if (EventWindowRef) {
          HandleSendToNewWindow(
            CHIME_SOCKET_EVENTS.END_MEETING_ALERT_ANSWER,
            message
          );
        }
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.END_MEETING_ALERT_ANSWER);
    };
  }, [EventWindowRef]);

  return <Outlet />;
};

export default ChimeSocketComponent;
