/**
 * Contains utility functions related to API calls and handling user interactions.
 * @module ApiService
 */
import { toast } from "react-hot-toast";
import {
  FollowandunfollowService,
  addNuggetViewService,
  sendFriendRequestsService,
} from "../Services/ApiService";
import { JSONtoformdata, getAuthToken } from "./Utility";
import axios from "axios";

/**
 * Adds a nugget view by sending the provided data to the server.
 * @param {object} data - The data to send to the server.
 * @returns None
 */
export const addNuggetView = (data) => {
  addNuggetViewService(JSONtoformdata(data))
    .then((res) => {})
    .catch((err) => {});
};

export const GoogleSigninService = (access_token) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`
      )
      .then(({ data }) => {
        if (data.email) {
          resolve(data);
        } else {
          reject();
          toast.remove("Error");
          toast.error("Something Went Wrong !", {
            id: "Error",
          });
        }
      })
      .catch((err) => {
        reject();
      });
  });
};

/**
 * Handles the action of a user becoming a fan of a specific user.
 * @param {string} token - The authentication token of the user.
 * @param {string} user_ref_id - The reference ID of the user being followed.
 * @returns {Promise} A promise that resolves if the action is successful, and rejects if there is an error.
 */
export const HandleBecameaFan = (token, user_ref_id) => {
  return new Promise((resolve, reject) => {
    const becameFanData = {
      token: token,
      auth_code: getAuthToken(token),
      follow_userid: user_ref_id,
      type: 1,
    };
    FollowandunfollowService(JSONtoformdata(becameFanData))
      .then((res) => {
        if (res.data.status === 1) {
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
          resolve();
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
          reject();
        }
      })
      .catch((err) => {
        reject();
      });
  });
};

/**
 * Handles the process of adding a friend.
 * @param {string} token - The authentication token of the user.
 * @param {string} user_ref_id - The reference ID of the user to add as a friend.
 * @returns {Promise} A promise that resolves with the response data if the friend request is successful, or rejects with an error if it fails.
 */
export const HandleAddFriend = (token, user_ref_id) => {
  return new Promise((resolve, reject) => {
    let addFriendData = {
      token: token,
      auth_code: getAuthToken(token),
      user_ids: JSON.stringify([user_ref_id]),
    };
    sendFriendRequestsService(JSONtoformdata(addFriendData))
      .then((res) => {
        if (res.data.status === 1) {
          resolve(res.data);
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
        } else if (res.data.status === 0) {
          reject();
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {
        reject();
      });
  });
};
