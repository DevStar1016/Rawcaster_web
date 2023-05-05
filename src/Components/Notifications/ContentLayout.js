import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import classes from "./Notification.module.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Tabs } from "antd";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import { NotificationContext } from "../../Shared/Context";
import { ListNotificationService } from "../../Services/ApiService";
import { JSONtoformdata, utctoUserTimezone } from "../../Shared/Utility";
import moment from "moment";
import Content from "./Content";
import { getUserTimeZone } from "./Utility";

let TabsValues = [
  { key: 0, id: 5, label: "Fans", children: null },
  { key: 1, id: 4, label: "Groups", children: null },
  { key: 2, id: 3, label: "Connections", children: null },
  { key: 3, id: 2, label: "Events", children: null },
  { key: 4, id: 1, label: "Nuggets", children: null },
  { key: 5, id: 6, label: "Poll Resullts", children: null },
];

const ContentLayout = () => {
  const token = useAuthToken();
  const { userSettings } = useAuth();
  const [selectedIndex, setselectedIndex] = useState(0);

  const getTimeZone = (date, format = null) => {
    return getUserTimeZone(date, format, userSettings);
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
            const result = res.data.notification_list;
            const today = moment();
            const yesterday = moment().subtract(1, "days");
            const todayItems = result.filter(
              (item) =>
                getTimeZone(item.created_datetime, "YYYY-MM-DD HH:mm:ss") >
                getTimeZone(today)
            );
            const yesterdayItems = result.filter(
              (item) =>
                getTimeZone(item.created_datetime, "YYYY-MM-DD HH:mm:ss") >
                  getTimeZone(yesterday) &&
                getTimeZone(item.created_datetime, "YYYY-MM-DD HH:mm:ss") <
                  getTimeZone(today)
            );
            const olderItems = result.filter(
              (item) =>
                getTimeZone(item.created_datetime, "YYYY-MM-DD HH:mm:ss") <
                getTimeZone(yesterday)
            );
            resolve({
              today: todayItems,
              yesterday: yesterdayItems,
              older: olderItems,
            });
          } else {
            resolve({
              today: [],
              yesterday: [],
              older: [],
            });
          }
        })
        .catch(() => {
          resolve({
            today: [],
            yesterday: [],
            older: [],
          });
        });
    });
    return promise;
  };

  const handleChangeIndex = (index) => {
    setselectedIndex(index);
  };

  const NotificationValues = {
    getNotificationList,
  };

  return (
    <NotificationContext.Provider value={NotificationValues}>
      <div
        className={`flex-column ${classes.NotificationContent} notificationContainer`}
      >
        <Tabs
          defaultActiveKey="1"
          tabPosition={"top"}
          style={{ width: 370 }}
          items={TabsValues}
          activeKey={selectedIndex}
          onClick={(key) => {
            console.log(key);
          }}
          onSelect={(key) => {
            console.log(key);
          }}
          onChange={(key) => {
            setselectedIndex(key);
          }}
        />
        <SwipeableViews index={selectedIndex} onChangeIndex={handleChangeIndex}>
          {TabsValues.map((ele) => (
            <Content elem={ele} />
          ))}
        </SwipeableViews>
      </div>
    </NotificationContext.Provider>
  );
};

export default ContentLayout;
