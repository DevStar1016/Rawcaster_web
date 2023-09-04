import { ReactNode } from "react"
import { EventDataProp } from "../Configure/types";

export type NotificationToastState = {
    show: boolean,
    msg: string,
    title: string | null,
    type?: null,
    buttons: ReactNode[],
    icon: ReactNode,
}

// Attendee

export type ChimeAttendee ={
  chimeAttendeeId:string,
  externalUserId:string | null,
  name:string

}

export type RequestAttendee ={
   userId : number, 
   refId: string, 
   name : string , 
   image: string
}

export type AttendeeUserData = {
    userId: number;
    name: string;
    image?: string;
    audio?: boolean;
    video?: boolean;
    kicked?: boolean;
    isHost?: boolean;
    handRaised?: boolean;
    screenShare?: number;
    audioDisabledByHost?: boolean;
    videoDisabledByHost?: boolean;
    isRequested?: boolean;  
    AttendeeId?:string | undefined
    externalUserId?:string | undefined
}


export interface MeetingSettingProp {
  id: number;
  title: string;
  ref_id: string;
  chime_meeting_id: string;
  server_id: string;
  type: number;
  description: null | string;
  event_type_id: number;
  event_layout_id: number;
  event_melody_id: number;
  no_of_participants: number;
  duration: string;
  start_date_time: string;
  cover_img: string;
  created_at: string;
  created_by: number;
  last_updated_at: null | string;
  total_cost: null;
  paid_amount: null;
  pending_amount: null;
  payment_status: number;
  event_status: number;
  waiting_room: number;
  join_before_host: number;
  sound_notify: number;
  user_screenshare: number;
  status: number;
  pin_enabled: number;
  pinned_user_id: string | null;
  default_host_audio: number;
  default_host_video: number;
  default_guest_audio: number;
  default_guest_video: number;
};


interface PreBooleanReaction  {
   (value:boolean):boolean 
}

interface userDataPreReaction  {
  (value:AttendeeUserData):AttendeeUserData 
}

interface AttendeePreReaction  {
  (value:AttendeeUserData[]):AttendeeUserData[] 
}

export type EventContextProp = {
    isPinEnabled:string | number | null,
    setisPinEnabled:(val: string | number | null )=>void,
    isChatorParticipant:string | null | boolean,
    setisChatorParticipant:(val:string | null | boolean)=>void,
    setEventData:(val:EventDataProp | null)=>void,
    EventData:EventDataProp | null,
    setisWaitingRoom:(val:boolean)=>void,
    RequestRef:any,
    setattendeesList: (val:AttendeePreReaction)=>void ,
    attendeesList:AttendeeUserData[],
    setisFetching:(val:boolean)=>void,
    isFetching:boolean,
    handleExitMeeting,
    notificationToast:NotificationToastState,
    setnotificationToast:(val:NotificationToastState)=>void,
    handleJoinMeeting:(val:any)=>void,
    MeetingSettings:MeetingSettingProp | null,
    setMeetingSettings:(val:any)=>any,
    setisLoading:(val:boolean)=>void,
    isLoading:boolean,
    RequestStatusMessage:string | null,
    setRequestStatusMessage:(val:string | null)=>void,
    EventMessages:any,
    setEventMessages:(val:any)=>void,
    userdata:AttendeeUserData,
    setuserdata:(val:userDataPreReaction)=>void,
    handleEndMeeting:(val:AttendeeUserData)=>void,
    isReactions:boolean,
    setisReactions:(val:PreBooleanReaction)=>void,
    isPresentScreen:boolean, 
    setisPresentScreen:(val:PreBooleanReaction)=>void
    useAttendeesList:(val:any)=>void
    isEndLoading:string|null,
    setisEndLoading:(val:string|null)=>void,
}


// JOIN REQUEST ANSWER

type MeetingDetailsProp = {
    Attendee: any;
    meeting: any;
  };

type JoinInfoProp = {
    result?: MeetingDetailsProp;
    message: string;
  };

export type MeetingJoinedDataProp = {
    joinInfo: JoinInfoProp;
    meetingSetting: MeetingSettingProp;
    joinRequests: any[];
    AttendeeList: AttendeeUserData[];
    message?: string; // if meeting join error - message
    statusCode?: number | JoinRequestStatusCodes;
  };