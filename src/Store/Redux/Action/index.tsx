/**
 * Redux async thunk functions for fetching data related to the dashboard and notifications.
 */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ListNotificationService,
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
  utctoUserTimezone,
} from "../../../Shared/Utility";
import { getfollowerfollowingService } from "../../../Components/Profile/Components/Utility";
import { handleCancelRef, handlenuggetToken } from "../Reducer/NuggetsReducer";
import { handleToken } from "../Reducer/AuthReducer";
import { connectChimeMessaging } from "../../../Services/Messaging/MessageService";
import { ChimesendMessage } from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import moment from "moment";
import { handleNotificationUnreadCount } from "../Reducer/DashboardReducer";
import { GetThunkAPI } from "@reduxjs/toolkit/dist/createAsyncThunk";
import axios from "axios";

// Connections

export const fetchFrindsbyId = createAsyncThunk(
  "dashboard/fetchFrindsbyId",
  async (res: any) => {
    let listData = {
      token: res?.token,
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
  async (res: any) => {
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
  async (listData: any) => {
    const { token, formData, signal } = listData;
    let nuggetData = {
      ...formData,
      token: token,
    };

    if (token) {
      try {
        const { data } = await listNuggetsService(
          JSONtoformdata(nuggetData),
          signal
        );
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
    } else {
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
  async (token: string) => {
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
  async (token: string, { dispatch, getState }) => {
    const { auth }: any = getState();
    const isSuccess = auth.isSuccess;
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
          user_id: data.profile.user_id,
        };
        // ChimesocketListen.connect();
        connectChimeMessaging({ userId: data.profile.chime_user_id });
        if (!isSuccess) {
          ChimesendMessage(
            { userId: data.profile.user_id },
            CHIME_SOCKET_EVENTS.JOIN_SOCKET
          );
        }

        dispatch(
          handleNotificationUnreadCount(data.profile.unread_notification_count)
        );
        dispatch(handleToken(token));
        dispatch(fetchuserSettingsbyToken(token));
        dispatch(handlenuggetToken(token));
        dispatch(fetchFrindsbyId({ token }));
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

type NotificationReqProps = {
  token: string;
};

export const fetchNotificationList = createAsyncThunk(
  "notifications/fetchNotificationList",
  async (res: any, { getState }) => {
    const state: any = getState();
    const getTimeZone = (date) => {
      return utctoUserTimezone(
        date,
        state?.auth?.userSettings?.time_zone || ""
      );
    };
    const { token }: NotificationReqProps = res;
    let notificationData = {
      token: token,
      ...res,
    };
    try {
      const { data } = await ListNotificationService(
        JSONtoformdata(notificationData)
      );

      if (data.status === 1) {
        const result = data.notification_list;
        const today = moment().format("YYYY-MM-DD HH:mm:ss");
        const yesterday = moment().subtract(1, "days");

        const todayItems = result.filter((item) => {
          const todayValue = moment(getTimeZone(today));
          const createdValue = moment(getTimeZone(item.created_datetime));

          return moment(todayValue).isSame(createdValue, "day");
        });
        const yesterdayItems = result.filter((item) => {
          const yesterdayValue = moment(getTimeZone(yesterday));
          const createdValue = moment(getTimeZone(item.created_datetime));
          return moment(yesterdayValue).isSame(createdValue, "day");
        });
        const olderItems = result.filter((item) => {
          const oldValue = moment(getTimeZone(yesterday));
          const createdValue = moment(getTimeZone(item.created_datetime));

          return moment(createdValue).isBefore(oldValue, "day");
        });
        return {
          today: todayItems,
          yesterday: yesterdayItems,
          older: olderItems,
          total_pages: data.total_pages,
          current_page_no: data.current_page_no,
          msg: data.msg,
          ...res,
        };
      } else {
        return {
          today: [],
          yesterday: [],
          older: [],
          total_pages: 0,
          current_page_no: 0,
          msg: 0,
          ...res,
        };
      }
    } catch (error) {
      return {
        today: [],
        yesterday: [],
        older: [],
        total_pages: 0,
        current_page_no: 0,
        msg: 0,
        ...res,
      };
    }
  }
);
