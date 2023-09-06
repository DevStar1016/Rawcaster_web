/**
 * A component that allows the user to select a poll date and time.
 * @param {function} onSelectDate - A callback function that is called when a date and time is selected.
 * @returns The PollDateinputBox component.
 */
import { Col, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { isValidData } from "../Shared/Utility";

const PollDateinputBox = ({ onSelectDate }) => {
  const [pollTime, setpollTime] = useState({
    day: 1,
    hours: 0,
    minutes: 0,
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
      if (
        pollTime.day === 0 &&
        pollTime.hours === 0 &&
        pollTime.minutes === 0
      ) {
        onSelectDate("");
      } else if (pollTime.day >= 1 || pollTime.hours >= 1) {
        onSelectDate(pollTime);
      } else if (
        pollTime.day === 0 &&
        pollTime.hours === 0 &&
        pollTime.minutes >= 5
      ) {
        onSelectDate(pollTime);
      } else {
        onSelectDate("");
      }
    } else {
      onSelectDate("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollTime]);

  // useEffect(() => {
  //   if (pollTime.day === 0 && pollTime.hours === 0 && pollTime.minutes !== "") {
  //     setpollTime((pre) => ({ ...pre, minutes: 0 }));
  //   }
  // }, [pollTime]);

  const getValidMinute = () => {
    if (pollTime.day === 0 && pollTime.hours === 0) {
      return 5;
    } else {
      return 0;
    }
  };

  return (
    <div>
      <Row gutter={15}>
        <Col xs={24} sm={8}>
          <Select
            style={{ width: "100%" }}
            placeholder="Day"
            className="textBox mb-2"
            value={getSelectedVal(pollTime.day, "Days")}
            options={getValues(7, 0)}
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
            options={getValues(60, getValidMinute())}
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
