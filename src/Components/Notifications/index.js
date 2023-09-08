/**
 * A React component that renders the header section of the notification module.
 * It displays the title "Notifications" and the unread count of notifications.
 * It also provides a button to mark all notifications as read.
 * @returns {JSX.Element} - The rendered header component.
 */
import { Badge, Popover } from "antd";
import React, { useEffect } from "react";
import Header from "./Header";
import ContentLayout from "./ContentLayout";
import { useState } from "react";
import {
  JSONtoformdata,
  detectMob,
  filterValidObject,
} from "../../Shared/Utility";
import { ViewNotificationService } from "../../Services/ApiService";
import { useDispatch, useSelector } from "react-redux";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { NotificationContext } from "../../Shared/Context";
import { toast } from "react-hot-toast";
import classes from "./Notification.module.css";
import { handleNotificationUnreadCount } from "../../Store/Redux/Reducer/DashboardReducer";
import { handleLoginData } from "../../Store/Redux/Reducer/AuthReducer";
import { fetchNotificationList } from "../../Store/Redux/Action";

const Notification = ({ className, src, onReadCountChange, unReadCount }) => {
  const loginuserData = useAuthData();
  const UnReadCount = useSelector(
    (state) => state.dashboard.notificationUnreadCount
  );
  const dispatch = useDispatch();
  const [TotalUnreadCount, setTotalUnreadCount] = useState(0);
  const [isPopupOpen, setisPopupOpen] = useState(false);
  const token = useAuthToken();
  const [markallAsRead, setmarkallAsRead] = useState(false);

  /**
   * useEffect hook that updates the total unread count whenever the unReadCount value changes.
   * @param {number} unReadCount - The current unread count value.
   * @returns None
   */
  useEffect(() => {
    setTotalUnreadCount(unReadCount);
  }, [unReadCount]);

  /**
   * Handles the view notification action by sending a request to the server to mark the
   * notification as read and updating the necessary state variables.
   * @param {number} notification_id - The ID of the notification to be viewed.
   * @param {boolean} [mark_all_as_read=null] - Optional parameter to mark all notifications as read.
   * @returns {Promise<number>} - A promise that resolves with the notification ID if the request is successful.
   */
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
            if (mark_all_as_read) {
              dispatch(handleNotificationUnreadCount(0));
              dispatch(
                handleLoginData({
                  ...loginuserData,
                  unread_notification_count: 0,
                })
              );
            } else {
              dispatch(
                handleNotificationUnreadCount(
                  UnReadCount > 0 ? UnReadCount - 1 : 0
                )
              );
              dispatch(
                handleLoginData({
                  ...loginuserData,
                  unread_notification_count:
                    UnReadCount > 0 ? UnReadCount - 1 : 0,
                })
              );
            }
          } else {
            toast.remove("rawcaster");
            toast.error(data.msg, { id: "rawcaster" });
          }
        })
        .catch((err) => {});
    });
    return promise;
  };

  /**
   * useEffect hook that updates the read count and total unread count when the login user data changes.
   * @param {object} loginuserData - The login user data object.
   * @returns None
   */
  useEffect(() => {
    if (loginuserData) {
      onReadCountChange(loginuserData?.unread_notification_count);
      setTotalUnreadCount(loginuserData?.unread_notification_count);
    }
  }, [loginuserData]);

  const NotificationValues = {
    handleViewNotification,
    markallAsRead,
    setmarkallAsRead,
    TotalUnreadCount,
    UnReadCount,
  };

  return (
    <NotificationContext.Provider value={NotificationValues}>
      <div className={classes.onlydes}>
        <Popover
          placement="bottom"
          title={<Header />}
          content={<ContentLayout />}
          showArrow={false}
          trigger="click"
          align="end"
        >
          {!detectMob() && (
            <Badge count={UnReadCount} overflowCount={99} color="#F2718D">
              <img
                src={src}
                alt="Notification_logo"
                className={className}
                onClick={() => {
                  if (!isPopupOpen) {
                    dispatch(
                      fetchNotificationList({ token, notification_type: 5 })
                    );
                  }
                  setisPopupOpen(!isPopupOpen);
                }}
              />
            </Badge>
          )}
        </Popover>
      </div>
      <div className="onlyMob">
        <div className={classes.mobNotification}>
          <Header />
          <ContentLayout />
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export default Notification;
