import React, { useEffect } from "react";
import { DatePicker, Form, Input } from "antd";
import { Col, Row } from "react-bootstrap";
import classes from "../Events.module.css";
import { useAuthToken } from "../../../Shared/Reduxfetcher";
import {
  BannerComponent,
  Connections,
  EventTypeComponent,
  InviteEmailComponent,
  TimeValueComponent,
} from "./Utility";
import { useFormik } from "formik";
import dayjs from "dayjs";
import * as yup from "yup";
import {
  addLiveEventService,
  editLiveEventService,
  viewEventsService,
} from "../../../Services/ApiService";
import { filterValidObject, JSONtoformdata } from "../../../Shared/Utility";
import { toast } from "react-hot-toast";
import EventModal from "../../../Modal/Event/EventModal";

const validationSchema = yup.object().shape({
  event_title: yup.string().required(`Event Title is Required !`),
  event_type: yup.string().required(`Event Type is Required !`),
  event_start_date: yup.string().required(`Event Start Date is Required !`),
  event_start_time: yup.string().required(`Event Start Time is Required !`),
  event_banner: yup.string().required(`Event Banner is Required !`),
});

const AddLiveEvent = ({ isTalkshowOpen, setisTalkshowOpen, data }) => {
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
      event_title: "",
      event_type: "",
      event_start_date: "",
      event_start_time: "",
      event_banner: "",
      event_invite_mails: "",
      event_invite_friends: "",
      event_invite_groups: "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (val) => {
      if (data) {
        HandleEditLiveEvent(val);
      } else {
        HandleLiveEvent(val);
      }
    },
  });

  const HandleLiveEvent = (val) => {
    let liveEventData = {
      token: token,
      ...val,
    };

    addLiveEventService(JSONtoformdata(filterValidObject(liveEventData)))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setisTalkshowOpen(false);
        resetForm();
      });
  };

  const HandleEditLiveEvent = (val) => {
    let liveEventData = {
      token: token,
      event_id: data?.event_id,
      ...val,
    };
    if (typeof liveEventData.event_banner === "string") {
      delete liveEventData.event_banner;
    }
    editLiveEventService(JSONtoformdata(filterValidObject(liveEventData)))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setisTalkshowOpen(false);
        resetForm();
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
            event_title: eventData?.event_name,
            event_type: eventData?.event_type_id,
            event_start_date: dayjs(eventData?.start_date_time).format(
              "YYYY-MM-DD"
            ),
            event_start_time: dayjs(eventData?.start_date_time).format("HH:mm"),
            event_banner: eventData?.banner_image,
            event_invite_mails: eventData?.invite_mails,
            event_invite_friends: eventData?.invite_friends_id,
            event_invite_groups: eventData?.invite_groups_id,
          });
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  }, [data]);

  return (
    <EventModal
      open={isTalkshowOpen}
      isUpdate={data ? true : false}
      onSuccess={() => {
        handleSubmit();
      }}
      onClose={() => {
        setisTalkshowOpen(false);
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
                className={classes.textbox}
                format={"YYYY-MM-DD"}
                onChange={(date, dateString) => {
                  setFieldValue(
                    "event_start_date",
                    dayjs(dateString).format("YYYY-MM-DD")
                  );
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
                console.log(res);
                setFieldValue(
                  "event_start_time",
                  dayjs(res, "hh:mm A").format("HH:mm")
                );
              }}
            />
            {touched.event_start_time && (
              <p className="ErrTxt mb-3">{errors?.event_start_time}</p>
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
          <Col sm={12}>
            <InviteEmailComponent
              onResult={(val) => {
                setFieldValue("event_invite_mails", val.toString());
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
                setFieldValue("event_invite_friends", JSON.stringify(finRes));
              }}
            />
            {touched.event_invite_friends && (
              <p className="ErrTxt mb-3">{errors?.event_invite_friends}</p>
            )}
          </Col>
        </Row>
      </Form>
    </EventModal>
  );
};

export default AddLiveEvent;
