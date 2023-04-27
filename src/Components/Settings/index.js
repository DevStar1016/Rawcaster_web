import React, { useEffect, useState } from "react";
import classes from "./Settings.module.css";
import { Nav, Tab } from "react-bootstrap";
import General from "./General";
import { useFormik } from "formik";
import { SettingsContext } from "../../Shared/Context";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import { updateUserSettingsService } from "../../Services/ApiService";
import { JSONtoformdata, RemoveToken } from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUserSettings } from "../Auth/getProfile";
import Notifications from "./Notifications";
import Changepassword from "./ChangePassword";
import Blockuser from "./Blockuser";
import Event from "./Event";
import { handleAccountActive } from "../../Store/Redux/Reducer/AuthReducer";

const Settings = () => {
  const { userSettings } = useAuth();
  const token = useAuthToken();
  const [updateValue, setupdateValue] = useState([]);
  const dispatch = useDispatch();
  const [Progress, setProgress] = useState({
    percent: 0,
    show: false,
  });
  const [isMelodyUploading, setisMelodyUploading] = useState(false);
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
    lock_nugget: 0,
    lock_fans: 0,
    lock_my_connection: 0,
    lock_my_influencer: 0,
    live_event_banner: "",
    talkshow_event_banner: "",
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
        lock_nugget: userSettings?.lock_nugget,
        lock_fans: userSettings?.lock_fans,
        lock_my_connection: userSettings?.lock_my_connection,
        lock_my_influencer: userSettings?.lock_my_influencer,
        live_event_banner: userSettings?.live_event_banner,
        talkshow_event_banner: userSettings?.talkshow_event_banner,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSettings]);

  const handleProgress = (progress) => {
    let val = (progress.loaded / progress.total) * 100;
    setProgress({
      percent: Math.round(val),
      show: true,
    });
  };

  const handleupdate = (objValue) => {
    let promise = new Promise((resolve, reject) => {
      let finalObj = {
        ...objValue,
        token: token,
      };
      updateUserSettingsService(JSONtoformdata(finalObj), handleProgress)
        .then((res) => {
          if (res.data.status === 1) {
            toast.success("Successfully Updated");
          } else if (res.data.status === 0) {
            toast.error(res.data.msg);
          } else {
            return;
          }

          getUserSettings(token, dispatch).then((response) => {
            resolve(response);
          });
        })
        .catch((err) => {
          toast.error(err.message);
        })
        .finally(() => {
          let keys = Object.keys(objValue);
          setupdateValue((pre) => pre.filter((ele) => ele !== keys[0]));
          setisMelodyUploading(false);
        });
    });
    return promise;
  };
  const [visibleSideBar, setvisibleSideBar] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const settingsValues = {
    formikvalues: values,
    setValues,
    setFieldValue,
    setupdateValue(key, value, type = "add") {
      switch (type) {
        case "add":
          if (typeof value === "string") {
            if (!isNaN(parseInt(value))) {
              setFieldValue([key], parseInt(value));
            } else {
              setFieldValue([key], value);
            }
          } else if (typeof value === "object") {
            setFieldValue([key], URL.createObjectURL(value));
          } else {
            setFieldValue([key], value);
          }
          let updateObj = {
            [key]: value,
          };
          handleupdate(updateObj).then((response) => {
            if (response.account_active_inactive === 0) {
              console.log("res");
              dispatch(handleAccountActive(false));
              RemoveToken(dispatch);
              window.location.reload();
            }
          });
          if (updateValue.length !== 0) {
            return setupdateValue((pre) => [...pre, key]);
          } else {
            return setupdateValue([key]);
          }
        case "delete":
          setFieldValue(key, "");
          return setupdateValue((pre) => pre.filter((ele) => ele !== key));
        default:
          return;
      }
    },
    isMelodyUploading,
    setisMelodyUploading,
    updateValue,
    handleupdate,
    ProgressValue: Progress,
  };

  return (
    <SettingsContext.Provider value={settingsValues}>
      <div className={classes.settingSec}>
        <div className={classes.settingmobMenu}>
          <span
            class="material-icons"
            onClick={() => setvisibleSideBar((p) => !p)}
          >
            menu
          </span>
        </div>

        <Tab.Container
          id="left-tabs-example"
          defaultActiveKey="general"
          className="mt-5"
        >
          <div
            className={`${classes.sidebar}  ${
              !visibleSideBar ? classes.hideSlidebar : null
            }`}
          >
            <Nav variant="pills" className="flex-column">
              <h2>Settings</h2>
              <Nav.Item>
                <Nav.Link
                  className={activeTab === 1 ? classes.active : ""}
                  onClick={() => {
                    setActiveTab(1);
                    setvisibleSideBar(false);
                  }}
                  eventKey="general"
                >
                  General
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={activeTab === 2 ? classes.active : ""}
                  onClick={() => {
                    setActiveTab(2);
                    setvisibleSideBar(false);
                  }}
                  disabled={userSettings?.account_active_inactive === 0}
                  eventKey="notifications"
                >
                  Notifications
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={activeTab === 3 ? classes.active : ""}
                  disabled={userSettings?.account_active_inactive === 0}
                  onClick={() => {
                    setActiveTab(3);
                    setvisibleSideBar(false);
                  }}
                  eventKey="blocking"
                >
                  Blocking
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={activeTab === 4 ? classes.active : ""}
                  disabled={userSettings?.account_active_inactive === 0}
                  onClick={() => {
                    setActiveTab(4);
                    setvisibleSideBar(false);
                  }}
                  eventKey="change_password"
                >
                  Change Password
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  className={activeTab === 5 ? classes.active : ""}
                  disabled={userSettings?.account_active_inactive === 0}
                  onClick={() => {
                    setActiveTab(5);
                    setvisibleSideBar(false);
                  }}
                  eventKey="event_setting"
                >
                  Event Settings
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <div className={`${classes.contentSec}`}>
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
          </div>
        </Tab.Container>
      </div>
    </SettingsContext.Provider>
  );
};

export default Settings;
