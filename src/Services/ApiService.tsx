/**
 * Sets the default base URL for Axios requests and adds an interceptor to modify the
 * request headers.
 * @returns None
 */
import axios from "axios";
import { BASE_URL } from "./ServiceConstants";

axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(
  async (request) => {
    request.headers["Content-Type"] = "multipart/form-data";
    return request;
  },
  (error) => Promise.reject(error)
);

// Common

export const uploadChatAttachmentService = (formData, progress, token) => {
  return axios.post("uploadchatattachment", formData, {
    onUploadProgress: progress,
    cancelToken: token,
  });
};

export const loginService = (formData: FormData) => {
  return axios.post("login", formData);
};

export const signupService = (formData: FormData) => {
  return axios.post("signup", formData);
};

export const forgotPasswordService = (formData: FormData) => {
  return axios.post("forgotpassword", formData);
};

export const verifyotpsendPasswordService = (formData: FormData) => {
  return axios.post("verifyotpandresetpassword", formData);
};

export const resendOtpService = (formData: FormData) => {
  return axios.post("resendotp", formData);
};

export const signupVerifyService = (data: FormData) => {
  return axios.post("signupverify", data);
};

export const logoutService = (data: FormData) => {
  return axios.post("logout", data);
};

export const changePasswordService = (data: FormData) => {
  return axios.post("changepassword", data);
};

export const getCountylistService = (data: FormData) => {
  return axios.post("getcountylist", data);
};

export const contactusService = (data) => {
  return axios.post("contactus", data);
};

export const getProfileService = (data) => {
  return axios.post("getmyprofile", data);
};
export const getUserSettingsService = (data) => {
  return axios.post("getusersettings", data);
};
export const getOthersProfileService = (data) => {
  return axios.post("getothersprofile", data);
};

export const updateProfileService = (data) => {
  return axios.post("updatemyprofile", data);
};
export const AccountVerifyService = (data) => {
  return axios.post("verifyaccount", data);
};
export const updateUserSettingsService = (data, progress) => {
  return axios.post("updateusersettings", data, {
    onUploadProgress: progress,
  });
};
export const grouplistupdateService = (data) => {
  return axios.post("grouplistupdate", data);
};

export const GeturlmetadataService = (data) => {
  return axios.post("geturlmetadata", data);
};

export const ChatEnableDisableService = (data) => {
  return axios.post("chat_enable_disable", data);
};

export const searchRawcasterUsersService = (data, token) => {
  return axios.post("searchrawcasterusers", data, {
    cancelToken: token,
  });
};

export const inviteToRawcasterService = (data) => {
  return axios.post("invitetorawcaster", data);
};

export const sendFriendRequestsService = (data) => {
  return axios.post("sendfriendrequests", data);
};

export const listAllFriendRequestsService = (data) => {
  return axios.post("listallfriendrequests", data);
};

export const respondToFriendRequestsService = (data) => {
  return axios.post("respondtofriendrequests", data);
};

export const listAllFriendGroupsService = (data) => {
  return axios.post("listallfriendgroups", data);
};

export const listallblockedusersService = (data) => {
  return axios.post("listallblockedusers", data);
};

export const blockunblockuserService = (data) => {
  return axios.post("blockunblockuser", data);
};

export const unFriendService = (data) => {
  return axios.post("unfriend", data);
};

export const blockmultipleuserService = (data) => {
  return axios.post("blockmultipleuser", data);
};

export const listAllFriendsService = (data) => {
  return axios.post("listallfriends", data);
};

export const addFriendGroupService = (data) => {
  return axios.post("addfriendgroup", data);
};

export const editFriendGroupService = (data) => {
  return axios.post("editfriendgroup", data);
};

export const addFriendsToGroupService = (data) => {
  return axios.post("addfriendstogroup", data);
};

export const removeFriendsfFromGroupService = (data) => {
  return axios.post("removefriendsfromgroup", data);
};

export const deleteFriendGroupService = (data) => {
  return axios.post("deletefriendgroup", data);
};

export const groupAbuseReportService = (data) => {
  return axios.post("groupabusereport", data);
};
export const exitFromGroupService = (data) => {
  return axios.post("exitfromgroup", data);
};
// Nugget services

export const addNuggetsService = (data, progress) => {
  return axios.post("addnuggets", data, {
    onUploadProgress: progress,
  });
};

export const listNuggetsService = (data, token) => {
  return axios.post("listnuggets", data, {
    cancelToken: token,
  });
};

export const addNuggetViewService = (data) => {
  return axios.post("addnuggetview", data);
};

export const likeAndUnlikeNuggetService = (data) => {
  return axios.post("likeandunlikenugget", data);
};

export const saveAndUnsaveNuggetService = (data) => {
  return axios.post("saveandunsavenugget", data);
};

export const deleteNuggetService = (data) => {
  return axios.post("deletenugget", data);
};

export const nuggetCommentListService = (data) => {
  return axios.post("nuggetcommentlist", data);
};

export const addNuggetCommentService = (data) => {
  return axios.post("addnuggetcomment", data);
};

