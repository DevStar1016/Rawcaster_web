import React, { useEffect, useState } from "react";
import { Button, Checkbox, DatePicker, Form, Input, TimePicker } from "antd";
import { Col, Row } from "react-bootstrap";
import classes from "../Events.module.css";
import { useAuth, useAuthToken } from "../../../Shared/Reduxfetcher";
import {
  AudioVideoSettings,
  BannerComponent,
  Connections,
  EventLayoutComponent,
  EventMelodyComponent,
  EventTypeComponent,
  InviteEmailComponent,
  TimeValueComponent,
  compareArrays,
  getValidarrayData,
} from "./Utility";
import { useFormik } from "formik";
import * as yup from "yup";
import EventModal from "../../../Modal/Event/EventModal";
import moment from "moment";
import { EventSettings } from "./Constants";
import { UserOutlined } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import {
  addEventService,
  editEventService,
  viewEventsService,
} from "../../../Services/ApiService";
import {
  JSONtoformdata,
  decodeHtml,
  filterValidObject,
  userTimezonetoUtc,
  utctoUserTimezone,
} from "../../../Shared/Utility";
import { useEventContext } from "../../../Shared/Context";
import dayjs from "dayjs";

const AddEvent = ({ isEventOpen, setisEventOpen, data }) => {
  const { getEvents, ActiveEvent } = useEventContext();
  const token = useAuthToken();
  const { userSettings, loginUserData } = useAuth();
  const [isCreating, setisCreating] = useState(false);
  const [isNextPage, setisNextPage] = useState(false);
  const [SelectedTime, setSelectedTime] = useState(
    moment().add(10, "minutes").format("HH:mm")
  );

  const {
    values,
    handleChange,
    setFieldValue,
    handleSubmit,
    touched,
    errors,
    resetForm,
    validateForm,
    setValues,
  } = useFormik({
    initialValues: {
      event_title: "Rawcaster Event",
      event_type: 1,
      event_start_date: moment(new Date()).format("YYYY-MM-DD"),
      event_start_time: moment().add(15, "minutes").format("HH:mm"),
      waiting_room: "",
      join_before_host: "",
      sound_notify: "",
      user_screenshare: "",
      event_participants: "",
      event_message: "",
      event_duration: "",
      event_layout: "",
      event_melody_id: "",
      event_melody: "",
      event_host_audio: "",
      event_host_video: "",
      event_guest_audio: "",
      event_guest_video: "",
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
      event_participants: userSettings
        ? yup
            .number()
            .min(2, "Enter Valid Count")
            .max(
              parseInt(userSettings?.max_event_participants_count),
              `Maximum ${parseInt(
                userSettings?.max_event_participants_count
              )} participants only allowed`
            )
            .required(`Max Paticipants is Required !`)
        : yup.number(),
      event_duration: yup
        .string()
        .test(
          "validDurationRequired",
          "Valid Duration Required",
          function (item) {
            const hours = moment(item, "HH:mm").get("hours");
            const minutes = moment(item, "HH:mm").get("minutes");
            const currentDuration = moment()
              .add(hours, "hours")
              .add(minutes, "minutes");
            if (currentDuration.isBefore(moment().add(15, "minutes"))) {
              return this.createError({
                message: `Duration must be minimum 15 minutes`,
              });
            } else if (
              currentDuration.isAfter(
                moment().add(userSettings?.max_event_duration, "hours")
              )
            ) {
              return this.createError({
                message: `Max Allowed hours is ${userSettings?.max_event_duration}`,
              });
            }
            return true;
          }
        )
        .required(`Duration is Required !`),
      event_melody_id: yup.string().required(`Media is Required !`),
      event_melody: yup
        .mixed()
        .test("Event Melody test", "Please Upload Media", function (value) {
          const { event_melody_id } = this.parent;
          if (parseInt(event_melody_id) === 0 && value !== "") {
            return false;
          }
          return true;
        }),
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
            }
          }
          return true;
        }),
    }),
    validateOnChange: true,
    onSubmit: (val) => {
      // setisCreating(true);
      if (data) {
        HandleEditEvent(val);
      } else {
        HandleAddEvent(val);
      }
    },
  });

  const handleCloseEvent = () => {
    resetForm();
    setisCreating(false);

    setValues((pre) => ({
      ...pre,
      event_title: "Rawcaster Event",
      event_melody_id: userSettings?.melody,
      waiting_room: userSettings?.waiting_room,
      join_before_host: userSettings?.join_before_host,
      sound_notify: userSettings?.participant_join_sound,
      user_screenshare: userSettings?.screen_share_status,
      event_host_audio: userSettings?.host_audio,
      event_host_video: userSettings?.host_video,
      event_guest_audio: userSettings?.participant_audio,
      event_guest_video: userSettings?.participant_video,
      event_participants: userSettings?.max_event_participants_count,
      event_duration: moment(userSettings?.max_event_duration, "H").format(
        "HH:mm"
      ),
      event_banner: userSettings?.meeting_header_image,
    }));
    setisEventOpen(false);
  };

  const getTitle = () => {
    if (isNextPage) {
      return (
        <div className={classes.headingSec}>
          <span
            class="material-symbols-outlined"
            onClick={() => {
              setisNextPage(false);
            }}
          >
            arrow_back
          </span>
          Personalize Your Event
        </div>
      );
    }
    return (
      <div className={classes.headingSec}>
        {`${data ? "Update" : "Create"} `} Event
      </div>
    );
  };

  const HandleAddEvent = (val) => {
    const dateAndTime =
      moment(val.event_start_date).format("YYYY-MM-DD") +
      " " +
      moment(moment(val.event_start_time, ["HH:mm"])).format("HH:mm:00");
    let utcDateTime = userTimezonetoUtc(dateAndTime, userSettings?.time_zone);
    let liveEventData = {
      ...val,
      token: token,
      event_start_date: utcDateTime.format("YYYY-MM-DD"),
      event_start_time: utcDateTime.format("HH:mm"),
    };

    if (typeof liveEventData.event_banner === "string") {
      delete liveEventData["event_banner"];
    }
    addEventService(JSONtoformdata(filterValidObject(liveEventData)))
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

  const HandleEditEvent = (val) => {
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
    function isFile(obj) {
      return (
        obj &&
        typeof obj === "object" &&
        obj.hasOwnProperty("type") &&
        typeof obj.type === "string"
      );
    }
    if (!isFile(liveEventData.event_melody)) {
      delete liveEventData["event_melody"];
    }

    if (typeof liveEventData.event_banner === "string") {
      delete liveEventData["event_banner"];
    }
    editEventService(JSONtoformdata(filterValidObject(liveEventData)))
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
            event_start_time: moment(
              utctoUserTimezone(
                eventData?.start_date_time,
                userSettings?.time_zone
              )
            ).format("HH:mm"),
            event_message: eventData?.message,
            waiting_room: eventData?.waiting_room,
            join_before_host: eventData?.join_before_host,
            sound_notify: eventData?.sound_notify,
            user_screenshare: eventData?.user_screenshare,
            event_participants: eventData?.no_of_participants,
            event_duration: moment(eventData?.duration, "HH:mm:ss").format(
              "HH:mm"
            ),
            event_layout: eventData?.event_layout_id,
            event_melody_id: eventData?.event_melody_id,
            event_melody: eventData?.melodies,
            event_host_audio: eventData?.default_host_audio,
            event_host_video: eventData?.default_host_video,
            event_guest_audio: eventData?.default_guest_audio,
            event_guest_video: eventData?.default_guest_video,
            event_banner: eventData?.banner_image,
            event_invite_mails: getValidarrayData(eventData?.invite_mails),
            event_invite_friends: getValidarrayData(
              eventData?.invite_friends_id
            ),
            event_invite_groups: getValidarrayData(eventData?.invite_groups_id),
          });
        })
        .catch((err) => {});
    } else {
      if (userSettings) {
        setValues((pre) => ({
          ...pre,
          event_melody_id: userSettings?.melody,
          waiting_room: userSettings?.waiting_room,
          join_before_host: userSettings?.join_before_host,
          sound_notify: userSettings?.participant_join_sound,
          user_screenshare: userSettings?.screen_share_status,
          event_host_audio: userSettings?.host_audio,
          event_host_video: userSettings?.host_video,
          event_guest_audio: userSettings?.participant_audio,
          event_guest_video: userSettings?.participant_video,
          event_participants: userSettings?.max_event_participants_count,
          event_duration: moment(userSettings?.max_event_duration, "H").format(
            "HH:mm"
          ),
          event_banner: userSettings?.meeting_header_image,
        }));
      }
    }
  }, [data, userSettings]);

  return (
    <EventModal
      open={isEventOpen}
      Type={"Event"}
      title={getTitle()}
      hasNextPage={true}
      isUpdate={data ? true : false}
      loading={isCreating}
      okBtnTitle={isNextPage ? null : "Next"}
      onSuccess={() => {
        if (isNextPage) {
          handleSubmit();
        } else {
          let requiredFields = [
            "event_title",
            "event_type",
            "event_start_date",
            "event_start_time",
            "event_participants",
            "event_duration",
            "event_layout",
            "event_melody_id",
            "event_melody",
            "event_host_audio",
            "event_host_video",
            "event_guest_audio",
            "event_guest_audio",
          ];
          validateForm().then((res) => {
            let validatedKeys = Object.keys(res);
            console.log(validatedKeys);
            if (compareArrays(validatedKeys, requiredFields)) {
              handleSubmit();
            } else {
              setisNextPage(true);
            }
          });
        }
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
        {isNextPage ? (
          <>
            <Row>
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
                        console.log(val);
                        setFieldValue("event_invite_mails", val.toString());
                      }}
                    />
                    {touched.event_invite_mails && (
                      <p className="ErrTxt mb-3">
                        {errors?.event_invite_mails}
                      </p>
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
                          setFieldValue("event_invite_friends", "");
                        }
                      }}
                    />
                    {touched.event_invite_friends && (
                      <p className="ErrTxt mb-3">
                        {errors?.event_invite_friends}
                      </p>
                    )}
                  </Col>
                </>
              )}
            </Row>
          </>
        ) : (
          <>
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
                            moment(values.event_start_time, "HH:mm").format(
                              "HH:mm"
                            )
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
                    console.log(res);
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
              <div className="my-2">
                <Row>
                  {EventSettings.map((ele) => {
                    return (
                      <Col sm={6}>
                        <div className={classes.chkboxSec}>
                          <Checkbox
                            checked={values[ele.type]}
                            disabled={
                              loginUserData?.user_status_id === 1 &&
                              ele.isprimary
                            }
                          >
                            {ele.title}
                          </Checkbox>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </div>
              <Col sm={3}>
                <Form.Item
                  label="Max Paticipants"
                  colon={false}
                  className={classes.textBoxSec}
                >
                  <Input
                    style={{ width: "100%" }}
                    prefix={<UserOutlined />}
                    className={classes.maxparticipantInput}
                    defaultValue={values.event_participants}
                    value={values.event_participants}
                    maxLength={8}
                    onChange={handleChange("event_participants")}
                  />
                </Form.Item>
                {touched.event_participants && (
                  <p className="ErrTxt mb-3">{errors?.event_participants}</p>
                )}
              </Col>
              <Col sm={3}>
                <Form.Item
                  label="Duration"
                  colon={false}
                  className={classes.textBoxSec}
                  initialValue={values.event_title}
                >
                  <TimePicker
                    className={`${classes.onlytime} ${classes.textbox}`}
                    format={"HH:mm"}
                    clearIcon={null}
                    showSecond={false}
                    use12Hours={false}
                    inputReadOnly
                    showNow={false}
                    value={
                      values.event_duration
                        ? moment(values.event_duration, "HH:mm")
                        : ""
                    }
                    onSelect={(time) => {
                      setFieldValue(
                        "event_duration",
                        moment(time).format("HH:mm")
                      );
                    }}
                    hideDisabledOptions={true}
                    minuteStep={15}
                    disabledHours={() => {
                      return [
                        11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
                      ];
                    }}
                  />
                </Form.Item>
                {touched.event_duration && (
                  <p className="ErrTxt mb-3">{errors?.event_duration}</p>
                )}
              </Col>
              <Col sm={3}>
                <EventLayoutComponent
                  value={values.event_layout}
                  onResult={(val) => {
                    console.log(val);
                    setFieldValue("event_layout", val.id);
                  }}
                />
              </Col>
              <Col sm={3}>
                <EventMelodyComponent
                  isCustomize={true}
                  value={values.event_melody_id}
                  onResult={(val) => {
                    console.log(val);
                    setFieldValue("event_melody_id", val.id);
                  }}
                />
              </Col>
              <div
                id="addUploadMelodydiv"
                style={{
                  display:
                    parseInt(values.event_melody_id) === 0 ? "block" : "none",
                }}
              >
                <div>Upload customize (audio / video / image)</div>

                <Button
                  onClick={() => {
                    document.getElementById("UploadMelody").click();
                  }}
                >
                  Upload
                </Button>
                <input
                  type="file"
                  id="UploadMelody"
                  name="UploadMelody"
                  style={{ display: "none" }}
                  onChange={(event) => {
                    console.log(event.target.files);
                    if (event.target.files[0]) {
                      setFieldValue("event_melody", event.target.files[0]);
                    }
                  }}
                ></input>
                {touched.event_melody && (
                  <p className="ErrTxt mb-3">{errors?.event_melody}</p>
                )}
                <div>
                  {values.event_melody !== "" ? (
                    <span>
                      {values.event_melody?.name}{" "}
                      <span
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => {
                          setFieldValue("event_melody", "");
                        }}
                      >
                        X
                      </span>
                    </span>
                  ) : null}
                </div>
              </div>

              <AudioVideoSettings
                values={values}
                setFieldValue={setFieldValue}
              />
            </Row>
          </>
        )}
      </Form>
    </EventModal>
  );
};

export default AddEvent;
