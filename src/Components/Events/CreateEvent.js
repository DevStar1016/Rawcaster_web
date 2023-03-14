import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import EventModal from "../../Modal/EventModal";
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
      <EventModal
        open={isTalkshowOpen}
        onSuccess={() => {
          setisTalkshowOpen(false);
        }}
        onClose={() => {
          setisTalkshowOpen(false);
        }}
      >
        <AddLiveEvent />
      </EventModal>
    </div>
  );
};

export default CreateEvent;
