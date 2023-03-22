import { Button } from "antd";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import AddLiveEvent from "./Configure/AddLiveEvent";
import classes from "./Events.module.css";
import talkshowIcon from "../../Assets/Images/svg/talkshowIcon.svg";
import eventIcon from "../../Assets/Images/svg/eventIcon.svg";

const CreateEvent = () => {
  const [isTalkshowOpen, setisTalkshowOpen] = useState(false);

  return (
    <div>      
          <Button
            type="primary"
            size={"large"}
            className={classes.eventShowBtn}
          >
            <img src={talkshowIcon}/> Create Talkshow
          </Button>
          <Button
            type="primary"
            size={"large"}
            className={classes.talkShowBtn}
            onClickCapture={() => {
              setisTalkshowOpen(true);
            }}
          >
            <img src={eventIcon}/> Create Event
          </Button>

      <AddLiveEvent
        isTalkshowOpen={isTalkshowOpen}
        setisTalkshowOpen={setisTalkshowOpen}
      />
    </div>
  );
};

export default CreateEvent;
