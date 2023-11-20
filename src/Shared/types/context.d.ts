import { MeetingManager } from "amazon-chime-sdk-component-library-react";

export interface GlobalContextProps {
  postModalShow: boolean;
  setpostModalShow: (val: boolean) => void;
  setPostContent: (val: string) => void;
  PostContent: string;
  meetingManager?: MeetingManager;
}

export interface MainContextProps {
  meetingManager?: any;
  attendees?: any;
  player?: any;
  setplayer?: any;
  PlayerSource?: any;
  setisChatOpen?: any;
  isChatOpen?: any;
  setActiveEvent?: any;
  ActiveEvent?: any;
  isplayerFetching?: boolean;
  setisplayerFetching?: (val: boolean) => void;
  isAccountVerified?: "unverified" | "pending" | "verified" | null;
  AccountAccessType?:
    | "diamond_and_above"
    | "diamond_only"
    | "premium_and_above"
    | "premium_only"
    | "valued_only"
    | null;
}
