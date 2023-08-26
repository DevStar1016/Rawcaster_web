import { useEffect } from "react";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { Button, Modal } from "antd";
import { useEventRoomContext } from "../../../Shared/Context";
import {
  useLocalVideo,
  useToggleLocalMute,
} from "amazon-chime-sdk-component-library-react";
import { EndAttendeeMeeting } from "../Components/Methods";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { defaultVolume } from "../Configure/Constants";
import { MessageOutlined } from "@ant-design/icons";

const MeetingManagerComponent = () => {
  const {
    RequestRef,
    setnotificationToast,
    setisChatorParticipant,
    handleJoinMeeting,
    setEventData,
    EventData,
    setattendeesList,
    setRequestStatusMessage,
    RequestStatusMessage,
    setEventMessages,
    EventMessages,
    setuserdata,
    setMeetingSettings,
    MeetingSettings,
    setisPinEnabled,
    userdata,
  } = useEventRoomContext();
  const userData = useAuthData();
  const { toggleVideo, isVideoEnabled } = useLocalVideo();
  const { toggleMute, muted } = useToggleLocalMute();

  const HandleVideoAudio = (props) => {
    return new Promise((resolve, reject) => {
      const {
        value,
        hostDisabledType,
        userStatus,
        settingType,
        Type,
        popupmessage,
      } = props;
      // audioDisabledByHost
      try {
        const attendees = JSON.parse(value);
        const singleAttendee = attendees.updatedUser;
        const attendeeList = attendees.attendeeList;
        if (singleAttendee) {
          if (!userdata.isHost) {
            setuserdata((pre) => ({
              ...pre,
              [hostDisabledType]: singleAttendee[hostDisabledType],
              [Type]: singleAttendee[hostDisabledType],
            }));
            if (singleAttendee[hostDisabledType] === false) {
              Modal.confirm({
                title: popupmessage,
                async onOk() {
                  resolve();
                },
                onCancel() {},
              });
            } else if (singleAttendee[hostDisabledType]) {
              resolve();
            }
          }
        } else if (attendeeList) {
          const findAttendee = attendeeList.find(
            (ele) => parseInt(ele.userId) === parseInt(userData.user_id)
          );
          if (!userdata.isHost) {
            setMeetingSettings((pre) => ({
              ...pre,
              [settingType]: findAttendee?.[hostDisabledType] ? 0 : 1,
            }));
            setuserdata((pre) => ({
              ...pre,
              [hostDisabledType]: findAttendee[hostDisabledType],
              [Type]: findAttendee[hostDisabledType],
            }));
            if (findAttendee[hostDisabledType] === false) {
              Modal.confirm({
                title: popupmessage,
                async onOk() {
                  resolve();
                },
                onCancel() {},
              });
            } else if (findAttendee[hostDisabledType]) {
              if (!userStatus) {
                resolve();
              }
            }
          }
        }
      } catch (error) {
        reject();
      }
    });
  };

  const onReceiveMessage = (e) => {
    const { key, newValue } = e;
    console.log(key, newValue, "SOCKET EVENT");
    if (newValue) {
      switch (key) {
        case "EventData":
          try {
            const eventdetails = JSON.parse(newValue);
            setEventData(eventdetails);
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER:
          try {
            const requestanswerDetails = JSON.parse(newValue);
            if (requestanswerDetails.statusCode === 1) {
              handleJoinMeeting(requestanswerDetails);
            } else {
              setRequestStatusMessage(requestanswerDetails);
            }
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER:
          try {
            const user_data = JSON.parse(newValue);
            setnotificationToast({
              show: true,
              msg: `${user_data?.name} wants to join this meeting`,
              title: null,
              type: null,
              buttons: [
                <Button
                  onClick={() => {
                    setisChatorParticipant("participant");
                  }}
                >
                  View
                </Button>,
              ],
              icon: null,
            });
            RequestRef.current.push(user_data);
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING:
          try {
            const user_data = JSON.parse(newValue);
            setnotificationToast({
              show: true,
              msg: `${user_data?.name} Joined`,
              title: null,
              type: null,
              buttons: [],
              icon: null,
            });
            setattendeesList((pre) => [
              ...pre,
              { ...user_data, volume: defaultVolume },
            ]);
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND:
          try {
            const user_data = JSON.parse(newValue);
            const raiseHandUser = user_data.UserData;
            if (
              raiseHandUser.handRaised &&
              parseInt(raiseHandUser.userId) !== parseInt(userData.user_id)
            ) {
              setnotificationToast({
                show: true,
                msg: `${raiseHandUser?.name} Raised Hand`,
                title: null,
                type: null,
                buttons: [],
                icon: null,
              });
            } else if (
              parseInt(raiseHandUser.userId) === parseInt(userData.user_id)
            ) {
              setuserdata(raiseHandUser);
            }
            setattendeesList((pre) => {
              const targetIndex = pre.findIndex(
                (item) => item.userId === raiseHandUser.userId
              );
              if (targetIndex !== -1) {
                const newArray = [...pre];
                newArray.splice(targetIndex, 1, {
                  ...raiseHandUser,
                  volume: defaultVolume,
                });
                return newArray;
              } else {
                return pre;
              }
            });
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER:
          try {
            const user_data = JSON.parse(newValue);
            const renamedUser = user_data.updatedUser;
            setattendeesList((pre) => {
              const targetIndex = pre.findIndex(
                (item) => item.userId === renamedUser.userId
              );
              if (targetIndex !== -1) {
                const newArray = [...pre];
                newArray.splice(targetIndex, 1, {
                  ...renamedUser,
                  volume: defaultVolume,
                });
                return newArray;
              } else {
                return pre;
              }
            });
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.END_MEETING_ANSWER:
          try {
            const end_data = JSON.parse(newValue);
            if (end_data.ended) {
              const endData = { message: "Meeting Has Been Ended !" };
              EndAttendeeMeeting(endData);
            }
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG:
          try {
            const message_data = JSON.parse(newValue);
            if (
              parseInt(message_data.from_user_id) !== parseInt(userData.user_id)
            ) {
              setnotificationToast({
                show: true,
                msg: message_data.message,
                title: `${message_data.name} ${
                  message_data.isPrivate ? "(Private)" : ""
                }`,
                icon: <MessageOutlined />,
                buttons: [],
              });
            }
            setEventMessages((pre) => [
              {
                ...message_data,
                refId: EventData?.reference_id,
              },
              ...pre,
            ]);
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.KICK_USER_ANSWER:
          try {
            const kick_data = JSON.parse(newValue);
            const kickeduser = kick_data.kickedUser;
            if (
              kick_data.statusCode === 1 &&
              parseInt(kickeduser.userId) === parseInt(userData.user_id)
            ) {
              const endData = {
                message: "Someone removed you from this meeting !",
              };
              EndAttendeeMeeting(endData);
            }
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER:
          try {
            const attendees = JSON.parse(newValue);
            const attendeeList = attendees.attendeeList;
            const findAttendee = attendeeList.find(
              (ele) => parseInt(ele.userId) === parseInt(userData.user_id)
            );
            if (findAttendee) {
              if (!userdata.isHost) {
                setuserdata((pre) => ({
                  ...pre,
                  screenShare: findAttendee.screenShare ? 1 : 0,
                }));
              } else {
                setMeetingSettings((pre) => ({
                  ...pre,
                  user_screenshare: findAttendee.screenShare ? 1 : 0,
                }));
              }
            }
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER:
          try {
            const AudioData = {
              value: newValue,
              hostDisabledType: "audioDisabledByHost",
              userStatus: muted,
              settingType: "default_guest_audio",
              popupmessage: "Host requests that you unmute your microphone",
              Type: "audio",
            };
            HandleVideoAudio(AudioData).then(() => {
              toggleMute();
            });
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.ENABLE_VIDEO_ANSWER:
          try {
            const VideoData = {
              value: newValue,
              hostDisabledType: "videoDisabledByHost",
              userStatus: !isVideoEnabled,
              settingType: "default_guest_video",
              popupmessage: "Host requests that you Enable your Camera",
              Type: "video",
            };
            HandleVideoAudio(VideoData).then(() => {
              toggleVideo();
            });
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER:
          try {
            const viewData = JSON.parse(newValue);
            if (viewData.view_type === 2) {
              setisPinEnabled(viewData.spotlight_id);
            } else {
              setisPinEnabled(null);
            }
          } catch (error) {}
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("storage", onReceiveMessage);
    return () => {
      window.removeEventListener("storage", onReceiveMessage);
    };
  }, [muted, isVideoEnabled, EventMessages, RequestStatusMessage]);

  return <div></div>;
};

export default MeetingManagerComponent;
