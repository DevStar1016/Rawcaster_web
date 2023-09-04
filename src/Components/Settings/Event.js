/**
 * A React functional component that represents the Event Settings page.
 * This component displays various settings related to events, such as audio settings, video settings, default event type, and media options.
 * @returns JSX element representing the Event Settings page.
 */
import React, { useEffect, useState } from "react";
import classes from "./Settings.module.css";
import { Button, Checkbox, Progress, Spin, Switch } from "antd";
import { useAuth, useAuthToken } from "../../Shared/Reduxfetcher";
import { AddEventContext, useSettingsContext } from "../../Shared/Context";
import { EventSettings } from "./Constants";
import { EventTypeComponent } from "../Events/Configure/Utility";
import { toast } from "react-hot-toast";
import { BannerComponent } from "../Events/Configure/Utility";
import { getMelodyData } from "../../Shared/DropdownApis";
import { Col, Row } from "react-bootstrap";

const Event = () => {
  const { loginUserData } = useAuth();
  const token = useAuthToken();
  const [melodyData, setmelodyData] = useState(null);
  const [isFetching, setisFetching] = useState([]);
  const [audioPlay, setaudioPlay] = useState(false);
  const {
    formikvalues,
    setupdateValue,
    updateValue,
    isMelodyUploading,
    setisMelodyUploading,
    ProgressValue,
    setFieldValue,
  } = useSettingsContext();

  /**
   * Determines if the primary disabled state should be applied based on the given type and isprimary value.
   * @param {string} type - The type of the element.
   * @param {boolean} isprimary - The value indicating if the element is primary.
   * @returns {boolean} - True if the primary disabled state should be applied, false otherwise.
   */
  const handlePrimaryDisabled = (type, isprimary) => {
    if (loginUserData?.user_status_id === 1 && isprimary) {
      return true;
    } else if (updateValue.includes(type)) {
      return true;
    }
    return false;
  };

  /**
   * Executes a side effect when the value of the token changes.
   * If the token is truthy, it calls the getMelodyData function with the token and updates the melodyData state with the response.
   * @param {string} token - The token value.
   * @returns None
   */
  useEffect(() => {
    if (token) {
      getMelodyData(token).then((res) => {
        setmelodyData(res);
      });
    }
  }, [token]);

  /**
   * Handles the onChange event for the melody input field.
   * @param {File} imageFile - The selected file from the input field.
   * @returns None
   */
  const onChangeMelody = (imageFile) => {
    if (!imageFile) {
      toast.error("Please select file.");
    } else if (imageFile.size > 25 * 1024 * 1024) {
      toast.error("Image size is too big (max 25MB)");
    } else if (
      imageFile.type.match("image") ||
      imageFile.type.match("audio") ||
      imageFile.type.match("video")
    ) {
      setisMelodyUploading(true);
      setupdateValue("default_melody", imageFile);
    } else {
      toast.error("Upload only image,video or audio");
    }
  };

  /**
   * Handles the audio playback by pausing or playing the audio element based on the current state.
   * @returns None
   */
  const audioHandler = () => {
    if (audioPlay) document.getElementById("audioDivID").pause();
    else document.getElementById("audioDivID").play();

    setaudioPlay((p) => !p);
  };

  return (
    <AddEventContext.Provider
      value={{
        isFetching,
        setisFetching,
      }}
    >
      <div className={`settingSec`} style={{ display: "block" }}>
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
                      switch (ele.type) {
                        case "waiting_room":
                          if (e.target.checked) {
                            setFieldValue("join_before_host", 0);
                            // setupdateValue("join_before_host", 0);
                          }
                          break;
                        case "join_before_host":
                          if (e.target.checked) {
                            setFieldValue("waiting_room", 0);
                          }
                          break;
                        default:
                          break;
                      }
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
              <p className={`${classes.smallheading} mb-2`}>
                Default Event Type
              </p>
              <div className="col-sm-6 col-lg-3">
                <EventTypeComponent
                  isEnabledLabel={false}
                  value={formikvalues.event_type}
                  onResult={({ id }) => {
                    if (formikvalues.event_type !== id) {
                      setupdateValue("event_type", id);
                    }
                  }}
                  disabled={updateValue.includes("event_type")}
                  isLoading={updateValue.includes("event_type")}
                />
              </div>
            </div>

            <div className={classes.audioSetting}>
              <p className={classes.videoAudioSetting}>
                Default Audio Settings
              </p>
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
              <p className={classes.videoAudioSetting}>
                {" "}
                Default Video Settings
              </p>
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
                  participants in waiting room will listen to while they wait
                  for host to admit them to the meeting.
                </p>
                <Button
                  className={classes.uplBtn}
                  disabled={isMelodyUploading}
                  onClick={() => {
                    document.getElementById("UploaddefaultMelody").click();
                  }}
                >
                  Upload Media
                </Button>

                {formikvalues.default_melody &&
                formikvalues.default_melody !== "" ? (
                  <div style={{ position: "relative" }} className="mt-3">
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
                    {isMelodyUploading && (
                      <div className="m-2 d-flex flex-row">
                        <Spin /> <div className="mx-3">Uploading</div>
                      </div>
                    )}
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
                {/* <Select
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
              </Select> */}
              </div>
            ) : null}

            <Row>
              <Col sm={4}>
                <div className={`${classes.item} ${classes.melodyBox}`}>
                  <p className={classes.smallheading}>Meeting Header Image</p>
                  <p className={classes.text}>
                    Choose or upload an image that depicts this event. Leave
                    blank to use Rawcaster default.
                  </p>

                  <div style={{ maxWidth: "600px" }}>
                    {updateValue.includes("meeting_header_image") ? (
                      <Spin
                        tip="Please Wait..."
                        size="small"
                        spinning={updateValue.includes("meeting_header_image")}
                      >
                        <div
                          className={`${classes.progressSec} eventProgressSec`}
                        >
                          <Progress
                            percent={ProgressValue.percent}
                            type="circle"
                            className={classes.progress}
                            strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                          />
                        </div>
                      </Spin>
                    ) : (
                      <BannerComponent
                        value={formikvalues?.meeting_header_image}
                        size={10}
                        onResult={(val) => {
                          setupdateValue("meeting_header_image", val);
                        }}
                      />
                    )}
                  </div>
                </div>
              </Col>
              <Col sm={4}>
                <div className={`${classes.item} ${classes.melodyBox}`}>
                  <p className={classes.smallheading}>Live Event Banner</p>
                  <p className={classes.text}>
                    Choose or upload an image that depicts this event. Leave
                    blank to use Rawcaster default.
                  </p>
                  <div style={{ maxWidth: "600px" }}>
                    {updateValue.includes("live_event_banner") ? (
                      <Spin
                        tip="Please Wait..."
                        size="small"
                        spinning={updateValue.includes("live_event_banner")}
                      >
                        <div
                          className={`${classes.progressSec} eventProgressSec`}
                        >
                          <Progress
                            percent={ProgressValue.percent}
                            type="circle"
                            className={classes.progress}
                            strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                          />
                        </div>
                      </Spin>
                    ) : (
                      <BannerComponent
                        value={formikvalues?.live_event_banner}
                        size={10}
                        onResult={(val) => {
                          setupdateValue("live_event_banner", val);
                        }}
                      />
                    )}
                  </div>
                </div>
              </Col>
              <Col sm={4}>
                <div className={`${classes.item} ${classes.melodyBox}`}>
                  <p className={classes.smallheading}>Talkshow Event Banner</p>
                  <p className={classes.text}>
                    Choose or upload an image that depicts this event. Leave
                    blank to use Rawcaster default.
                  </p>

                  <div style={{ maxWidth: "600px" }}>
                    {updateValue.includes("talkshow_event_banner") ? (
                      <Spin
                        tip="Please Wait..."
                        size="small"
                        spinning={updateValue.includes("talkshow_event_banner")}
                      >
                        <div
                          className={`${classes.progressSec} eventProgressSec`}
                        >
                          <Progress
                            percent={ProgressValue.percent}
                            type="circle"
                            className={classes.progress}
                            strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                          />
                        </div>
                      </Spin>
                    ) : (
                      <BannerComponent
                        value={formikvalues?.talkshow_event_banner}
                        size={10}
                        onResult={(val) => {
                          setupdateValue("talkshow_event_banner", val);
                        }}
                      />
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}

        <input
          type="file"
          id="imageUploadSetting"
          name="imageUploadSetting"
          style={{ display: "none" }}
          onChange={(e) => {}}
          accept="image/*"
        ></input>
      </div>
    </AddEventContext.Provider>
  );
};

export default Event;
