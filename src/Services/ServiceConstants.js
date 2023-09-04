// export const BASE_URL = "https://dev.rawcaster.com/rawadmin/webservice/";
// export const BASE_URL = "https://cbe.themaestro.in:8010/rawcaster/";
// export const BASE_URL = "https://devapi.rawcaster.com/rawcaster/";

// LOCAL BASE_URL

// export const BASE_URL = "http://192.168.1.108:8003/rawcaster";

// DEV BASE_URL

export const BASE_URL = "https://devapi.rawcaster.com/rawcaster/";

// SOCKET URL

export const socketURL = "wss://dev.rawcaster.com:8118";
export const ChimesocketURL = "34.239.41.21:5000";

// Socket Values

export const SOCKET_EVENTS = {
  FRIEND_REQUEST: "friendrequest",
  FRIEND_RESPONSE: "friendresponse",
  FRIEND_STATUS: "friendstatus",
};

export const CHIME_SOCKET_EVENTS = {
  CONNECT_SOCKET: "connect",
  JOIN_SOCKET: "joinSocket",
  CREATE_MEETING_ROOM: "createMeetingRoom",
  JOIN_MEETING_ROOM: "joinMeetingRoom",
  SEND_MESSAGE_TO_MEETING_ROOM: "sendMessageToMeetingRoom",
  MEETING_ROOM_MSG: "meetingRoomMsg",
  SEND_MESSAGE_TO_SINGLE_USER: "sendMessageToSingleUser",
  SINGLE_USER_MSG: "singleUserMsg",
  ALLOW_TO_JOIN_MEETING: "allowToJoinMeeting",
  REJECT_TO_JOIN_MEETING: "rejectToJoinMeeting",
  JOIN_REQUEST: "joinRequest",
  JOIN_REQUEST_FROM_USER: "joinRequestFromUser",
  JOIN_REQUEST_FROM_RESPONSE: "joinRequestResponse",
  JOIN_REQUEST_ANSWER: "joinRequestAnswer",
  MEETING_IN_CALL_EVENTS: "inCallEvents",
  USER_LEFT_MEETING: "userLeft",
  USER_LEFTED_MEETING: "userLefted",
  MEETING_RAISE_HAND: "raiseHand",
  NEW_USER_JOINED_MEETING: "newUserJoined",
  RENAME_USER: "renameUser",
  RENAME_USER_ANSWER: "renameUserAnswer",
  ENABLE_SHARE_SCREEN: "enableShareScreen",
  ENABLE_SHARE_SCREEN_ANSWER: "enableShareScreenAnswer",
  ENABLE_AUDIO: "enableAudio",
  ENABLE_AUDIO_ANSWER: "enableAudioAnswer",
  ENABLE_VIDEO: "enableVideo",
  ENABLE_VIDEO_ANSWER: "enableVideoAnswer",
  UPDATE_LAYOUT: "updateLayout",
  UPDATE_LAYOUT_ANSWER: "updateLayoutAnswer",
  END_MEETING: "endMeeting",
  END_MEETING_ANSWER: "endMeetingAnswer",
  KICK_USER: "kickUser",
  KICK_USER_ANSWER: "kickUserAnswer",
  MAKE_HOST: "makeHost",
  MAKE_HOST_ANSWER: "makeHostAnswer",
  NOTIFICATIONS: "notifications",
  DISCONNECT_SOCKET: "disconnect",
};

export const COMMON_EVENTS_TYPES = {
  CREATE_EVENT: "createEvent",
  EDIT_EVENT: "editEvent",
  DELETE_EVENT: "deleteEvent",
};
