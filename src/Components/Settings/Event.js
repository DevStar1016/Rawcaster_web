import React, { useEffect, useState } from "react";
import classes from "./Settings.module.css";
import { Button, Checkbox, Select, Spin, Switch } from "antd";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import { useSettingsContext } from "../../Shared/Context";
import { EventSettings } from "./Constants";
import { EventTypeComponent } from "../Events/Configure/Utility";
import { getMelodyData } from "./Utility";
import { toast } from "react-hot-toast";
import { BannerComponent } from "../Events/Configure/Utility";

const Event = () => {
  const { loginUserData } = useAuth();
  const token = useAuthToken();
  const [melodyData, setmelodyData] = useState(null);
  const [audioPlay, setaudioPlay] = useState(false);
  const { formikvalues, setupdateValue, updateValue } = useSettingsContext();

  const handlePrimaryDisabled = (type, isprimary) => {
    if (loginUserData?.user_status_id === 1 && isprimary) {
      return true;
    } else if (updateValue.includes(type)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (token) {
      getMelodyData(token).then((res) => {
        setmelodyData(res);
      });
    }
  }, [token]);

  const onChangeMelody = (imageFile) => {
    // var allowedFiles = [".ppt", ".pptx"];
    if (!imageFile) {
      toast.error("Please select file.");
    } else if (imageFile.size > 25 * 1024 * 1024) {
      toast.error("Image size is too big (max 25MB)");
    } else if (
      imageFile.type.match("image") ||
      imageFile.type.match("audio") ||
      imageFile.type.match("video")
    ) {
      setupdateValue("default_melody", imageFile);
    } else {
      toast.error("Upload only image,video or audio");
    }
  };

  const audioHandler = () => {
    if (audioPlay) document.getElementById("audioDivID").pause();
    else document.getElementById("audioDivID").play();

    setaudioPlay((p) => !p);
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
            <div className="w-25">
              <EventTypeComponent
                isEnabledLabel={false}
                value={formikvalues.event_type}
                onResult={({ id }) => {
                  setupdateValue("event_type", id);
                }}
                disabled={updateValue.includes("event_type")}
                isLoading={updateValue.includes("event_type")}
              />
            </div>
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
                        src={
                          audioPlay
                            ? require("../../Assets/Images/audio_img.gif")
                            : require("../../Assets/Images/audio_stop.jpg")
                        }
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
                        {audioPlay ? (
                          <img
                            onClick={audioHandler}
                            src={require("../../Assets/Icons/png/music_stop.png")}
                            alt="more"
                          ></img>
                        ) : (
                          <img
                            onClick={audioHandler}
                            src={require("../../Assets/Icons/png/music_play.png")}
                            alt="more"
                          ></img>
                        )}
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
                onChange={(event) => {
                  onChangeMelody(event.target.files[0]);
                }}
              ></input>
              <Select
                value={formikvalues.melody}
                onChange={(val) => {
                  setupdateValue("melody", val);
                }}
                loading={updateValue.includes("melody")}
              >
                {melodyData.map(function (melody) {
                  return (
                    <Select.Option value={melody.id}>
                      {melody.title}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
          ) : null}

          <div className={`${classes.item} ${classes.melodyBox}`}>
            <p className={classes.smallheading}>Meeting Header Image</p>
            <p className={classes.text}>
              Choose or upload an image that depicts this event. Leave blank to
              use Rawcaster default.
            </p>
            {updateValue.includes("meeting_header_image") ? (
              <p>
                <Spin></Spin>
              </p>
            ) : null}
            <div className="w-50">
              <BannerComponent
                value={formikvalues?.meeting_header_image}
                size={10}
                onResult={(val) => {
                  setupdateValue("meeting_header_image", val);
                }}
              />
            </div>
          </div>
        </>
      )}

      <input
        type="file"
        id="imageUploadSetting"
        name="imageUploadSetting"
        style={{ display: "none" }}
        onChange={(e) => {
          console.log(e.target.files[0]);
        }}
        accept="image/*"
      ></input>
    </div>
  );
};

export default Event;
