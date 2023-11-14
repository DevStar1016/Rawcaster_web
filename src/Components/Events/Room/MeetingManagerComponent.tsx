import { useEffect, useState } from "react";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { Button, Modal } from "antd";
import { useEventRoomContext } from "../../../Shared/Context";
import {
  useAudioVideo,
  useContentShareControls,
  useContentShareState,
  useLocalVideo,
  useMeetingManager,
  useMeetingStatus,
  useToggleLocalMute,
} from "amazon-chime-sdk-component-library-react";
import { EndAttendeeMeeting } from "../Components/Methods";
import {
  useAuthData,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
import { defaultVolume } from "../Configure/Constants";
import { MessageOutlined } from "@ant-design/icons";
import {
  AttendeeUserData,
  EventContextProp,
  MeetingSettingProp,
} from "../Components/types";

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
    setisPresentScreen,
    setEventMessages,
    setuserdata,
    setMeetingSettings,
    MeetingSettings,
    setisPinEnabled,
    userdata,
    attendeesList,
    setAnimatedEmoji,
    setMeetingTimer,
  }: EventContextProp = useEventRoomContext();
  const meetingManager = useMeetingManager();
  const audiovideo = useAudioVideo();
  const meetingStatus = useMeetingStatus();
  const { isVideoEnabled, toggleVideo } = useLocalVideo();
  const { toggleMute, muted } = useToggleLocalMute();
  const [isDefaultUpdated, setisDefaultUpdated] = useState({
    audio: false,
    video: false,
  });
  const { toggleContentShare } = useContentShareControls();
  const { isLocalUserSharing } = useContentShareState();
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();

  /**
   * Handle Attendee Present By Amazon Chime SDK
   */
  const presenceCallback = (
    attendeeId: string,
    present: boolean,
    externalUserId: string | undefined
  ) => {
    if (!attendeeId.includes("#content") && !present) {
      const user_data = attendeesList.find(
        (ele) => externalUserId && ele.userId === parseInt(externalUserId)
      );
      if (user_data) {
        setnotificationToast({
          show: true,
          msg: `${user_data?.name} Lefted`,
          title: null,
          type: null,
          buttons: [],
          icon: null,
        });
        setattendeesList((pre) =>
          handleLeave(pre)
        );
       
        const handleLeave = (pre)=> {
          const remainingParticipants = pre.filter((participant) => participant.userId !== user_data.userId);
          
          const isHostOrCoHost = (participant) => participant.isHost || participant.isCoHost;
          
          const hostList = remainingParticipants.filter((participant) => isHostOrCoHost(participant));
        
          if (hostList.length === 0 && audiovideo) {
            audiovideo.stop();
          }
        
          return remainingParticipants
        }
      }
    } else if (attendeeId.includes("#content") && present) {
      setisPresentScreen((pre) => true);
    }
  };

  useEffect(() => {
    if (audiovideo) {
      audiovideo?.realtimeSubscribeToAttendeeIdPresence(presenceCallback);
    }
  }, [audiovideo, meetingManager]);

  /* To get Rawcaster user or non Rawcaster User */
  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  /**
   * Audio Video Settings Handle By Socket
   */

  const HandleVideoAudio = (props) => {
    return new Promise<void>((resolve, reject) => {
      const {
        value,
        hostDisabledType,
        userStatus,
        settingType,
        Type,
        popupmessage,
      } = props;
      try {
        const attendees = value;
        const singleAttendee = attendees.updatedUser;
        const attendeeList = attendees.attendeeList;
        if (singleAttendee) {
          if (singleAttendee.userId === userdata?.userId) {
            if (!userdata.isHost || !userdata.isCoHost) {
              setuserdata((pre) => ({
                ...pre,
                [hostDisabledType]: singleAttendee[hostDisabledType],
                [Type]: singleAttendee[hostDisabledType],
              }));
               
              if (singleAttendee[hostDisabledType] === false && userStatus) {
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
          }
        } else if (attendeeList) {
          const findAttendee = attendeeList.find(
            (ele) => parseInt(ele.userId) === getUserData()?.user_id
          );

           setMeetingSettings((pre) => ({
             ...pre,
            [settingType]: value.status ? 1 : 0,
            hostDisabledType: value.status 
          }));

            setattendeesList(attendeeList);

            // skip toggle mute 
            if (!(findAttendee?.isHost || findAttendee?.isCoHost) && !userStatus) {
              resolve();
            }

            // setuserdata((pre) => ({
            //   ...pre,
            //   audio: findAttendee.audio,
            //   [hostDisabledType]: findAttendee[hostDisabledType],
            //   [Type]: findAttendee[hostDisabledType],
            // }));
         
          // if (!userdata.isHost || !userdata.isCoHost) {
          //   // setMeetingSettings((pre) => ({
          //   //   ...pre,
          //   //   [settingType]: findAttendee?.[hostDisabledType] ? 0 : 1,
          //   // }));
          //   setuserdata((pre) => ({
          //     ...pre,
          //     [hostDisabledType]: findAttendee[hostDisabledType],
          //     [Type]: findAttendee[hostDisabledType],
          //   }));
          //   if (findAttendee[hostDisabledType] === false && userStatus) {
          //     // Modal.confirm({
          //     //   title: popupmessage,
          //     //   async onOk() {
          //         // resolve();
          //     //   },
          //     //   onCancel() {},
          //     // });
          //   } else if (findAttendee[hostDisabledType]) {
          //     if (!userStatus) {
          //       resolve();
          //     }
          //   }
          // }
        }
      } catch (error) {
        reject();
      }
    });
  };

  const onReceiveMessage = (e) => {
    const { type, message } = e.data;

    if (message) {
      switch (type) {
        case "EventData":
          if (message) {
            setEventData(message);
          }
          break;
        case CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER:
          if (message) {
            if (message.statusCode === 1) {
              handleJoinMeeting(message);
            } else {
              setRequestStatusMessage(message);
            }
          }
          break;
        case CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER:
          if (message) {
            const FilterDuplicateUser = RequestRef.current.find(
              (ele) => parseInt(ele.userId) === parseInt(message.userId)
            );
            if (!FilterDuplicateUser) {
              setnotificationToast({
                show: true,
                msg: `${message?.name} wants to join this meeting`,
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
              RequestRef.current.push(message);
            }
          }
          break;
        case CHIME_SOCKET_EVENTS.HANDLE_ACCEPT_REJECT_JOIN_REQUEST:
            if (message) {
              RequestRef.current = message.joinRequests
            }
            break;
        case CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING:
          if (message) {
            setnotificationToast({
              show: true,
              msg: `${message?.name} Joined`,
              title: null,
              type: null,
              buttons: [],
              icon: null,
            });
            setattendeesList((pre) => [
              ...pre,
              { ...message, volume: defaultVolume },
            ]);
          }
          break;
        case CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND:
          if (message) {
            const user_data = message;
            const raiseHandUser = user_data.UserData;
            if (
              raiseHandUser.handRaised &&
              parseInt(raiseHandUser.userId) !== getUserData()?.user_id
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
              parseInt(raiseHandUser.userId) === getUserData()?.user_id
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
          }
          break;
        case CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER:
          if (message) {
            const user_data = message;
            const renamedUser = user_data.updatedUser;
            console.log(renamedUser, "renamedUser");

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
          }
          break;
        case CHIME_SOCKET_EVENTS.END_MEETING_ANSWER:
          if (message) {
            const end_data = message;
            if (end_data.ended) {
              const endData = { message: "This meeting has ended !" };
              EndAttendeeMeeting(endData);
            }
          }
          break;
        case CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG:
          if (message) {
            const message_data = message;
            if (
              parseInt(message_data.from_user_id) !== getUserData()?.user_id
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
          }
          break;
        case CHIME_SOCKET_EVENTS.KICK_USER_ANSWER:
          if (message) {
            const kick_data = message;
            const kickeduser = kick_data.kickedUser;
            if (
              kick_data.statusCode === 1 &&
              parseInt(kickeduser.userId) === getUserData()?.user_id
            ) {
              window.close();
              // const endData = {
              //   message: "Someone removed you from this meeting !",
              // };
              // EndAttendeeMeeting(endData);
            }
          }
          break;
        case CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER:
          if (message) {
            const attendees = message;
            const attendeeList = attendees.attendeeList;
            const findAttendee = attendeeList.find(
              (ele: AttendeeUserData) => ele.userId === getUserData()?.user_id
            );
            if (findAttendee) {
              setMeetingSettings((pre: MeetingSettingProp) => ({
                ...pre,
                user_screenshare: findAttendee.screenShare ? 1 : 0,
              }));
              if (!userdata.isHost) {
                setuserdata((pre) => ({
                  ...pre,
                  screenShare: findAttendee.screenShare ? 1 : 0,
                }));
              }
            }
          }
          break;
        case CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER:
          if (message) {
            const AudioData = {
              value: message,
              hostDisabledType: "audioDisabledByHost",
              userStatus: muted,
              settingType: "default_guest_audio",
              popupmessage: "Host requests you to turn on your Microphone ",
              Type: "audio",
            };
            HandleVideoAudio(AudioData).then(() => {
              toggleMute();
            });
          }
          break;
        case CHIME_SOCKET_EVENTS.ENABLE_VIDEO_ANSWER:
          if (message) {
            const VideoData = {
              value: message,
              hostDisabledType: "videoDisabledByHost",
              userStatus: !isVideoEnabled,
              settingType: "default_guest_video",
              popupmessage: "Host requests you to turn on your Camera ",
              Type: "video",
            };
            HandleVideoAudio(VideoData).then(() => {
              toggleVideo();
            });
          }
          break;
        case CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER:
          if (message) {
            if (message.pin_enabled === 1) {
              setisPinEnabled(message.pinned_user_id);
            } else {
              setisPinEnabled(null);
            }
          }
          break;
        case CHIME_SOCKET_EVENTS.MAKE_HOST_ANSWER:
          if (message) {
            const hostData = message;
            if (hostData && hostData.statusCode === 1) {
              const updatedUserData = hostData.updatedUser;
              if (parseInt(updatedUserData.userId) === userdata?.userId) {
                setuserdata(updatedUserData);
              }
              setattendeesList(message.attendeeList);
            }
          }
          break;
        case CHIME_SOCKET_EVENTS.REMOVE_HOST_ANSWER:
            if (message) {
              const hostData = message;
              if (hostData && hostData.statusCode === 1) {
                const updatedUserData = hostData.updatedUser;
                if (parseInt(updatedUserData.userId) === userdata?.userId) {
                    setuserdata(updatedUserData);
                  }
                  setattendeesList(message.attendeeList);
                }
              }
            break;
        case CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS:
          try {
            const callEventData = message;
            console.log(callEventData, "callEventData1");
            if (callEventData) {
              if (callEventData.screen_share_status === false) {
                console.log(callEventData, "callEventData2");
                if (isLocalUserSharing) {
                  toggleContentShare();
                }
              }
            }
          } catch (error) {}
          break;
        case CHIME_SOCKET_EVENTS.POST_REACTION_ANSWER:
          if (message.emoji) {
            setAnimatedEmoji(message.emoji)
          }
        break;
        case CHIME_SOCKET_EVENTS.END_MEETING_ALERT_ANSWER:
          if (message) {
            let endtime = new Date(message.time).getMinutes()
            setnotificationToast({
              buttons: [],
              icon: null,
              msg: `Meeting will be ended in ${endtime} minutes`,
              show: true,
              title: null,
              type: null
            })
            setMeetingTimer(message.time)
          }
        break;
        default:
          break;
      }
    }
  };

  /**
   * Listener From Parent Window to Child Window
   */

  useEffect(() => {
    window.addEventListener("message", onReceiveMessage);
    return () => {
      window.removeEventListener("message", onReceiveMessage);
    };
  }, [muted, isVideoEnabled, isLocalUserSharing]);

  /**
   * Default Audio Settings for Attendee and Host
   */

  useEffect(() => {
    if (meetingStatus === 1 && !isDefaultUpdated.audio) {
      if (MeetingSettings && userdata) {
        try {
          if (userdata?.isHost) {
            switch (true) {
              case MeetingSettings?.default_host_audio === 1:
                if (muted) {
                  toggleMute();
                }
                setisDefaultUpdated((pre) => ({
                  ...pre,
                  audio: true,
                }));
                break;
              case MeetingSettings?.default_host_audio === 0:
                if (!muted) {
                  toggleMute();
                }
                setisDefaultUpdated((pre) => ({
                  ...pre,
                  audio: true,
                }));
                break;

              default:
                break;
            }
          } else {
            switch (true) {
              case MeetingSettings?.default_guest_audio === 1:
                if (muted) {
                  toggleMute();
                }
                setisDefaultUpdated((pre) => ({
                  ...pre,
                  audio: true,
                }));
                break;
              case MeetingSettings?.default_guest_audio === 0:
                if (!muted) {
                  toggleMute();
                }
                setisDefaultUpdated((pre) => ({
                  ...pre,
                  audio: true,
                }));
                break;

              default:
                break;
            }
          }
        } catch (error) {}
      }
    }
  }, [MeetingSettings, userdata, meetingStatus, muted, isDefaultUpdated]);

  /**
   * Default Video Settings for Attendee and Host
   */

  useEffect(() => {
    if (meetingStatus === 1 && !isDefaultUpdated.video) {
      if (MeetingSettings && userdata) {
        try {
          if (userdata?.isHost) {
            switch (true) {
              case MeetingSettings?.default_host_video === 1:
                if (!isVideoEnabled) {
                  toggleVideo();
                }
                setisDefaultUpdated((pre) => ({
                  ...pre,
                  video: true,
                }));
                break;
              case MeetingSettings?.default_host_video === 0:
                if (isVideoEnabled) {
                  toggleVideo();
                }
                setisDefaultUpdated((pre) => ({
                  ...pre,
                  video: true,
                }));
                break;
              default:
                break;
            }
          } else {
            switch (true) {
              case MeetingSettings?.default_guest_video === 1:
                if (!isVideoEnabled) {
                  toggleVideo();
                }
                setisDefaultUpdated((pre) => ({
                  ...pre,
                  video: true,
                }));
                break;
              case MeetingSettings?.default_guest_video === 0:
                if (isVideoEnabled) {
                  toggleVideo();
                }
                setisDefaultUpdated((pre) => ({
                  ...pre,
                  video: true,
                }));
                break;
              default:
                break;
            }
          }
        } catch (error) {}
      }
    }
  }, [
    MeetingSettings,
    userdata,
    meetingStatus,
    isVideoEnabled,
    isDefaultUpdated,
  ]);

  return <div></div>;
};

export default MeetingManagerComponent;
