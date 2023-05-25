import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfileService,
  getUserSettingsService,
  listAllFriendGroupsService,
  listAllFriendsService,
  listNuggetsService,
} from "../../../Services/ApiService";
import {
  JSONtoformdata,
  decodeHtml,
  getAuthToken,
} from "../../../Shared/Utility";
import { getfollowerfollowingService } from "../../../Components/Profile/Components/Utility";
import { handlenuggetToken } from "../Reducer/NuggetsReducer";
import { handleToken } from "../Reducer/AuthReducer";

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
        return data.friend_group_list;
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
      console.log(data);
      if (data.status === 1) {
        let resultData = {
          current_page_no: data.current_page_no,
          data: data.nuggets_list,
          total_count: data.nuggets_count,
          total_pages: data.total_pages,
        };
        return resultData;
      } else {
        return {
          current_page_no: 0,
          data: [],
          total_count: 0,
          total_pages: 0,
        };
      }
    } catch (error) {
      return {
        current_page_no: 0,
        data: [],
        total_count: 0,
        total_pages: 0,
      };
    }
  }
);

export const fetchuserSettingsbyToken = createAsyncThunk(
  "dashboard/fetchuserSettingsbyToken",
  async (token) => {
    let profileData = {
      token: token,
      auth_code: getAuthToken(token),
    };
    try {
      const { data } = await getUserSettingsService(
        JSONtoformdata(profileData)
      );
      if (data.status === 1) {
        return data.settings;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
);

export const fetchuserInfobyToken = createAsyncThunk(
  "dashboard/fetchuserInfobyToken",
  async (token, { dispatch }) => {
    let profileData = {
      token: token,
      auth_code: getAuthToken(token),
    };
    try {
      const { data } = await getProfileService(JSONtoformdata(profileData));
      if (data.status === 1) {
        const finalData = {
          ...data.profile,
          first_name: decodeHtml(data.profile.first_name),
          last_name: decodeHtml(data.profile.last_name),
          name: decodeHtml(data.profile.name),
        };

        dispatch(handleToken(token));
        dispatch(fetchuserSettingsbyToken(token));
        dispatch(handlenuggetToken(token));
        dispatch(fetchFrindsbyId(token));
        dispatch(fetchgroupsbyId({ token: token, user_id: finalData.user_id }));
        return { token: token, ...finalData };
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
);
