import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  ListNotificationService,
  getProfileService,
  getUserSettingsService,
  listAllFriendGroupsService,
  listAllFriendsService,
  listNuggetsService,
  viewEventsService,
} from "../../../Services/ApiService";
import {
  JSONtoformdata,
  decodeHtml,
  getAuthToken,
  utctoUserTimezone,
} from "../../../Shared/Utility";
import { getfollowerfollowingService } from "../../../Components/Profile/Components/Utility";
import { handlenuggetToken } from "../Reducer/NuggetsReducer";
import { handleToken } from "../Reducer/AuthReducer";
import { connectChimeMessaging } from "../../../Services/Messaging/MessageService";
import {
  ChimesendMessage,
  ChimesocketListen,
} from "../../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import moment from "moment";

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
      const getusetId = () => {
        switch (data.profile.user_id) {
          case 88:
            return 11;
          case 67:
            return 22;
          case 21:
            return 33;
          default:
            return data.profile.user_id;
        }
      };
      if (data.status === 1) {
        const finalData = {
          ...data.profile,
          first_name: decodeHtml(data.profile.first_name),
          last_name: decodeHtml(data.profile.last_name),
          name: decodeHtml(data.profile.name),
          user_id: getusetId(),
        };
        connectChimeMessaging({ userId: data.profile.chime_user_id });

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

export const fetchActiveEventData = createAsyncThunk(
  "dashboard/fetchActiveEventData",
  async (res) => {
    const { token, ref_id } = res;
    let profileData = {
      token: token,
      event_id: ref_id,
    };
    try {
      const { data } = await viewEventsService(JSONtoformdata(profileData));
      if (data.status === 1) {
        return data.event_detail;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
);

export const fetchNotificationList = createAsyncThunk(
  "notifications/fetchNotificationList",
  async (res, { getState }) => {
    const state = getState();
    const getTimeZone = (date) => {
      return utctoUserTimezone(date, state?.time_zone);
    };
    const { token } = res;
    let notificationData = {
      token,
      ...res,
    };
    try {
      const { data } = await ListNotificationService(
        JSONtoformdata(notificationData)
      );
      if (data.status === 1) {
        const result = data.notification_list;
        const today = moment().format("YYYY-MM-DD HH:mm:ss");
        const yesterday = moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD HH:mm:ss");

        const todayItems = result.filter((item) => {
          const todayValue = moment(getTimeZone(today)).format("YYYY-MM-DD");
          const createdValue = moment(
            getTimeZone(item.created_datetime)
          ).format("YYYY-MM-DD");

          return moment(todayValue).isSame(createdValue);
        });
        const yesterdayItems = result.filter((item) => {
          const yesterdayValue = moment(getTimeZone(yesterday)).format(
            "YYYY-MM-DD"
          );
          const createdValue = moment(
            getTimeZone(item.created_datetime)
          ).format("YYYY-MM-DD");
          return moment(yesterdayValue).isSame(createdValue);
        });
        const olderItems = result.filter((item) => {
          const oldValue = moment(getTimeZone(yesterday)).format("YYYY-MM-DD");
          const createdValue = moment(
            getTimeZone(item.created_datetime)
          ).format("YYYY-MM-DD");

          return moment(createdValue).isBefore(oldValue);
        });
        return {
          today: todayItems,
          yesterday: yesterdayItems,
          older: olderItems,
          total_pages: data.total_pages,
          current_page_no: data.current_page_no,
          msg: data.msg,
        };
      } else {
        return {
          today: [],
          yesterday: [],
          older: [],
          total_pages: 0,
          current_page_no: 0,
          msg: 0,
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
      };
    }
  }
);