export const editNuggetCommentService = (data) => {
  return axios.post("editnuggetcomment", data);
};

export const deleteNuggetCommentService = (data) => {
  return axios.post("deletenuggetcomment", data);
};

export const likeAndUnlikeNuggetCommentService = (data) => {
  return axios.post("likeandunlikenuggetcomment", data);
};

export const nuggetAndCommentLikedUserListService = (data) => {
  return axios.post("nuggetandcommentlikeeduserlist", data);
};

export const editNuggetService = (data) => {
  return axios.post("editnugget", data);
};
export const shareNuggetService = (data) => {
  return axios.post("sharenugget", data);
};
export const NuggetAbuseReportService = (data) => {
  return axios.post("nuggetabusereport", data);
};

export const getNuggetDetailService = (data) => {
  return axios.post("getnuggetdetail", data);
};

export const getNuggetContentAudioService = (data, token) => {
  return axios.post("nuggetcontentaudio", data, token);
};

export const getNuggetandCommentLikedUserListService = (data) => {
  return axios.post("nuggetandcommentlikeeduserlist", data);
};

// Event services

export const getEventTypeService = (data) => {
  return axios.post("geteventtype", data);
};

export const getTimeZoneService = (data) => {
  return axios.post("gettimezone", data);
};

export const getLanguageListService = (data) => {
  return axios.post("getlanguagelist", data);
};

export const getEventLayoutService = (data) => {
  return axios.post("geteventlayout", data);
};

export const addEventService = (data) => {
  return axios.post("addevent", data);
};

export const editEventService = (data) => {
  return axios.post("editevent", data);
};
export const addLiveEventService = (data) => {
  return axios.post("addliveevent", data);
};

export const editLiveEventService = (data) => {
  return axios.post("editliveevent", data);
};

export const listEventsService = (data) => {
  return axios.post("listevents", data);
};
export const viewEventsService = (data) => {
  return axios.post("viewevent", data);
};

export const deleteEventService = (data) => {
  return axios.post("deleteevent", data);
};

export const geteventMelodyService = (data) => {
  return axios.post("geteventmelody", data);
};

export const getFaqService = (data) => {
  return axios.post("getfaq", data);
};

// Meetings

export const JoinAttendeeMeeting = (data) => {
  return axios.post("join_meeting", data);
};

export const getAttendeesFromMeetingService = (data) => {
  return axios.post("attendees", data);
};

export const EndMeetingService = (data) => {
  return axios.post("end_meeting", data);
};

export const ExitMeetingService = (data) => {
  return axios.post("exit_meeting", data);
};

export const ExternalUserJoinService = (data) => {
  return axios.post("externaluserjoin", data);
};

// Profile Config

export const FollowandunfollowService = (data) => {
  return axios.post("followandunfollow", data);
};

export const getFollowListService = (data) => {
  return axios.post("getfollowlist", data);
};

export const listClaimAccountService = (data) => {
  return axios.post("listunclaimaccount", data);
};

export const AddClaimAccountService = (data) => {
  return axios.post("addclaimaccount", data);
};
// Influencer

export const getInfluencerCategoryService = (data) => {
  return axios.post("getinfluencercategory", data);
};

export const InfluencerListService = (data) => {
  return axios.post("influencerlist", data);
};

export const InfluencerFollowService = (data) => {
  return axios.post("influencerfollow", data);
};
export const InfluencerChatService = (data) => {
  return axios.post("influencerchat", data);
};

export const SocialMediaLoginService = (data) => {
  return axios.post("socialmedialogin", data);
};

// Global Search

export const globalSearchNuggetsService = (data, token) => {
  return axios.post("globalsearchnuggets", data, {
    cancelToken: token,
  });
};

export const globalSearchEventsService = (data, token) => {
  return axios.post("globalsearchevents", data, {
    cancelToken: token,
  });
};

export const TagsListService = (data, token) => {
  return axios.post("tagslist", data, {
    cancelToken: token,
  });
};

//Polling

export const pollVoteService = (data) => {
  return axios.post("pollvote", data);
};

// Notifications

export const ListNotificationService = (data) => {
  return axios.post("listnotifications", data);
};

export const DeleteNotificationService = (data) => {
  return axios.post("deletenotification", data);
};

export const ViewNotificationService = (data) => {
  return axios.post("readnotification", data);
};

// Artifitial Intelligence

export const AIChatService = (data) => {
  return axios.post(`aichat`, data);
};

export const TextToAudioService = (data, token) => {
  return axios.post(`texttoaudio`, data, {
    cancelToken: token,
  });
};

// Get Referal List

export const GetReferralListService = (data) => {
  return axios.post(`getreferrallist`, data);
};

// Rawcaster Chat

export const ListChannelMsgService = (data) => {
  return axios.post(`list_channel_message`, data);
};

export const SendChannelMessageService = (data) => {
  return axios.post(`send_channel_message`, data);
};

export const UpdateChannelMessageService = (data) => {
  return axios.post(`update_channel_message`, data);
};

//QR Code

export const GenerateQRtokenService = (data) => {
  return axios.post(`generate_qrtoken`, data);
};
