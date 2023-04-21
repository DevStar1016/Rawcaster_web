import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  listAllFriendGroupsService,
  listAllFriendsService,
  listNuggetsService,
} from "../../../Services/ApiService";
import { JSONtoformdata, getAuthToken } from "../../../Shared/Utility";
import { getfollowerfollowingService } from "../../../Components/Profile/Components/Utility";

// Connections

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

export const fetchgfollowerfollowingList = createAsyncThunk(
  "dashboard/fetchgfollowerfollowingList",
  async (listData) => {
    try {
      const data = await getfollowerfollowingService(JSONtoformdata(listData));
      return {
        type: 0,
        ...data,
      };
    } catch (error) {
      return {
        type: 0,
        connections: [],
        allconnections: [],
        allconnectionscount: 0,
        connectionscount: 0,
        isLoaded: true,
      };
    }
  }
);

// Nuggets

export const fetchNuggetsbyId = createAsyncThunk(
  "dashboard/fetchNuggetsbyId",
  async (listData) => {
    const { token, formData } = listData;
    let nuggetData = {
      ...formData,
      token: token,
    };
    try {
      const { data } = await listNuggetsService(JSONtoformdata(nuggetData));
      if (data.status === 1) {
        let resultData = {
          current_page_no: data.current_page_no,
          data: data.nuggets_list,
          total_count: data.nuggets_count,
          total_pages: data.total_pages,
        };
        return resultData;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
);
