import React, { useEffect, useState } from "react";
import classes from "./Settings.module.css";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import General from "./General";
import { useFormik } from "formik";
import { SettingsContext } from "../../Shared/Context";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import { updateUserSettingsService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUserSettings } from "../Auth/getProfile";
import Notifications from "./Notifications";
import Changepassword from "./ChangePassword";
import Blockuser from "./Blockuser";
import Event from "./Event";

const Settings = () => {
  const { userSettings } = useAuth();
  const token = useAuthToken();
  const [updateValue, setupdateValue] = useState([]);
  const dispatch = useDispatch();
  const { values, setValues, setFieldValue } = useFormik({
    online_status: "",
    phone_display_status: "",
    location_display_status: "",
    dob_display_status: "",
    bio_display_status: "",
    public_event_display: "",
    public_nugget_display: "",
    nuggets: "",
    events: "",
    Passcode_status: "",
    passcode: "",
    waiting_room: "",
    schmoozing_status: "",
    breakout_status: "",
    join_before_host: "",
    auto_record: "",
    participant_join_sound: "",
    screen_share_status: "",
    virtual_background: "",
    host_audio: "",
    host_video: "",
    participant_audio: "",
    participant_video: "",
    melody: "",
    meeting_header_image: "",
    language_id: "",
    time_zone: "",
    date_format: "",
    mobile_default_page: "",
    default_melody: "",
    event_type: "",
    account_active_inactive: "",
    phone_group_list: "",
    location_group_list: "",
    dob_group_list: "",
    bio_group_list: "",
    online_group_list: "",
    nugget_display_list: "",
    event_display_list: "",
    friend_request: "",
  });

  useEffect(() => {
    if (userSettings) {
      setValues({
        online_status: userSettings?.online_status,
        phone_display_status: userSettings?.phone_display_status,
        location_display_status: userSettings?.location_display_status,
        dob_display_status: userSettings?.dob_display_status,
        bio_display_status: userSettings?.bio_display_status,
        public_event_display: userSettings?.public_event_display,
        public_nugget_display: userSettings?.public_nugget_display,
        nuggets: userSettings?.nuggets,
        events: userSettings?.events,
        Passcode_status: userSettings?.passcode_status,
        passcode: userSettings?.passcode,
        waiting_room: userSettings?.waiting_room,
        schmoozing_status: userSettings?.schmoozing_status,
        breakout_status: userSettings?.breakout_status,
        join_before_host: userSettings?.join_before_host,
        auto_record: userSettings?.auto_record,
        participant_join_sound: userSettings?.participant_join_sound,
        screen_share_status: userSettings?.screen_share_status,
        virtual_background: userSettings?.virtual_background,
        host_audio: userSettings?.host_audio,
        host_video: userSettings?.host_video,
        participant_audio: userSettings?.participant_audio,
        participant_video: userSettings?.participant_video,
        melody: userSettings?.melody ?? "",
        meeting_header_image: userSettings?.meeting_header_image,
        language_id: userSettings?.language_id,
        time_zone: userSettings?.time_zone,
        date_format: userSettings?.default_date_format,
        mobile_default_page: userSettings?.mobile_default_page,
        default_melody: userSettings?.default_melody,
        event_type: userSettings?.event_type,
        account_active_inactive: userSettings?.account_active_inactive,
        phone_group_list: userSettings?.phone_group_list,
        location_group_list: userSettings?.location_group_list,
        dob_group_list: userSettings?.dob_group_list,
        bio_group_list: userSettings?.bio_group_list,
        online_group_list: userSettings?.online_group_list,
        nugget_display_list: userSettings?.nugget_display_list,
        event_display_list: userSettings?.event_display_list,
        friend_request: userSettings?.friend_request,
      });
    }
  }, [userSettings]);

  const handleupdate = (objValue) => {
    let finalObj = {
      ...objValue,
      token: token,
    };
    updateUserSettingsService(JSONtoformdata(finalObj))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
        } else if (res.data.status === 0) {
          toast.error(res.data.msg);
        } else {
          return;
        }
        let keys = Object.keys(objValue);
        setupdateValue((pre) => pre.filter((ele) => ele !== keys[0]));
        getUserSettings(token, dispatch);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const settingsValues = {
    formikvalues: values,
    setValues,
    setFieldValue,
    setupdateValue(key, value, type = "add") {
      switch (type) {
        case "add":
          setFieldValue([key], parseInt(value));
          let updateObj = {
            [key]: value,
          };
          handleupdate(updateObj);
          if (updateValue.length !== 0) {
            return setupdateValue((pre) => [...pre, key]);
          } else {
            return setupdateValue([key]);
          }
        case "delete":
          setFieldValue(key, "");
          return setupdateValue((pre) => pre.filter((ele) => ele !== key));
      }
    },
    updateValue,
    handleupdate,
  };

  return (
    <SettingsContext.Provider value={settingsValues}>
      <div className={classes.settingSec}>
        <Tab.Container
          id="left-tabs-example"
          defaultActiveKey="general"
          className="mt-5"
        >
          <Row>
            <Col sm={2}>
              <div className={`${classes.sidebar} settingsBar`}>
                <Nav variant="pills" className="flex-column">
                  <h2>Settings</h2>
                  <Nav.Item>
                    <Nav.Link eventKey="general">General</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="notifications">Notifications</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="blocking">Blocking</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="change_password">
                      Change Password
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="event_setting">Event Settings</Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="general">
                  <General />
                </Tab.Pane>
                <Tab.Pane eventKey="notifications">
                  <Notifications />
                </Tab.Pane>
                <Tab.Pane eventKey="blocking">
                  <Blockuser />
                </Tab.Pane>
                <Tab.Pane eventKey="change_password">
                  <Changepassword />
                </Tab.Pane>
                <Tab.Pane eventKey="event_setting">
                  <Event />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </SettingsContext.Provider>
  );
};

export default Settings;
