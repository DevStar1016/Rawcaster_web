import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Space,
  TimePicker,
} from "antd";
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
  Groups,
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
  getUtcToSystemTime,
  userTimezonetoUtc,
} from "../../../Shared/Utility";
import { AddEventContext, useEventContext } from "../../../Shared/Context";
import dayjs from "dayjs";
import { ChimesendMessage } from "../../../Services/SocketService";
import EventSuccessPage from "./EventSuccessPage";
import {
  CHIME_SOCKET_EVENTS,
  COMMON_EVENTS_TYPES,
} from "../../../Services/ServiceConstants";
import { DEFAULT_DATE_FORMAT } from "../../../Shared/Constant";
import { HandleVerifyModal } from "../../../Modal/DefaultModal";

const AddEvent = ({ isEventOpen, setisEventOpen, data }) => {
  const { getEvents, ActiveEvent } = useEventContext();
  const token = useAuthToken();
  const { userSettings, loginUserData } = useAuth();
  const [isFetching, setisFetching] = useState([]);
  const [isCreating, setisCreating] = useState(false);
  const [isNextPage, setisNextPage] = useState(false);
  const [upgradePlanPopup, setupgradePlanPopup] = useState(false);
  const [userMailList, setuserMailList] = useState([]);
  const [EventData, setEventData] = useState(null);
  const [isSuccesspage, setisSuccesspage] = useState(false);
  const [SelectedTime, setSelectedTime] = useState(
    moment().add(15, "minutes").format("HH:mm")
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
      event_start_time: moment(new Date()).add(15, "minutes").format("HH:mm"),
      waiting_room: "",
      join_before_host: "",
      sound_notify: "",
      user_screenshare: "",
      event_participants: "",
      event_message: "",
      event_duration: "",
      event_layout: "",
      event_melody_id: "",
      event_melody_type: 1,
      event_melody: "",
      event_host_audio: "",
      event_host_video: "",
      event_guest_audio: "",
      event_guest_video: "",
      event_banner: "",
      event_invite_mails: "",
      event_invite_friends: "",
      event_invite_groups: "",
      delete_invite_mails: "",
      delete_invite_groups: "",
      delete_invite_friends: "",
    },
    enableReinitialize: false,
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
          if (parseInt(event_melody_id) === 0 && !value) {
            return false;
          }
          return true;
        }),
      event_invite_friends: yup.string(),
      event_invite_groups: yup.string(),
      event_invite_mails: yup
        .string()
        .test("Mail Test", "Please Enter Invite Users", function (value) {
          const { event_type, event_invite_friends, event_invite_groups } =
            this.parent;
          if (parseInt(event_type) === 2) {
            if (value && JSON.parse(value)?.length > 0) {
              return true;
            } else if (event_invite_friends && event_invite_groups) {
              if (
                JSON.parse(event_invite_friends)?.length > 0 ||
                JSON.parse(event_invite_groups)?.length > 0
              ) {
                return true;
              }
              return false;
            } else if (event_invite_groups) {
              if (JSON.parse(event_invite_groups)?.length > 0) {
                return true;
              }
              return false;
            } else if (event_invite_friends) {
              if (JSON.parse(event_invite_friends)?.length > 0) {
                return true;
              }
              return false;
            }
            return false;
          }
          return true;
        }),
    }),
    validateOnChange: true,
    onSubmit: (val) => {
      setisCreating(true);
      if (data) {
        HandleEditEvent(val);
      } else {
        HandleAddEvent(val);
      }
    },
  });

  /**
   * Handles the close event action by resetting the form, updating state variables,
   * and closing the event.
   * @returns None
   */
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

  /**
   * Returns the title component based on the current state.
   * If isNextPage is true, it returns a title component for the "Personalize Your Event" page,
   * with a back arrow icon that sets isNextPage to false when clicked.
   * If isNextPage is false, it returns a title component for either the "Update Event" or "Create Event" page,
   * depending on the value of the data variable.
   * @returns The title component.
   */
  const getTitle = () => {
    if (isNextPage) {
      return (
        <div className={classes.headingSec}>
          <span
            className="material-symbols-outlined"
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

  /**
   * Handles the event creation process by formatting the date and time, converting it to UTC,
   * and making an API call to add the event. It also handles success and error responses from the API.
   * @param {Object} val - The event data object.
   * @returns None
   */
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
          setEventData(res.data.event_detail);
          setisSuccesspage(true);
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
          ChimesendMessage(
            {
              type: COMMON_EVENTS_TYPES.CREATE_EVENT,
              event_detail: res.data.event_detail,
            },
            CHIME_SOCKET_EVENTS.NOTIFICATIONS
          );
        } else {
          toast.remove("Error");
          toast.error(res.data.msg, {
            id: "Error",
          });
          handleCloseEvent();
        }
      })
      .catch((err) => {})
      .finally(() => {
        setisCreating(false);
      });
  };

  /**
   * Handles the edit event event. It takes in a value object and performs the necessary
   * operations to update the event data.
   * @param {object} val - The value object containing the updated event data.
   * @returns None
   */
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
      delete_invite_mails: values?.delete_invite_mails?.includes("[")
        ? JSON.parse(values?.delete_invite_mails)?.length > 0
          ? JSON.parse(values?.delete_invite_mails)?.join(",")
          : values?.delete_invite_mails
        : values?.delete_invite_mails,
    };

    function isFile(obj) {
      return obj instanceof File;
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
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
        } else {
          toast.remove("Error");
          toast.error(res.data.msg, {
            id: "Error",
          });
        }
      })
      .catch((err) => {})
      .finally(() => {
        handleCloseEvent();
      });
  };

  /**
   * useEffect hook that is triggered when the 'data' or 'userSettings' dependencies change.
   * If 'data' is truthy, it makes an API call to retrieve event details based on the provided token and event_id.
   * It then updates the state values with the retrieved event data.
   * If 'data' is falsy and 'userSettings' is truthy, it updates the state values with the user settings data.
   * @param {any} data - The data object containing the token and event_id.
   * @param {any} userSettings - The user settings object.
   * @returns None
   */
  useEffect(() => {
    if (data) {
      let eventdata = {
        token: token,
        event_id: data?.event_id,
      };
      viewEventsService(JSONtoformdata(eventdata))
        .then((res) => {
          let eventData = res.data.event_detail;
          try {
            setValues((pre) => ({
              ...pre,
              event_title: decodeHtml(eventData?.event_name),
              event_type: eventData?.event_type_id,
              event_start_date: getUtcToSystemTime(
                eventData?.start_date_time
              )?.format("YYYY-MM-DD"),
              event_start_time: getUtcToSystemTime(
                eventData?.start_date_time
              )?.format("HH:mm"),
              event_message: eventData?.message,
              waiting_room: eventData?.waiting_room,
              event_melody_type: eventData?.event_melody_type,
              join_before_host: eventData?.join_before_host,
              sound_notify: eventData?.sound_notify,
              user_screenshare: eventData?.user_screenshare,
              event_participants: eventData?.no_of_participants,
              event_duration: moment(eventData?.duration, "HH:mm:ss").format(
                "HH:mm"
              ),
              event_layout: eventData?.event_layout_id,
              event_melody_id: eventData?.event_melody_id,
              event_melody:
                eventData?.event_melody_type === 3 ? eventData?.melodies : "",
              event_host_audio: eventData?.default_host_audio,
              event_host_video: eventData?.default_host_video,
              event_guest_audio: eventData?.default_guest_audio,
              event_guest_video: eventData?.default_guest_video,
              event_banner: eventData?.banner_image,
              event_invite_mails: getValidarrayData(eventData?.invite_mails),
              event_invite_friends: getValidarrayData(
                eventData?.invite_friends_id
              ),
              event_invite_groups: getValidarrayData(
                eventData?.invite_groups_id
              ),
            }));
            setuserMailList(eventData?.invite_mails);
          } catch (error) {}
        })
        .catch((err) => {});
    } else {
      if (userSettings && !data) {
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

  /**
   * Scrolls to the bottom of the "eventForm" element with a smooth animation.
   * @param {number} [value=0] - The value to scroll to. Default is 0.
   * @returns None
   */
  const scrollToUpgrade = (value = 0) => {
    const scrollHeight = document.getElementById("eventForm").scrollHeight;
    document
      .getElementById("eventForm")
      .scrollTo({ top: scrollHeight, behavior: "smooth" });
  };

  /**
   * Executes a side effect when the value of `upgradePlanPopup` changes.
   * If `upgradePlanPopup` is truthy, it calls the `scrollToUpgrade` function.
   * @returns None
   */
  useEffect(() => {
    if (upgradePlanPopup) {
      scrollToUpgrade();
    }
  }, [upgradePlanPopup]);

  // function convertToDoubleDigit(number) {
  //   if (number >= 0 && number <= 9) {
  //     return `0${number}`;
  //   } else {
  //     return number.toString();
  //   }
  // }

  const getDisabledHours = () => {
    let filteredArray = [...new Array(24)].map((ele, index) => {
      if (parseInt(userSettings.max_event_duration) < index) {
        return index;
      }
    });
    return filteredArray.filter((ele) => ele);
  };

  return (
    <AddEventContext.Provider
      value={{
        values,
        setValues,
        setFieldValue,
        isFetching,
        setisFetching,
        EventData,
        setEventData,
      }}
    >
      <EventModal
        open={isEventOpen}
        Type={"Event"}
        title={getTitle()}
        isLinkScreen={isSuccesspage}
        hasNextPage={true}
        isUpdate={data ? true : false}
        loading={isCreating}
        okBtnTitle={isNextPage ? null : "Next"}
        isFetching={isFetching}
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

              if (compareArrays(validatedKeys, requiredFields)) {
                const ErrorArray = compareArrays(validatedKeys, requiredFields);
                handleSubmit();
                if (
                  loginUserData?.user_status_id !== 4 &&
                  (ErrorArray?.includes("event_duration") ||
                    ErrorArray?.includes("event_participants"))
                ) {
                  if (upgradePlanPopup) {
                    scrollToUpgrade();
                  } else {
                    setupgradePlanPopup(true);
                  }

                  // document.getElementById("Alertdiv")?.focus();
                }
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
        {isSuccesspage ? (
          <EventSuccessPage />
        ) : (
          <Form
            layout="vertical"
            autoComplete="off"
            id="eventForm"
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
                            setFieldValue(
                              "event_invite_mails",
                              JSON.stringify(val)
                            );
                          }}
                          onDeleteData={(delete_arr) => {
                            if (delete_arr.length !== 0) {
                              setFieldValue(
                                "delete_invite_mails",
                                JSON.stringify(delete_arr)
                              );
                            } else {
                              setFieldValue("delete_invite_mails", "");
                            }
                          }}
                          userMailList={userMailList}
                          setuserMailList={(val) => {}}
                        />
                        {touched.event_invite_mails && (
                          <p className="ErrTxt mb-3">
                            {errors?.event_invite_mails}
                          </p>
                        )}
                      </Col>
                      <Col sm={12}>
                        <Connections
                          values={values.event_invite_friends}
                          onDeleteData={(delete_arr) => {
                            if (delete_arr.length !== 0) {
                              setFieldValue(
                                "delete_invite_friends",
                                JSON.stringify(delete_arr)
                              );
                            } else {
                              setFieldValue("delete_invite_friends", "");
                            }
                          }}
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
                      <Col>
                        <Groups
                          values={values.event_invite_groups}
                          onDeleteData={(delete_arr) => {
                            if (delete_arr.length !== 0) {
                              setFieldValue(
                                "delete_invite_groups",
                                JSON.stringify(delete_arr)
                              );
                            } else {
                              setFieldValue("delete_invite_groups", "");
                            }
                          }}
                          onResult={(val) => {
                            let finRes = val.map((ele) => ele.group_id);
                            if (finRes.length !== 0) {
                              setFieldValue(
                                "event_invite_groups",
                                JSON.stringify(finRes)
                              );
                            } else {
                              setFieldValue("event_invite_groups", "");
                            }
                          }}
                        />
                        {touched.event_invite_groups && (
                          <p className="ErrTxt mb-3">
                            {errors?.event_invite_groups}
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
                        format={
                          userSettings
                            ? userSettings.default_date_format
                            : DEFAULT_DATE_FORMAT
                        }
                        onChange={(date, dateString) => {
                          setFieldValue("event_start_date", dateString);

                          if (
                            moment().isSame(
                              moment(dateString, "YYYY-MM-DD"),
                              "day"
                            )
                          ) {
                            if (
                              moment()
                                .add(15, "minutes")
                                .isAfter(
                                  moment(values.event_start_time, "HH:mm")
                                )
                            ) {
                              setFieldValue("event_start_time", "");
                            }
                          } else {
                            if (values.event_start_time !== "") {
                              setFieldValue("event_start_time", SelectedTime);
                            }
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
                        // setSelectedTime(moment(res, "hh:mm A").format("HH:mm"));
                        if (
                          moment().isSame(
                            moment(values.event_start_date, "YYYY-MM-DD"),
                            "day"
                          )
                        ) {
                          if (
                            moment()
                              .add(15, "minutes")
                              .isSameOrAfter(moment(res, "hh:mm A"))
                          ) {
                            setFieldValue(
                              "event_start_time",
                              moment(res, "hh:mm A").format("HH:mm")
                            );
                            setSelectedTime(
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
                          setSelectedTime(
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
                            <div
                              onClick={(e) => {
                                if (
                                  loginUserData?.user_status_id === 1 &&
                                  ele.isprimary
                                ) {
                                  if (upgradePlanPopup) {
                                    scrollToUpgrade();
                                  } else {
                                    setupgradePlanPopup(true);
                                  }
                                }
                              }}
                              className={classes.chkboxSec}
                            >
                              <Checkbox
                                checked={values[ele.type]}
                                disabled={
                                  loginUserData?.user_status_id === 1 &&
                                  ele.isprimary
                                }
                                onChange={(e) => {
                                  switch (ele.type) {
                                    case "waiting_room":
                                      setFieldValue("join_before_host", 0);
                                      setFieldValue(
                                        ele.type,
                                        e.target.checked ? 1 : 0
                                      );
                                      break;
                                    case "join_before_host":
                                      setFieldValue("waiting_room", 0);
                                      setFieldValue(
                                        ele.type,
                                        e.target.checked ? 1 : 0
                                      );
                                      break;
                                    default:
                                      setFieldValue(
                                        ele.type,
                                        e.target.checked ? 1 : 0
                                      );
                                      break;
                                  }
                                }}
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
                      <p className="ErrTxt ">{errors?.event_participants}</p>
                    )}
                  </Col>
                  <Col style={{ position: "relative" }} sm={3}>
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
                        disabledMinutes={(h) => {
                          const validDuration =
                            userSettings.max_event_duration ?? 10;
                          if (h >= validDuration) {
                            // If the hour is 10, disable minutes after 0.
                            return [15, 30, 45];
                          } else if (h <= 0) {
                            return [0];
                          } else {
                            // If the hour is greater than 10, all minutes are disabled.
                            return [];
                          }
                        }}
                        disabledHours={() => {
                          return getDisabledHours();
                        }}
                      />
                    </Form.Item>
                    {touched.event_duration && (
                      <p style={{ position: "absolute" }} className="ErrTxt ">
                        {errors?.event_duration}
                      </p>
                    )}
                  </Col>
                  <Col sm={3}>
                    <EventLayoutComponent
                      value={values.event_layout}
                      onResult={(val) => {
                        setFieldValue("event_layout", val.id);
                      }}
                    />
                  </Col>
                  <Col sm={3}>
                    <EventMelodyComponent
                      isCustomize={true}
                      value={values.event_melody_id}
                      type={values.event_melody_type}
                      onResult={(val) => {
                        // if (parseInt(val.id) === 0) {
                        //   setFieldValue("event_melody", "");
                        // }
                        setFieldValue("event_melody_type", val.type);
                        setFieldValue("event_melody_id", val.id);
                      }}
                    />
                  </Col>
                  <div
                    id="addUploadMelodydiv"
                    style={{
                      display:
                        parseInt(values.event_melody_type) === 3
                          ? "block"
                          : "none",
                    }}
                  >
                    <div>Upload customize (audio / video / image)</div>

                    <Button
                      className={classes.uploadBtn}
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
                        if (event.target.files[0]) {
                          setFieldValue("event_melody", event.target.files[0]);
                        }
                      }}
                    ></input>
                    {touched.event_melody && (
                      <p className="ErrTxt mb-3">{errors?.event_melody}</p>
                    )}
                    <div className={classes.imagePreview}>
                      {values.event_melody !== "" && values?.event_melody ? (
                        <span>
                          {values.event_melody?.path
                            ? values.event_melody?.path.split("/").pop()
                            : values.event_melody?.name
                            ? values.event_melody?.name
                            : "Rawcaster Melody File"}{" "}
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

                  <AudioVideoSettings />

                  <div className={classes.alertContainer} id="Alertdiv">
                    {upgradePlanPopup && (
                      <Alert
                        message="Upgrade Your Plan"
                        description={
                          errors?.event_participants
                            ? `To add more than ${userSettings?.max_event_participants_count} participants upgrade your membership!`
                            : errors?.event_duration
                            ? `To host event for longer than ${
                                userSettings?.max_event_duration === 1
                                  ? `${userSettings?.max_event_duration} hour`
                                  : `${userSettings?.max_event_duration} hours`
                              } upgrade your membership!`
                            : "To access this feature upgrade your membership!"
                        }
                        type="info"
                        action={
                          <Space direction="vertical">
                            <Button
                              size="small"
                              style={{
                                background: "#f2718d",
                                color: "#fff",
                                width: " 88px",
                                fontSize: "13px",
                                padding: 0,
                                textAlign: "center",
                                minHeight: "32px",
                              }}
                              type="primary"
                              onClick={() => {
                                HandleVerifyModal({
                                  primary: "success",
                                  onSuccess: () => {},
                                  isCloseAvailable: false,
                                  SubmitButtonTitle: "Ok",
                                  message:
                                    "you have been granted a complementary upgrade for xx days",
                                });
                                // window.location.assign("/membership");
                              }}
                            >
                              Upgrade
                            </Button>
                            <Button
                              style={{
                                border: "1px solid #f2718d",
                                background: "transparent",
                                color: "#f2718d",
                                width: " 88px",
                                fontSize: "13px",
                                padding: 0,
                                textAlign: "center",
                                minHeight: "32px",
                              }}
                              onClick={() => {
                                setupgradePlanPopup(false);
                              }}
                              size="small"
                              danger
                              type="primary"
                            >
                              Later
                            </Button>
                          </Space>
                        }
                      />
                    )}
                  </div>
                </Row>
              </>
            )}
          </Form>
        )}
      </EventModal>
    </AddEventContext.Provider>
  );
};

export default AddEvent;
