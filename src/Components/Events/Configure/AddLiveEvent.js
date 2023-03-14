import React, { useEffect, useState } from "react";
import { DatePicker, Form, Input, Select, TimePicker } from "antd";
import { Col, Row } from "react-bootstrap";
import classes from "../Events.module.css";
import { toast } from "react-hot-toast";
import { useAuthToken } from "../../../Shared/Reduxfetcher";
import { getEventType, useEventType } from "./Utility";

const AddLiveEvent = () => {
  const token = useAuthToken();
  const userData = useEventType(token);

  const [externalMailId, setExternalMailId] = useState([]);
  const [bannerImage, setbannerImage] = useState("");
  const [showTimePicker, setshowTimePicker] = useState(false);

  useEffect(() => {
    console.log(userData);
  }, []);

  const addExtMailHandler = (data) => {
    let maildata = data.trim();
    let mailArr;
    if ((maildata.match(/,/g) || []).length) {
      mailArr = maildata.split(",");
    } else {
      mailArr = maildata.split(" ");
    }

    let newMail = [];
    // var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    mailArr.forEach((val) => {
      if (
        val.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ) {
        newMail.push(val);
      }
    });
    if (newMail.length > 0) {
      document.getElementById("extmail").value = "";
      setExternalMailId((prev) => [...prev, ...newMail]);
    }
  };

  const validateImage = (image) => {
    if (typeof image.type !== "undefined" && image.type.includes("image/")) {
      setbannerImage(image);
    } else {
      toast.error("upload only image");
    }
  };

  const removeExtMailHandler = (index) => {
    let mailList = [...externalMailId];
    if (mailList.length > index) {
      mailList.splice(index, 1);
    }
    setExternalMailId(mailList);
  };
  return (
    <Form layout="vertical" autoComplete="off" className={classes.eventBody}>
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
          <div className={classes.lableTxt}>Time</div>
          <div className={classes.timeSec}>
            <Form.Item
              name="evttime"
              required={false}
              colon={false}
              className={`${classes.timepicker} timepicker`}
            >
              <TimePicker
                className={`${classes.onlytime} ${classes.textbox}`}
                suffixIcon={null}
                format={"hh:mm"}
                open-={showTimePicker}
                use12Hours={true}
                onSelect={(time) => {
                  setshowTimePicker(false);
                  console.log(time);
                }}
                onOpenChange={(val) => {
                  setshowTimePicker(true);
                  console.log(val);
                }}
                minuteStep={5}
                showNow={false}
              />
            </Form.Item>
            <Form.Item
              name="evttimeampm"
              // initialValue={moment(selectedTime).format("A") == "AM" ? 1 : 2}
              className={classes.timedropdown}
            >
              <Select className={`${classes.onlytime2} ${classes.textbox}`}>
                <Select.Option key={1} value={1}>
                  AM
                </Select.Option>
                <Select.Option key={2} value={2}>
                  PM
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Col>
        <Col sm={12}>
          <div
            className={`${classes.uploadbanner}  pointer`}
            onClick={() => {
              document.getElementById("imageUpload").click();
            }}
          >
            {bannerImage ? (
              <img
                src={URL.createObjectURL(bannerImage)}
                alt=""
                width="100%"
                height="100%"
                style={{
                  zIndex: 0,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                }}
              ></img>
            ) : (
              <div>
                <div
                  style={{
                    color: "#1d1d1d",
                    opacity: "0.5",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                >
                  Upload Banner Photo
                </div>
                <div
                  style={{
                    color: "#1d1d1d",
                    fontSize: "12px",
                    opacity: "0.5",
                    textAlign: "center",
                  }}
                >
                  Recommended size 500x300
                </div>
              </div>
            )}
            <input
              type="file"
              id="imageUpload"
              name="imageUpload"
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => {
                validateImage(e.target.files[0]);
              }}
            ></input>
          </div>
        </Col>
        <Col sm={12}>
          <div className={classes.lableTxt}> Invite Users</div>
          <div
            className={classes.extMail}
            onClick={() => {
              document.getElementById("extmail").focus();
            }}
          >
            {externalMailId.map((m, index) => {
              return (
                <span
                  key={index}
                  className={classes.displayuser + " pointer"}
                  style={{ cursor: "pointer" }}
                  onClick={() => removeExtMailHandler(index)}
                >
                  {m}
                </span>
              );
            })}

            <input
              type="text"
              id="extmail"
              name="extMail"
              placeholder={
                externalMailId.length === 0
                  ? "Enter email address to send event invitation"
                  : ""
              }
              className={classes.ExtUser}
              onKeyDown={(e) => {
                const x = e.keyCode || e.which;
                // alert(x);
                if ((!e.shiftKey && x === 13) || x === 44 || x === 32) {
                  e.preventDefault();
                  addExtMailHandler(e.target.value);
                }
              }}
              onBlur={(e) => {
                addExtMailHandler(e.target.value);
              }}
            ></input>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default AddLiveEvent;
