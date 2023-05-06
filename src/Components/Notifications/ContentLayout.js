import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import classes from "./Notification.module.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Tabs } from "antd";
import Content from "./Content";

let TabsValues = [
  { key: 0, id: 5, label: "Fans", children: null },
  { key: 1, id: 4, label: "Groups", children: null },
  { key: 2, id: 3, label: "Connections", children: null },
  { key: 3, id: 2, label: "Events", children: null },
  { key: 4, id: 1, label: "Nuggets", children: null },
  { key: 5, id: 6, label: "Poll Resullts", children: null },
];

const ContentLayout = () => {
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
  );
};

export default ContentLayout;
