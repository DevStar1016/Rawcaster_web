/**
 * A React component that renders a layout for displaying notification content.
 * @returns The rendered React component.
 */
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
import { IS_CHIME_ENABLE } from "../../Shared/Constant";

let TabsValues = [
  { key: 0, id: 5, label: "Fans", children: null, isShow: true },
  { key: 1, id: 4, label: "Groups", children: null, isShow: true },
  { key: 2, id: 3, label: "Connections", children: null, isShow: true },
  { key: 3, id: 2, label: "Events", children: null, isShow: IS_CHIME_ENABLE },
  { key: 4, id: 1, label: "Nuggets", children: null, isShow: true },
  { key: 5, id: 6, label: "Poll Resullts", children: null, isShow: true },
];

const ContentLayout = () => {
  const dispatch = useDispatch();
  const token = useAuthToken();
  const [selectedIndex, setselectedIndex] = useState(0);

  /**
   * Handles the change of the selected index in a tab component.
   * @param {number} index - The index of the selected tab.
   * @returns None
   */
  const handleChangeIndex = (index) => {
    setselectedIndex(index);
    const findKey = TabsValues.find((ele, i) => i === index);
    setselectedIndex(parseInt(findKey.key));
    if (findKey) {
      dispatch(handleTabChange(true));
      dispatch(
        fetchNotificationList({
          token,
          notification_type: findKey.id,
          page_number: 1,
        })
      );
    }
  };

  return (
    <div
      className={`flex-column ${classes.NotificationContent} notificationContainer`}
    >
      <Tabs
        defaultActiveKey="1"
        tabPosition={"top"}
        items={TabsValues.filter((ele) => ele.isShow)}
        activeKey={selectedIndex}
        onChange={(key) => {
          const findId = TabsValues.find(
            (ele) => parseInt(ele.key) === parseInt(key)
          );
          setselectedIndex(parseInt(key));
          dispatch(handleTabChange(true));
          dispatch(
            fetchNotificationList({
              token,
              notification_type: findId.id,
              page_number: 1,
            })
          );
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
