import React, { useRef, useState } from "react";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import SwipeableViews from "react-swipeable-views";
import classes from "./Notification.module.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Connections from "./Connections";
import Fans from "./Fans";
import Groups from "./Groups";
import { useSwipeable } from "react-swipeable";

const ContentLayout = () => {
  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log("User Swiped!", eventData),
    delta: 10, // min distance(px) before a swipe starts. *See Notes*
    preventScrollOnSwipe: false, // prevents scroll during swipe (*See Details*)
    trackTouch: true, // track touch input
    trackMouse: false, // track mouse input
    rotationAngle: 0, // set a rotation angle
    swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
    touchEventOptions: { passive: true },
  });
  const tabRef = useRef(0);
  let tabs = [
    { id: 0, Title: "Connections" },
    { id: 1, Title: "Events" },
    { id: 2, Title: "Nuggets" },
    { id: 3, Title: "Poll Resullts" },
  ];
  const [selectedIndex, setselectedIndex] = useState(0);

  const handleChangeIndex = (index) => {
    setselectedIndex(index);
  };

  return (
    <div className={`flex-column ${classes.NotificationContent}`}>
      <div className={`${classes.NotificationSec}  notficationContainer`}>
        {/* <OwlCarousel className="owl-theme" margin={25} dots={false} sw> */}
        <div
          {...handlers}
          className={`d-flex flex-row ${classes.listSec}`}
          style={{ touchAction: "pan-y" }}
        >
          {tabs.map((ele, index) => {
            return (
              <div
                className={`${classes.NotificationItem} ${
                  parseInt(selectedIndex) === index && classes.Active
                }`}
                onClick={() => {
                  tabRef.current = ele.id;
                  setselectedIndex(ele.id);
                }}
              >
                <h4>{ele.Title}</h4>
              </div>
            );
          })}
        </div>
        {/* </OwlCarousel> */}
      </div>

      <br />
      <SwipeableViews index={selectedIndex} onChangeIndex={handleChangeIndex}>
        <Connections />
        <Fans />
        <Groups />
      </SwipeableViews>
    </div>
    // <Tabs
    //   defaultActiveKey="home"
    //   transition={false}
    //   id="noanim-tab-example"
    //   className="mb-3 notficationContainer"
    // >
    //   <Tab eventKey="home" title="Fans">
    //     <div>1233</div>
    //     {/* <Fans /> */}
    //   </Tab>
    //   <Tab eventKey="profile" title="Groups">
    //     <div>1233</div>
    //     {/* <Groups /> */}
    //   </Tab>
    //   <Tab eventKey="contact" title="Connections">
    //     <div>1233</div>
    //     {/* <Connections /> */}
    //   </Tab>
    // </Tabs>
  );
};

export default ContentLayout;
