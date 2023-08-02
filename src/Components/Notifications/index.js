import { Badge, Popover } from "antd";
import React, { useEffect } from "react";
import Header from "./Header";
import ContentLayout from "./ContentLayout";
import { useState } from "react";
import { JSONtoformdata, filterValidObject } from "../../Shared/Utility";
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

  useEffect(() => {
    setTotalUnreadCount(unReadCount);
  }, [unReadCount]);

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

            dispatch(handleNotificationUnreadCount(0));
            dispatch(
              handleLoginData({
                ...loginuserData,
                unread_notification_count: 0,
              })
            );
          } else {
            toast.error(data.msg);
          }
        })
        .catch((err) => {});
    });
    return promise;
  };

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
