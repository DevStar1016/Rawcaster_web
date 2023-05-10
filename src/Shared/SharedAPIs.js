import { toast } from "react-hot-toast";
import {
  FollowandunfollowService,
  addNuggetViewService,
  sendFriendRequestsService,
} from "../Services/ApiService";
import { JSONtoformdata, getAuthToken } from "./Utility";

export const addNuggetView = (data) => {
  addNuggetViewService(JSONtoformdata(data))
    .then((res) => {})
    .catch((err) => {});
};

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
          toast.success(res.data.msg);
          resolve();
        } else {
          toast.error(res.data.msg);
          reject();
        }
      })
      .catch((err) => {
        toast.error(err.msg);
        reject();
      });
  });
};

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
          toast.success(res.data.msg);
        } else if (res.data.status === 0) {
          reject();
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        reject();
        toast.error(err.message);
      });
  });
};
