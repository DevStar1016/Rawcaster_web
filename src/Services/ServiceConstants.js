export const SALT_KEY = "MaeRaw7sj5d@Pgk*LO7!e4ubz&8b";
// export const BASE_URL = "https://dev.rawcaster.com/rawadmin/webservice/";
// export const BASE_URL = "https://cbe.themaestro.in:8010/rawcaster/";
// export const BASE_URL = "http://192.168.1.108:8003/rawcaster";
export const CHIME_BASE_URL = "https://devchimeapi.rawcaster.com/";
export const BASE_URL = "https://devapi.rawcaster.com/rawcaster/";
export const socketURL = "wss://dev.rawcaster.com:8118";
export const ChimesocketURL = "34.239.41.21:5000";
// Socket Values

export const SOCKET_EVENTS = {
  FRIEND_REQUEST: "friendrequest",
  FRIEND_RESPONSE: "friendresponse",
  FRIEND_STATUS: "friendstatus",
};

export const CHIME_SOCKET_EVENTS = {
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
};
