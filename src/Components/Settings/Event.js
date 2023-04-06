import React, { useState } from "react";
import classes from "./Settings.module.css";
import { Button, Checkbox, Switch } from "antd";
import { useAuth } from "../../Shared/Reduxfetcher";
import { useSettingsContext } from "../../Shared/Context";
import { EventSettings } from "./Constants";
import { EventTypeComponent } from "./Utility";

const Event = () => {
  const { userSettings, loginUserData } = useAuth();

  const [melodyData, setmelodyData] = useState();
  const { formikvalues, setupdateValue, updateValue } = useSettingsContext();

  const handlePrimaryDisabled = (type, isprimary) => {
    if (loginUserData?.user_status_id === 1 && isprimary) {
      return true;
    } else if (updateValue.includes(type)) {
      return true;
    }
    return false;
  };

  return (
    <div
      className={`settingSec ${classes.contentSec}`}
      style={{ display: "block" }}
    >
      <h1>Event Settings</h1>
      {formikvalues && (
        <>
          {EventSettings.map((ele) => {
            return (
              <div className={classes.chkboxSec}>
                <Checkbox
                  checked={
                    handlePrimaryDisabled(ele.type, ele.isprimary)
                      ? true
                      : formikvalues[ele.type]
                  }
                  onChange={(e) => {
                    console.log(ele.type, e.target.checked ? 1 : 0);
                    setupdateValue(ele.type, e.target.checked ? 1 : 0);
                  }}
                  disabled={handlePrimaryDisabled(ele.type, ele.isprimary)}
                >
                  {ele.title}
                </Checkbox>
                <p className={classes.text}>{ele.description}</p>
              </div>
            );
          })}

          <div>
            <p className={`${classes.smallheading} mb-2`}>Default Event Type</p>
            <EventTypeComponent
              value={formikvalues.event_type}
              onResult={({ id }) => {
                setupdateValue("event_type", id);
              }}
            />
            {/* {eventType && settingData && (
        <Antselect
          defaultValue={settingData.event_type}
          showSearch
          className={classes.selectBox}
          placeholder="Select Group"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          }
          filterSort={(optionA, optionB) =>
            optionA.children
              .toLowerCase()
              .localeCompare(optionB.children.toLowerCase())
          }
          onChange={(val) => {
            onChangeNotificationHandler(28, val);
          }}
          loading={loadingArr.includes(28)}
          disabled={loadingArr.includes(28)}
        >
          {eventType.map(function (opt) {
            return (
              <Option key={"eventtype" + opt.id} value={opt.id}>
                {opt.type}
              </Option>
            );
          })}
        </Antselect>
      )} */}
          </div>

          <div className={classes.audioSetting}>
            Default Audio Settings
            <div className={classes.audiosetting_btn}>
              <Switch
                className="Greenbtn"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={formikvalues.host_audio}
                onChange={(e) => {
                  setupdateValue("host_audio", e ? 1 : 0);
                }}
                disabled={updateValue.includes("host_audio")}
              />{" "}
              Host
            </div>
            <div className={classes.audiosetting_btn}>
              <Switch
                className="Greenbtn"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={formikvalues.participant_audio}
                onChange={(e) => {
                  setupdateValue("participant_audio", e ? 1 : 0);
                }}
                disabled={updateValue.includes("participant_audio")}
              />{" "}
              Guest
            </div>
            <p className={classes.text}>Start meeting with audio on</p>
          </div>

          <div className={classes.audioSetting}>
            Default Video Settings
            <div className={classes.audiosetting_btn}>
              <Switch
                checkedChildren="On"
                className="Greenbtn"
                unCheckedChildren="Off"
                checked={formikvalues.host_video}
                onChange={(e) => {
                  setupdateValue("host_video", e ? 1 : 0);
                }}
                disabled={updateValue.includes("host_video")}
              />{" "}
              Host
            </div>
            <div className={classes.audiosetting_btn}>
              <Switch
                className="Greenbtn"
                checkedChildren="On"
                unCheckedChildren="Off"
                checked={formikvalues.participant_video}
                onChange={(e) => {
                  setupdateValue("participant_video", e ? 1 : 0);
                }}
                disabled={updateValue.includes("participant_video")}
              />{" "}
              Guest
            </div>
            <p className={classes.text}>Start meeting with video on</p>
          </div>

          {melodyData ? (
            <div className={`${classes.item} ${classes.melodyBox}`}>
              <p className={classes.smallheading}>Media</p>
              <p className={classes.text}>
                Choose or upload an audio sound or video or image that
                participants in waiting room will listen to while they wait for
                host to admit them to the meeting.
              </p>
              <Button
                className={classes.uplBtn}
                onClick={() => {
                  document.getElementById("UploaddefaultMelody").click();
                }}
              >
                Upload Media
              </Button>

              {formikvalues.default_melody &&
              formikvalues.default_melody !== "" ? (
                <div style={{ position: "relative" }}>
                  {formikvalues.default_melody.type === 3 ? (
                    <React.Fragment>
                      <img
                        // src={
                        //   audioPlay
                        //     ? require("../../assets/audio_img.gif")
                        //     : require("../../assets/audio_stop.jpg")
                        // }
                        alt="audio"
                        width="500px"
                      />
                      <div
                        style={{
                          position: "absolute",
                          marginTop: "-197px",
                          left: "200px",
                          cursor: "pointer",
                        }}
                      >
                        {/* {audioPlay ? (
                    <img
                      onClick={audioHandler}
                      src={require("../../assets/music_stop.png")}
                      alt="more"
                    ></img>
                  ) : (
                    <img
                      onClick={audioHandler}
                      src={require("../../assets/music_play.png")}
                      alt="more"
                    ></img>
                  )} */}
                      </div>
                      <video
                        id="audioDivID"
                        controls
                        disablePictureInPicture
                        playsInline
                        controlsList="nodownload"
                        loop
                        style={{ display: "none" }}
                      >
                        {" "}
                        <source src={formikvalues.default_melody?.path} />
                      </video>
                    </React.Fragment>
                  ) : null}

                  {formikvalues.default_melody?.type === 1 ? (
                    <img
                      src={formikvalues.default_melody.path}
                      alt="more"
                      style={{ maxHeight: "400px", height: "100%" }}
                    />
                  ) : null}
                  {formikvalues.default_melody?.type === 2 ? (
                    <video
                      controls
                      playsInline
                      disablePictureInPicture
                      controlsList="nodownload"
                      style={{ height: "250px" }}
                      src={formikvalues.default_melody?.path}
                    ></video>
                  ) : null}
                </div>
              ) : null}
              <input
                type="file"
                id="UploaddefaultMelody"
                name="UploaddefaultMelody"
                style={{ display: "none" }}
                // onChange={(event) => {
                //   onChangeMelody(event.target.files[0]);
                // }}
              ></input>
              {/* <Antselect
          value={settingData.melody}
          className={classes.melodySelect}
          placeholder="Select Melody"
          onChange={(value) => {
            onChangeNotificationHandler(6, value, "melody");
          }}
        >
          {melodyData.map(function (melody) {
            return <Option value={melody.id}>{melody.title}</Option>;
          })}
        </Antselect> */}
            </div>
          ) : null}

          <div className={`${classes.item} ${classes.melodyBox}`}>
            <p className={classes.smallheading}>Meeting Header Image</p>
            <p className={classes.text}>
              Choose or upload an image that depicts this event. Leave blank to
              use Rawcaster default.
            </p>
            {/* {eventDefaultBannerObject.loading ? (
        <p>
          <Spin></Spin>
        </p>
      ) : null} */}

            <div
              className={classes.uploadbanner + " " + "pointer"}
              onClick={() => {
                document.getElementById("imageUploadSetting").click();
              }}
            >
              {formikvalues?.meeting_header_image !== "" ? (
                <img
                  src={formikvalues?.meeting_header_image}
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
                      color: "#0E425A",
                      opacity: "0.29",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Upload Banner Photo
                  </div>
                  <div
                    style={{
                      color: "#0E425A",
                      fontSize: "12px",
                      opacity: "0.15",
                      textAlign: "center",
                    }}
                  >
                    Recommended size 500x300
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Event;
