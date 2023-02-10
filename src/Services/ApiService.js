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

export const loginService = (formData) => {
  return axios.post("login", formData);
};

export const signupService = (formData) => {
  return axios.post("signup", formData);
};

export const forgotPasswordService = (formData) => {
  return axios.post("forgotpassword", formData);
};

export const verifyotpsendPasswordService = (formData) => {
  return axios.post("verifyotpandresetpassword", formData);
};

export const resendOtpService = (formData) => {
  return axios.post("resendotp", formData);
};

export const signupVerifyService = (data) => {
  return axios.post("signupverify", data);
};

export const logoutService = (data) => {
  return axios.post("logout", data);
};

export const changePasswordService = (data) => {
  return axios.post("changepassword", data);
};

export const getCountylistService = (data) => {
  return axios.post("getcountylist", data);
};

export const contactusService = (data) => {
  return axios.post("contactus", data);
};

export const getProfileService = (data) => {
  return axios.post("getmyprofile", data);
};

export const updateProfileService = (data) => {
  return axios.post("updatemyprofile", data);
};

export const searchRawcasterUsersService = (data) => {
  return axios.post("searchrawcasterusers", data);
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

// Nugget services

export const addNuggetsService = (data) => {
  return axios.post("addnuggets", data);
};

export const listNuggetsService = (data) => {
  return axios.post("listnuggets", data);
};

export const likeAndUnlikeNuggetService = (data) => {
  return axios.post("likeandunlikenugget", data);
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

export const getNuggetDetailService = (data) => {
  return axios.post("getnuggetdetail", data);
};

// Event services

export const getEventTypeService = (data) => {
  return axios.post("geteventtype", data);
};

export const getEventLayoutService = (data) => {
  return axios.post("geteventlayout", data);
};

export const addEventService = (data) => {
  return axios.post("addevent", data);
};

export const listEventsService = (data) => {
  return axios.post("listevents", data);
};

export const deleteEventService = (data) => {
  return axios.post("deleteevent", data);
};
