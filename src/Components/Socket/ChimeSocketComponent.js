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
import { SmileOutlined } from "@ant-design/icons";
const { Meta } = Card;

const ChimeSocketComponent = () => {
  const EventWindowRef = useEventWindow();
  const userData = useAuthData();
  const { muted } = useLocalVideo();
  const { isVideoEnabled } = useToggleLocalMute();
  const { ref_id } = useParams();
  const { emit } = useEvent();

  // Trigger Invite notification
  const inviteMessage = (data) => {
    const sender_id = data.sender_id;
    const targetId = data.meeting_attendee_list?.filter(
      (ele) =>
        String(ele.user_id) === String(userData?.user_id) &&
        String(sender_id) !== String(userData?.user_id)
    );

    if (targetId?.length) {
      const key = `open${Date.now()}`;
      const btn = (
        <Space>
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
              window.open(`${data.meeting_link}`, "_blank", { popup: true });
            }}
          >
            Accept
          </Button>
        </Space>
      );
      notification.open({
        message: 'Invite Call',
        description: (
          <Card
            style={{
              width: 300,
              marginTop: 16,
            }}
          >
            <Meta
              avatar={<Avatar src={`${data.profile_image}`} />}
              title={`${data.sender_name} `}
              description={`is calling you to ${data.meeting_type} meeting `}
            />
          </Card>
        ),
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        // icon: (
        //   <Avatar src={<img src={userData.profile_image}></img>} />
        // ),
        placement: "bottomLeft",
        btn,
        key,
        onClose: () => {
        },
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
