/**
 * Sets the default base URL for Axios requests and adds an interceptor to modify the
 * request headers.
 * @returns None
 */
import axios, { AxiosProgressEvent, CancelToken } from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  async (request) => {
    request.headers["Content-Type"] = "multipart/form-data";
    return request;
  },
  (error) => Promise.reject(error)
);

// Common

export const uploadChatAttachmentService = (
  formData: FormData,
  progress: (progressEvent: AxiosProgressEvent) => void,
  token: CancelToken | undefined
) => {
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

export const contactusService = (data: FormData) => {
  return axios.post("contactus", data);
};

export const getProfileService = (data: FormData) => {
  return axios.post("getmyprofile", data);
};
export const getUserSettingsService = (data: FormData) => {
  return axios.post("getusersettings", data);
};
export const getOthersProfileService = (data: FormData) => {
  return axios.post("getothersprofile", data);
};

export const updateProfileService = (data: FormData) => {
  return axios.post("updatemyprofile", data);
};
export const AccountVerifyService = (data: FormData) => {
  return axios.post("verifyaccount", data);
};
export const updateUserSettingsService = (
  data: FormData,
  progress: (progressEvent: AxiosProgressEvent) => void
) => {
  return axios.post("updateusersettings", data, {
    onUploadProgress: progress,
  });
};
export const grouplistupdateService = (data: FormData) => {
  return axios.post("grouplistupdate", data);
};

export const GeturlmetadataService = (data: FormData) => {
  return axios.post("geturlmetadata", data);
};

export const ChatEnableDisableService = (data: FormData) => {
  return axios.post("chat_enable_disable", data);
};

export const searchRawcasterUsersService = (
  data: FormData,
  token: CancelToken | undefined
) => {
  return axios.post("searchrawcasterusers", data, {
    cancelToken: token,
  });
};

export const inviteToRawcasterService = (data: FormData) => {
  return axios.post("invitetorawcaster", data);
};

export const sendFriendRequestsService = (data: FormData) => {
  return axios.post("sendfriendrequests", data);
};

export const listAllFriendRequestsService = (data: FormData) => {
  return axios.post("listallfriendrequests", data);
};

export const respondToFriendRequestsService = (data: FormData) => {
  return axios.post("respondtofriendrequests", data);
};

export const listAllFriendGroupsService = (data: FormData) => {
  return axios.post("listallfriendgroups", data);
};

export const listallblockedusersService = (data: FormData) => {
  return axios.post("listallblockedusers", data);
};

export const blockunblockuserService = (data: FormData) => {
  return axios.post("blockunblockuser", data);
};

export const unFriendService = (data: FormData) => {
  return axios.post("unfriend", data);
};

export const blockmultipleuserService = (data: FormData) => {
  return axios.post("blockmultipleuser", data);
};

export const listAllFriendsService = (data: FormData) => {
  return axios.post("listallfriends", data);
};

export const addFriendGroupService = (data: FormData) => {
  return axios.post("addfriendgroup", data);
};

export const editFriendGroupService = (data: FormData) => {
  return axios.post("editfriendgroup", data);
};

export const addFriendsToGroupService = (data: FormData) => {
  return axios.post("addfriendstogroup", data);
};

export const removeFriendsfFromGroupService = (data: FormData) => {
  return axios.post("removefriendsfromgroup", data);
};

export const deleteFriendGroupService = (data: FormData) => {
  return axios.post("deletefriendgroup", data);
};

export const groupAbuseReportService = (data: FormData) => {
  return axios.post("groupabusereport", data);
};
export const exitFromGroupService = (data: FormData) => {
  return axios.post("exitfromgroup", data);
};
export const complementaryMembershipService = (data: FormData) => {
  return axios.post("complementary_membership", data);
};
// Nugget services

export const addNuggetsService = (
  data: FormData,
  progress: (progressEvent: AxiosProgressEvent) => void
) => {
  return axios.post("addnuggets", data, {
    onUploadProgress: progress,
  });
};

export const listNuggetsService = (
  data: FormData,
  token: CancelToken | undefined
) => {
  return axios.post("listnuggets", data, {
    cancelToken: token,
  });
};

export const addNuggetViewService = (data: FormData) => {
  return axios.post("addnuggetview", data);
};

export const likeAndUnlikeNuggetService = (data: FormData) => {
  return axios.post("likeandunlikenugget", data);
};

export const saveAndUnsaveNuggetService = (data: FormData) => {
  return axios.post("saveandunsavenugget", data);
};

export const deleteNuggetService = (data: FormData) => {
  return axios.post("deletenugget", data);
};

export const nuggetCommentListService = (data: FormData) => {
  return axios.post("nuggetcommentlist", data);
};

export const addNuggetCommentService = (data: FormData) => {
  return axios.post("addnuggetcomment", data);
};

export const editNuggetCommentService = (data: FormData) => {
  return axios.post("editnuggetcomment", data);
};

export const deleteNuggetCommentService = (data: FormData) => {
  return axios.post("deletenuggetcomment", data);
};

export const likeAndUnlikeNuggetCommentService = (data: FormData) => {
  return axios.post("likeandunlikenuggetcomment", data);
};

export const nuggetAndCommentLikedUserListService = (data: FormData) => {
  return axios.post("nuggetandcommentlikeeduserlist", data);
};

export const editNuggetService = (data: FormData) => {
  return axios.post("editnugget", data);
};
export const shareNuggetService = (data: FormData) => {
  return axios.post("sharenugget", data);
};
export const NuggetAbuseReportService = (data: FormData) => {
  return axios.post("nuggetabusereport", data);
};

export const getNuggetDetailService = (data: FormData) => {
  return axios.post("getnuggetdetail", data);
};

type AbortType = {
  signal: AbortSignal;
};

export const getNuggetContentAudioService = (
  data: FormData,
  signal: AbortType | undefined
) => {
  return axios.post("nuggetcontentaudio", data, signal);
};

export const getNuggetandCommentLikedUserListService = (data: FormData) => {
  return axios.post("nuggetandcommentlikeeduserlist", data);
};

// Event services

export const getEventTypeService = (data: FormData) => {
  return axios.post("geteventtype", data);
};

export const getTimeZoneService = (data: FormData) => {
  return axios.post("gettimezone", data);
};

export const getLanguageListService = (data: FormData) => {
  return axios.post("getlanguagelist", data);
};

export const getEventLayoutService = (data: FormData) => {
  return axios.post("geteventlayout", data);
};

export const addEventService = (data: FormData) => {
  return axios.post("addevent", data);
};

export const editEventService = (data: FormData) => {
  return axios.post("editevent", data);
};
export const addLiveEventService = (data: FormData) => {
  return axios.post("addliveevent", data);
};

export const editLiveEventService = (data: FormData) => {
  return axios.post("editliveevent", data);
};

export const listEventsService = (data: FormData) => {
  return axios.post("listevents", data);
};
export const viewEventsService = (data: FormData) => {
  return axios.post("viewevent", data);
};

export const deleteEventService = (data: FormData) => {
  return axios.post("deleteevent", data);
};

export const geteventMelodyService = (data: FormData) => {
  return axios.post("geteventmelody", data);
};

export const getFaqService = (data: FormData) => {
  return axios.post("getfaq", data);
};

// Meetings

export const JoinAttendeeMeeting = (data: FormData) => {
  return axios.post("join_meeting", data);
};

export const getAttendeesFromMeetingService = (data: FormData) => {
  return axios.post("attendees", data);
};

export const EndMeetingService = (data: FormData) => {
  return axios.post("end_meeting", data);
};

export const ExitMeetingService = (data: FormData) => {
  return axios.post("exit_meeting", data);
};

export const ExternalUserJoinService = (data: FormData) => {
  return axios.post("externaluserjoin", data);
};

// Profile Config

export const FollowandunfollowService = (data: FormData) => {
  return axios.post("followandunfollow", data);
};

export const getFollowListService = (data: FormData) => {
  return axios.post("getfollowlist", data);
};

export const listClaimAccountService = (data: FormData) => {
  return axios.post("listunclaimaccount", data);
};

export const AddClaimAccountService = (data: FormData) => {
  return axios.post("addclaimaccount", data);
};
// Influencer

export const getInfluencerCategoryService = (data: FormData) => {
  return axios.post("getinfluencercategory", data);
};

export const InfluencerListService = (data: FormData) => {
  return axios.post("influencerlist", data);
};

export const InfluencerFollowService = (data: FormData) => {
  return axios.post("influencerfollow", data);
};
export const InfluencerChatService = (data: FormData) => {
  return axios.post("influencerchat", data);
};

export const SocialMediaLoginService = (data: FormData) => {
  return axios.post("socialmedialogin", data);
};

// Global Search

export const globalSearchNuggetsService = (
  data: FormData,
  token: CancelToken | undefined
) => {
  return axios.post("globalsearchnuggets", data, {
    cancelToken: token,
  });
};

export const globalSearchEventsService = (
  data: FormData,
  token: CancelToken | undefined
) => {
  return axios.post("globalsearchevents", data, {
    cancelToken: token,
  });
};

export const TagsListService = (
  data: FormData,
  token: CancelToken | undefined
) => {
  return axios.post("tagslist", data, {
    cancelToken: token,
  });
};

//Polling

export const pollVoteService = (data: FormData) => {
  return axios.post("pollvote", data);
};

// Notifications

export const ListNotificationService = (data: FormData) => {
  return axios.post("listnotifications", data);
};

export const DeleteNotificationService = (data: FormData) => {
  return axios.post("deletenotification", data);
};

export const ViewNotificationService = (data: FormData) => {
  return axios.post("readnotification", data);
};

// Artifitial Intelligence

export const AIChatService = (data: FormData) => {
  return axios.post(`aichat`, data);
};

export const TextToAudioService = (data: FormData, signal: any) => {
  return axios.post(`texttoaudio`, data, {
    signal: signal,
  });
};

// Get Referal List

export const GetReferralListService = (data: FormData) => {
  return axios.post(`getreferrallist`, data);
};

// Rawcaster Chat

export const ListChannelMsgService = (data: FormData) => {
  return axios.post(`list_channel_message`, data);
};

export const SendChannelMessageService = (data: FormData) => {
  return axios.post(`send_channel_message`, data);
};

export const UpdateChannelMessageService = (data: FormData) => {
  return axios.post(`update_channel_message`, data);
};

export const AutoChannelCreateService = (data: FormData) => {
  return axios.post(`auto_group_channel_create`, data);
};

export const AutoIndividualCreateService = (data: FormData) => {
  return axios.post(`auto_individual_channel_create`, data);
};

//QR Code

export const GenerateQRtokenService = (data: FormData) => {
  return axios.post(`generate_qrtoken`, data);
};
