import { Popover } from "antd";
import React from "react";
import Header from "./Header";
import ContentLayout from "./ContentLayout";
import { useState } from "react";
import {
  JSONtoformdata,
  filterValidObject,
  utctoUserTimezone,
} from "../../Shared/Utility";
import {
  ListNotificationService,
  ViewNotificationService,
} from "../../Services/ApiService";
import moment from "moment";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import { NotificationContext } from "../../Shared/Context";
import { toast } from "react-hot-toast";

const Notification = ({ className, src }) => {
  const [TotalUnreadCount, setTotalUnreadCount] = useState(0);
  const token = useAuthToken();
  const { userSettings } = useAuth();
  const [markallAsRead, setmarkallAsRead] = useState(false);

  const getTimeZone = (date) => {
    return utctoUserTimezone(date, userSettings?.time_zone);
  };

  const getNotificationList = (values) => {
    let promise = new Promise((resolve, reject) => {
      let finalData = {
        ...values,
        token,
      };
      ListNotificationService(JSONtoformdata(finalData))
        .then((res) => {
          if (res.data.status === 1) {
            setTotalUnreadCount(res.data.total_unread_count);
            const result = res.data.notification_list;
            const today = moment().format("YYYY-MM-DD HH:mm:ss");
            const yesterday = moment()
              .subtract(1, "days")
              .format("YYYY-MM-DD HH:mm:ss");

            const todayItems = result.filter((item) => {
              const todayValue = moment(getTimeZone(today)).format(
                "YYYY-MM-DD"
              );
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
              const oldValue = moment(getTimeZone(yesterday)).format(
                "YYYY-MM-DD"
              );
              const createdValue = moment(
                getTimeZone(item.created_datetime)
              ).format("YYYY-MM-DD");

              return moment(createdValue).isBefore(oldValue);
            });
            resolve({
              today: todayItems,
              yesterday: yesterdayItems,
              older: olderItems,
              total_pages: res.data.total_pages,
              current_page_no: res.data.current_page_no,
              msg: res.data.msg,
            });
          } else {
            resolve({
              today: [],
              yesterday: [],
              older: [],
              total_pages: 0,
              current_page_no: 0,
              msg: res.data.msg,
            });
          }
        })
        .catch((err) => {
          resolve({
            today: [],
            yesterday: [],
            older: [],
            total_pages: 0,
            current_page_no: 0,
            msg: err.message,
          });
        });
    });
    return promise;
  };

  const handleViewNotification = (notification_id, mark_all_as_read = null) => {
    let promise = new Promise((resolve, reject) => {
      const ViewData = {
        token,
        notification_id,
        mark_all_as_read,
      };
      ViewNotificationService(JSONtoformdata(filterValidObject(ViewData)))
        .then(({ data }) => {
          if (data.status === 1) {
            resolve(notification_id);
            setmarkallAsRead();
          } else {
            toast.error(data.msg);
          }
        })
        .catch((err) => {});
    });
    return promise;
  };

  const NotificationValues = {
    getNotificationList,
    handleViewNotification,
    markallAsRead,
    setmarkallAsRead,
    TotalUnreadCount,
  };

  return (
    <NotificationContext.Provider value={NotificationValues}>
      <div className={"onlydes"}>
        <Popover
          placement="bottom"
          title={<Header />}
          content={<ContentLayout />}
          showArrow={false}
          trigger="click"
          align="end"
        >
          <img src={src} alt="Notification_logo" className={className} />
        </Popover>
      </div>

      <div className="onlyMob">
        <Header />
        <ContentLayout />
      </div>
    </NotificationContext.Provider>
  );
};

export default Notification;
