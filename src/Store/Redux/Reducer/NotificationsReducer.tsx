/**
 * Redux slice for managing notifications state.
 * @module notifications
 */
import { createSlice } from "@reduxjs/toolkit";
import { fetchNotificationList } from "../Action";
import { NotificationProps } from "../types/Notification";

const initialState: NotificationProps = {
  isTabChange: false,
  isLoading: false,
  Notifications: {
    today: [],
    yesterday: [],
    older: [],
    total_pages: 0,
    current_page_no: 0,
    msg: 0,
  },
};

export const { actions, reducer } = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    handleTabChange: (state, action) => {
      state.isTabChange = action.payload;
    },
    handleViewUpdateNotification: (state, action) => {
      const notification_id = action.payload;

      const viewUpdate = (array, id) => {
        let findIndex = array.findIndex((ele) => ele.notification_id === id);
        if (findIndex !== -1) {
          let tempArray = [...array];
          tempArray[findIndex].is_read = 1;
          return tempArray;
        } else {
          return array;
        }
      };
      state.Notifications = {
        ...state.Notifications,
        today: viewUpdate(state.Notifications.today, notification_id),
        yesterday: viewUpdate(state.Notifications.yesterday, notification_id),
        older: viewUpdate(state.Notifications.older, notification_id),
      };
    },
    handleUpdateNotification: (state, action) => {
      const notification_id = action.payload;
      state.Notifications = {
        ...state.Notifications,
        today: state.Notifications.today.filter(
          (ele) => ele.notification_id !== notification_id
        ),
        yesterday: state.Notifications.yesterday.filter(
          (ele) => ele.notification_id !== notification_id
        ),
        older: state.Notifications.older.filter(
          (ele) => ele.notification_id !== notification_id
        ),
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotificationList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchNotificationList.rejected, (state, action) => {
      state.isLoading = false;
      state.isTabChange = false;
    });
    builder.addCase(fetchNotificationList.fulfilled, (state, action) => {
      if (action.payload.current_page_no === 1) {
        state.Notifications = action.payload;
      } else if (action.payload.current_page_no === 0) {
        state.Notifications = {
          today: [],
          yesterday: [],
          older: [],
          total_pages: 0,
          current_page_no: 0,
          msg: 0,
        };
      } else {
        const getMergedData = (pre, newData) => {
          let filterData = [...pre, ...newData].reduce((acc, current) => {
            const x = acc.find((item) =>
              item.notification_id
                ? item.notification_id === current.notification_id
                : item.nugget_id === current.nugget_id
            );
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          return filterData;
        };

        state.Notifications = {
          today: getMergedData(state.Notifications.today, action.payload.today),
          yesterday: getMergedData(
            state.Notifications.yesterday,
            action.payload.yesterday
          ),
          older: getMergedData(state.Notifications.older, action.payload.older),
          total_pages: action.payload.total_pages,
          current_page_no: action.payload.current_page_no,
          msg: action.payload.msg,
        };
      }
      state.isLoading = false;
      state.isTabChange = false;
    });
  },
});

export const {
  handleTabChange,
  handleUpdateNotification,
  handleViewUpdateNotification,
} = actions;

export default reducer;
