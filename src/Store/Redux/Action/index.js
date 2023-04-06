import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  listAllFriendGroupsService,
  listAllFriendsService,
} from "../../../Services/ApiService";
import { JSONtoformdata, getAuthToken } from "../../../Shared/Utility";

export const fetchFrindsbyId = createAsyncThunk(
  "dashboard/fetchFrindsbyId",
  async (token) => {
    let listData = {
      token: token,
      allfriends: 1,
    };
    try {
      const { data } = await listAllFriendsService(JSONtoformdata(listData));
      if (data.status === 1) {
        let contactlist = data.friends_list;
        contactlist.sort((a, b) => {
          return b.online - a.online;
        });

        contactlist.sort((a, b) => {
          return (
            new Date(b.last_msg_datetime).getTime() -
            new Date(a.last_msg_datetime).getTime()
          );
        });
        return contactlist;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
);

export const fetchgroupsbyId = createAsyncThunk(
  "dashboard/fetchgroupsbyId",
  async (res) => {
    console.log(res);
    let listData = {
      token: res.token,
      auth_code: getAuthToken(res.token),
    };
    try {
      const { data } = await listAllFriendGroupsService(
        JSONtoformdata(listData)
      );

      if (data.status === 1) {
        let user_group_list = data.friend_group_list.filter((ele) => {
          return ele.group_owner === res.user_id;
        });
        return user_group_list;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
);
