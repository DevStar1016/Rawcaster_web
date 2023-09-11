import { MeetingManager } from "amazon-chime-sdk-component-library-react";

export interface GlobalContextProps  {
    postModalShow:boolean,
    setpostModalShow:(val:boolean)=>void,
    setPostContent:(val:string)=>void,
    PostContent:string,
    meetingManager?:MeetingManager,
  }
