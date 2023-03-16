import { Button } from "antd";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import AddLiveEvent from "./Configure/AddLiveEvent";
import classes from "./Events.module.css";

const CreateEvent = () => {
  const [isTalkshowOpen, setisTalkshowOpen] = useState(false);

  return (
    <div>
      <Row>
        <Col>
          <Button
            type="primary"
            size={"large"}
            className={classes.eventShowBtn}
          >
            Create Event
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            size={"large"}
            className={classes.talkShowBtn}
            onClickCapture={() => {
              setisTalkshowOpen(true);
            }}
          >
            Create Talkshow
          </Button>
        </Col>
      </Row>

      <AddLiveEvent
        isTalkshowOpen={isTalkshowOpen}
        setisTalkshowOpen={setisTalkshowOpen}
      />
    </div>
  );
};

export default CreateEvent;
