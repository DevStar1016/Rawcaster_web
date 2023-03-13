import { Col, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { isValidData } from "../Shared/Utility";

const PollDateinputBox = ({ onSelectDate }) => {
  const [pollTime, setpollTime] = useState({
    day: "",
    hours: "",
    minutes: "",
  });
  const getValues = (length, increase) => {
    let timeval = [...Array(length)];
    return timeval.map((ele, index) => {
      return { label: index + increase, value: index + increase };
    });
  };

  const getSelectedVal = (val, label) => {
    if (val && val !== "") {
      return { value: val + " " + label, label: val + " " + label };
    } else if (val === 0) {
      return { value: val + " " + label, label: val + " " + label };
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (
      isValidData(pollTime.day.toString()) &&
      isValidData(pollTime.hours.toString()) &&
      isValidData(pollTime.minutes.toString())
    ) {
      onSelectDate(pollTime);
    } else {
      onSelectDate("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollTime]);

  return (
    <div>
      <Row gutter={15}>
      <Col xs={24} sm={8}>
        <Select
          style={{ width: "100%" }}
          placeholder="Day"
          className="textBox mb-2"
          value={getSelectedVal(pollTime.day, "Days")}
          options={getValues(7, 1)}
          onChange={(val) => {
            setpollTime((pre) => ({ ...pre, day: val }));
          }}
        />
      </Col>
      <Col xs={24} sm={8}>
        <Select
          style={{ width: "100%" }}
          placeholder="Hours"
          className="textBox mb-2"
          value={getSelectedVal(pollTime.hours, "Hours")}
          options={getValues(24, 0)}
          onChange={(val) => {
            setpollTime((pre) => ({ ...pre, hours: val }));
          }}
        />
      </Col>
      <Col xs={24} sm={8}>
        <Select
          style={{ width: "100%" }}
          placeholder="Minutes"
          className="textBox mb-2"
          value={getSelectedVal(pollTime.minutes, "Minutes")}
          options={getValues(60, 0)}
          onChange={(val) => {
            setpollTime((pre) => ({ ...pre, minutes: val }));
          }}
        />
      </Col>
      </Row>
    </div>
  );
};

export default PollDateinputBox;
