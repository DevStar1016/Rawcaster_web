import { Button, DatePicker, Form, Input, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import EventModal from "../../Modal/EventModal";
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
        <Form
          layout="vertical"
          autoComplete="off"
          className={classes.eventBody}
        >
          <Row>
            <Col sm={6}>
              <Form.Item
                label="Event Title"
                name="event_title"
                colon={false}
                className={classes.textBoxSec}
              >
                <Input className={classes.textbox} />
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item
                label="Event Type"
                name="event_type"
                colon={false}
                className={classes.textBoxSec}
              >
                <Select
                  className={classes.textbox}
                  options={[
                    { value: "jack", label: "Jack" },
                    { value: "lucy", label: "Lucy" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item
                label="Date"
                name="date"
                colon={false}
                className={classes.textBoxSec}
              >
                <DatePicker
                  showToday={false}
                  className={classes.textbox}
                  onChange={(date, dateString) => {
                    console.log(date, dateString);
                  }}
                />
              </Form.Item>
            </Col>
            <Col sm={6}>
              {/* <Form.Item
                label="Date"
                name="date"
                colon={false}
                className={classes.textBoxSec}
              >
                <div className={classes.textbox}>
                  <TimePicker
                    showNow={false}
                    onChange={(time, timeString) => {
                      console.log(time, timeString);
                    }}
                    format={"HH:mm"}
                    use12Hours
                    defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  />
                  <Select
                    className={classes.textbox}
                    options={[
                      { value: "jack", label: "Jack" },
                      { value: "lucy", label: "Lucy" },
                    ]}
                  />
                </div>
              </Form.Item> */}
            </Col>
          </Row>
        </Form>
      </EventModal>
    </div>
  );
};

export default CreateEvent;
