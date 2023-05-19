import React, { useEffect, useState } from "react";
import { DatePicker, Form, Input } from "antd";
import { Col, Row } from "react-bootstrap";
import classes from "../Events.module.css";
import { useAuth, useAuthToken } from "../../../Shared/Reduxfetcher";
import {
  BannerComponent,
  Connections,
  EventTypeComponent,
  InviteEmailComponent,
  TimeValueComponent,
  getValidarrayData,
} from "./Utility";
import { useFormik } from "formik";

import * as yup from "yup";
import {
  addLiveEventService,
  editLiveEventService,
  viewEventsService,
} from "../../../Services/ApiService";
import {
  decodeHtml,
  filterValidObject,
  JSONtoformdata,
  userTimezonetoUtc,
  utctoUserTimezone,
} from "../../../Shared/Utility";
import { toast } from "react-hot-toast";
import EventModal from "../../../Modal/Event/EventModal";
import moment from "moment";
import { useEventContext } from "../../../Shared/Context";
import dayjs from "dayjs";

const AddLiveEvent = ({ isTalkshowOpen, setisTalkshowOpen, data }) => {
  const { getEvents, ActiveEvent } = useEventContext();
  const { userSettings } = useAuth();
  const [isCreating, setisCreating] = useState(false);
  const [SelectedTime, setSelectedTime] = useState(
    moment().add(10, "minutes").format("HH:mm")
  );
  const token = useAuthToken();
  const {
    values,
    handleChange,
    setFieldValue,
    handleSubmit,
    touched,
    errors,
    setValues,
    resetForm,
  } = useFormik({
    initialValues: {
      event_title: "Rawcaster Talk Show",
      event_type: "",
      event_start_date: moment(new Date()).format("YYYY-MM-DD"),
      event_start_time: moment().add(15, "minutes").format("HH:mm"),
      event_message: "",
      event_banner: "",
      event_invite_mails: "",
      event_invite_friends: "",
      event_invite_groups: "",
    },
    validationSchema: yup.object().shape({
      event_title: yup.string().required(`Event Title is Required !`),
      event_type: yup.string().required(`Event Type is Required !`),
      event_start_date: yup.string().required(`Event Start Date is Required !`),
      event_start_time: yup
        .string()
        .required(`Valid Event Start Time is Required !`),
      // event_banner: yup.string().required(`Event Banner is Required !`),
      event_invite_friends: yup
        .string()
        .test(
          "Invite Friends Test",
          "Please Select Connections",
          function (value) {
            const { event_type, event_invite_mails } = this.parent;
            if (parseInt(event_type) === 2) {
              if (!event_invite_mails) {
                return value;
              } else if (JSON.parse(event_invite_mails).length === 0) {
                return value;
              }
            }
            return true;
          }
        ),
      event_invite_mails: yup
        .string()
        .test("Mail Test", "Please Enter Invite Users", function (value) {
          const { event_type, event_invite_friends } = this.parent;
          if (parseInt(event_type) === 2) {
            if (!event_invite_friends) {
              return value;
            } else if (JSON.parse(event_invite_friends).length === 0) {
              return value;
            }
          }
          return true;
        }),
    }),
    validateOnChange: true,
    onSubmit: (val) => {
      setisCreating(true);
      if (data) {
        HandleEditLiveEvent(val);
      } else {
        HandleLiveEvent(val);
      }
    },
  });
  const handleCloseEvent = () => {
    setisTalkshowOpen(false);
    resetForm();
    setisCreating(false);
    setValues((pre) => ({
      ...pre,
      event_type: userSettings?.event_type,
      event_banner: userSettings?.meeting_header_image,
    }));
  };

  useEffect(() => {
    if (userSettings) {
      setValues((pre) => ({
        ...pre,
        event_type: userSettings?.event_type,
        event_banner: userSettings?.meeting_header_image,
      }));
    }
  }, [userSettings]);

  const HandleLiveEvent = (val) => {
    const dateAndTime =
      moment(val.event_start_date).format("YYYY-MM-DD") +
      " " +
      moment(moment(val.event_start_time, ["HH:mm"])).format("HH:mm:00");
    let utcDateTime = userTimezonetoUtc(dateAndTime, userSettings?.time_zone);
    let liveEventData = {
      ...val,
      token: token,
      event_id: data?.event_id,
      event_start_date: utcDateTime.format("YYYY-MM-DD"),
      event_start_time: utcDateTime.format("HH:mm"),
    };
    if (typeof liveEventData.event_banner === "string") {
      delete liveEventData.event_banner;
    }

    addLiveEventService(JSONtoformdata(filterValidObject(liveEventData)))
      .then((res) => {
        if (res.data.status === 1) {
          getEvents(ActiveEvent.key);
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {})
      .finally(() => {
        handleCloseEvent();
      });
  };

  const HandleEditLiveEvent = (val) => {
    const dateAndTime =
      moment(val.event_start_date).format("YYYY-MM-DD") +
      " " +
      moment(moment(val.event_start_time, ["HH:mm"])).format("HH:mm:00");
    let utcDateTime = userTimezonetoUtc(dateAndTime, userSettings?.time_zone);
    let liveEventData = {
      ...val,
      token: token,
      event_id: data?.event_id,
      event_start_date: utcDateTime.format("YYYY-MM-DD"),
      event_start_time: utcDateTime.format("HH:mm"),
    };
    if (typeof liveEventData.event_banner === "string") {
      delete liveEventData.event_banner;
    }
    editLiveEventService(JSONtoformdata(filterValidObject(liveEventData)))
      .then((res) => {
        if (res.data.status === 1) {
          getEvents(ActiveEvent.key);
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {})
      .finally(() => {
        handleCloseEvent();
      });
  };

  useEffect(() => {
    if (data) {
      let eventdata = {
        token: token,
        event_id: data?.event_id,
      };
      viewEventsService(JSONtoformdata(eventdata))
        .then((res) => {
          let eventData = res.data.event_detail;

          setValues({
            event_title: decodeHtml(eventData?.event_name),
            event_type: eventData?.event_type_id,
            event_start_date: moment(
              utctoUserTimezone(
                eventData?.start_date_time,
                userSettings?.time_zone
              )
            ).format("YYYY-MM-DD"),
            event_message: eventData?.message,
            event_start_time: moment(
              utctoUserTimezone(
                eventData?.start_date_time,
                userSettings?.time_zone
              )
            ).format("HH:mm"),
            event_banner: eventData?.banner_image,
            event_invite_mails: getValidarrayData(eventData?.invite_mails),
            event_invite_friends: getValidarrayData(
              eventData?.invite_friends_id
            ),
            event_invite_groups: getValidarrayData(eventData?.invite_groups_id),
          });
        })
        .catch((err) => {});
    }
  }, [data]);

  return (
    <EventModal
      open={isTalkshowOpen}
      isUpdate={data ? true : false}
      loading={isCreating}
      onSuccess={() => {
        handleSubmit();
      }}
      onClose={() => {
        handleCloseEvent();
      }}
    >
      <Form
        layout="vertical"
        autoComplete="off"
        className={`${classes.eventBody} eventBody`}
      >
        <Row>
          <Col sm={6}>
            <Form.Item
              label="Event Title"
              colon={false}
              className={classes.textBoxSec}
              initialValue={values.event_title}
            >
              <Input
                className={classes.textbox}
                defaultValue={values.event_title}
                value={values.event_title}
                maxLength={80}
                onChange={handleChange("event_title")}
              />
            </Form.Item>
            {touched.event_title && (
              <p className="ErrTxt mb-3">{errors?.event_title}</p>
            )}
          </Col>
          <Col sm={6}>
            <EventTypeComponent
              value={values.event_type}
              onResult={(val) => {
                setFieldValue("event_type", val.id);
              }}
            />
            {touched.event_type && (
              <p className="ErrTxt mb-3">{errors?.event_type}</p>
            )}
          </Col>
          <Col sm={6}>
            <Form.Item
              label="Date"
              colon={false}
              className={classes.textBoxSec}
            >
              <DatePicker
                showToday={false}
                className={classes.textbox}
                defaultValue={
                  values?.event_start_date
                    ? dayjs(values?.event_start_date, "YYYY-MM-DD")
                    : undefined
                }
                value={
                  values?.event_start_date
                    ? dayjs(values?.event_start_date, "YYYY-MM-DD")
                    : undefined
                }
                disabledDate={(current) => {
                  return moment().add(-1, "days") >= current;
                }}
                allowClear={false}
                format={"YYYY-MM-DD"}
                onChange={(date, dateString) => {
                  setFieldValue("event_start_date", dateString);
                  if (
                    moment(new Date()).format("DD:MM:YYYY") ==
                    moment(dateString, "YYYY-MM-DD").format("DD:MM:YYYY")
                  ) {
                    if (
                      !(
                        moment().format("HH:mm") <
                        moment(values.event_start_time, "HH:mm").format("HH:mm")
                      )
                    ) {
                      setFieldValue("event_start_time", "");
                    }
                  } else {
                    setFieldValue("event_start_time", SelectedTime);
                  }
                }}
              />
            </Form.Item>
            {touched.event_start_date && (
              <p className="ErrTxt mb-3">{errors?.event_start_date}</p>
            )}
          </Col>
          <Col sm={6}>
            <div className={classes.lableTxt}>Time</div>
            <TimeValueComponent
              value={values.event_start_time}
              onResult={(res) => {
                setSelectedTime(moment(res, "hh:mm A").format("HH:mm"));
                if (
                  moment().format("DD:MM:YYYY") ==
                  moment(values.event_start_date, "YYYY-MM-DD").format(
                    "DD:MM:YYYY"
                  )
                ) {
                  if (
                    moment().add(10, "minutes").format("HH:mm") <=
                    moment(res, "hh:mm A").format("HH:mm")
                  ) {
                    setFieldValue(
                      "event_start_time",
                      moment(res, "hh:mm A").format("HH:mm")
                    );
                  } else {
                    setFieldValue("event_start_time", "");
                  }
                } else {
                  setFieldValue(
                    "event_start_time",
                    moment(res, "hh:mm A").format("HH:mm")
                  );
                }
              }}
            />
            {touched.event_start_time && (
              <p className="ErrTxt mb-3">{errors?.event_start_time}</p>
            )}
          </Col>
          <Col sm={12}>
            <Form.Item
              label="Event Description"
              colon={false}
              className={classes.textBoxSec}
              initialValue={values.event_message}
            >
              <Input.TextArea
                className={`${classes.textbox} ${classes.textArea}`}
                defaultValue={values.event_message}
                value={values.event_message}
                maxLength={150}
                onChange={handleChange("event_message")}
              />
            </Form.Item>
            {touched.event_message && (
              <p className="ErrTxt mb-3">{errors?.event_message}</p>
            )}
          </Col>
          <Col sm={12}>
            <BannerComponent
              value={values.event_banner}
              onResult={(val) => {
                setFieldValue("event_banner", val);
              }}
            />
            {touched.event_banner && (
              <p className="ErrTxt mb-3">{errors?.event_banner}</p>
            )}
          </Col>
          {parseInt(values.event_type) !== 3 && (
            <>
              <Col sm={12}>
                <InviteEmailComponent
                  value={values.event_invite_mails}
                  onResult={(val) => {
                    if (val.length !== 0) {
                      setFieldValue("event_invite_mails", JSON.stringify(val));
                    } else {
                      setFieldValue("event_invite_mails", "");
                    }
                  }}
                />
                {touched.event_invite_mails && (
                  <p className="ErrTxt mb-3">{errors?.event_invite_mails}</p>
                )}
              </Col>
              <Col>
                <Connections
                  values={values.event_invite_friends}
                  onResult={(val) => {
                    let finRes = val.map((ele) => ele.user_id);
                    if (finRes.length !== 0) {
                      setFieldValue(
                        "event_invite_friends",
                        JSON.stringify(finRes)
                      );
                    } else {
                      setFieldValue("event_invite_friends", "[]");
                    }
                  }}
                />
                {touched.event_invite_friends && (
                  <p className="ErrTxt mb-3">{errors?.event_invite_friends}</p>
                )}
              </Col>
            </>
          )}
        </Row>
      </Form>
    </EventModal>
  );
};

export default AddLiveEvent;
