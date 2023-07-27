import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import classes from "./Notification.module.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Tabs } from "antd";
import Content from "./Content";
import { fetchNotificationList } from "../../Store/Redux/Action";
import { useDispatch } from "react-redux";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { handleTabChange } from "../../Store/Redux/Reducer/NotificationsReducer";

let TabsValues = [
  { key: 0, id: 5, label: "Fans", children: null },
  { key: 1, id: 4, label: "Groups", children: null },
  { key: 2, id: 3, label: "Connections", children: null },
  { key: 3, id: 2, label: "Events", children: null },
  { key: 4, id: 1, label: "Nuggets", children: null },
  { key: 5, id: 6, label: "Poll Resullts", children: null },
];

const ContentLayout = () => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const [selectedIndex, setselectedIndex] = useState(0);
  const handleChangeIndex = (index) => {
    setselectedIndex(index);
  };

  return (
    <div
      className={`flex-column ${classes.NotificationContent} notificationContainer`}
    >
      <Tabs
        defaultActiveKey="1"
        tabPosition={"top"}
        items={TabsValues}
        activeKey={selectedIndex}
        onChange={(key) => {
          const findId = TabsValues.find(
            (ele) => parseInt(ele.key) === parseInt(key)
          );
          dispatch(handleTabChange(true));
          dispatch(
            fetchNotificationList({
              token,
              notification_type: findId.id,
              page_number: 1,
            })
          );
          setselectedIndex(parseInt(key));
        }}
      />
      <SwipeableViews index={selectedIndex} onChangeIndex={handleChangeIndex}>
        {TabsValues.map((ele) => (
          <Content elem={ele} />
        ))}
      </SwipeableViews>
    </div>
  );
};

export default ContentLayout;
