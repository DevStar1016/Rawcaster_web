import { useEffect, useState } from "react";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { getEventType } from "../../Shared/CommonApis";
import { Form, Select } from "antd";
import classes from "./Settings.module.css";

export const getValidDisplayData = (Data, val, idType = "value") => {
  let findValue = Data.find((ele) => parseInt(ele[idType]) === val);
  if (findValue) {
    return findValue.label;
  } else {
    return "";
  }
};

export const EventTypeComponent = ({ onResult, value }) => {
  const token = useAuthToken();
  const [EventData, setEventData] = useState([]);

  useEffect(() => {
    getEventType(token).then((res) => {
      setEventData(res);
    });
  }, []);

  const getDisplayName = () => {
    let findEvent = EventData.find((ele) => ele.id === parseInt(value));
    if (findEvent) {
      return findEvent;
    } else {
      return null;
    }
  };
  return (
    <Form.Item colon={false} className={classes.textBoxSec}>
      <Select
        options={EventData}
        className={classes.textbox}
        value={getDisplayName()}
        onSelect={(val, value) => {
          onResult(value);
        }}
      />
    </Form.Item>
  );
};
