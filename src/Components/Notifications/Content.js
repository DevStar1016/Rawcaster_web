import React, { useEffect, useState } from "react";
import classes from "./Notification.module.css";
import { useNotificationContext } from "../../Shared/Context";
import { useAuth } from "../../Shared/Reduxfetcher";
import { NotificationsList } from "./Utility";

const Content = ({ elem }) => {
  const { userSettings } = useAuth();
  const { getNotificationList } = useNotificationContext();
  const [NotificationList, setNotificationList] = useState({
    today: [],
    yesterday: [],
    older: [],
  });

  const getFansData = (page = 1) => {
    if (userSettings) {
      let formData = {
        page_number: page,
        notification_type: elem.id,
      };
      getNotificationList(formData).then((res) => {
        setNotificationList(res);
      });
    }
  };
  useEffect(() => {
    getFansData(1);
  }, [userSettings]);

  return (
    <div className={classes.listSec}>
      {NotificationList.today.length !== 0 && (
        <>
          <h3>Today</h3>
          {NotificationList.today.map((ele) => (
            <NotificationsList
              ele={ele}
              id={elem.id}
              userSettings={userSettings}
            />
          ))}
        </>
      )}
      {NotificationList.yesterday.length !== 0 && (
        <>
          <h3>Yesterday</h3>
          {NotificationList.yesterday.map((ele) => (
            <NotificationsList
              ele={ele}
              id={elem.id}
              userSettings={userSettings}
            />
          ))}
        </>
      )}
      {NotificationList.older.length !== 0 && (
        <>
          <h3>Older</h3>
          {NotificationList.older.map((ele) => (
            <NotificationsList
              ele={ele}
              id={elem.id}
              userSettings={userSettings}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Content;
