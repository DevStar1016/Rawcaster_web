import React, { useEffect, useState } from "react";
import classes from "./WaitingRoom.module.css";

import { useEventRoomContext, useMainContext } from "../../../Shared/Context";
import { MeetingSessionConfiguration } from "amazon-chime-sdk-js";
import { DeviceLabels } from "amazon-chime-sdk-component-library-react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addListener } from "../../../Store/Redux/Reducer/SocketReducer";

const WaitingRoom = ({ EventData }) => {
  const { RequestStatusMessage, setRequestStatusMessage } =
    useEventRoomContext();
  const [audioPlay, setaudioPlay] = useState(false);
  const [loading, setloading] = useState(false);

  return (
    <div className={classes.contactBg}>
      <h1 className={classes.heading_h1}>{EventData?.event_name || ""}</h1>
      <div className={classes.container}>
        {!loading ? (
          <>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <span style={{ fontSize: 16, fontWeight: "bold" }}>
                {RequestStatusMessage
                  ? RequestStatusMessage
                  : EventData?.waiting_room === 1
                  ? "Please wait for a moment while host approves your request."
                  : "Please wait for a moment, host not available yet.."}
              </span>
              {RequestStatusMessage && (
                <img
                  src={require("../../../Assets/Images/Events/loader.gif")}
                  alt=""
                  style={{ width: "50%" }}
                />
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              {EventData?.melodies?.type === 3 ? (
                <React.Fragment>
                  <img
                    src={
                      audioPlay
                        ? require("../../../Assets/Images/Events/audio_img.gif")
                        : require("../../../Assets/Images/Events/audio_stop.jpg")
                    }
                    alt="audio"
                    width="100%"
                  />
                  <div
                    style={{
                      position: "absolute",
                      marginTop: "-197px",
                      left: "47%",
                      cursor: "pointer",
                    }}
                  >
                    {audioPlay ? (
                      <img
                        src={require("../../../Assets/Images/Events/music_stop.png")}
                        onClick={() => {
                          document.getElementById("audioDivID").pause();
                          setaudioPlay(false);
                        }}
                        alt="more"
                      ></img>
                    ) : (
                      <img
                        src={require("../../../Assets/Images/Events/music_play.png")}
                        alt="more"
                        onClick={() => {
                          document.getElementById("audioDivID").play();
                          setaudioPlay(true);
                        }}
                      ></img>
                    )}
                  </div>
                  <video
                    id="audioDivID"
                    width="100%"
                    controls
                    disablePictureInPicture
                    playsInline
                    autoPlay
                    controlsList="nodownload"
                    loop
                    style={{ display: "none" }}
                  >
                    {" "}
                    <source src={EventData?.melodies.path} />
                  </video>
                </React.Fragment>
              ) : null}

              {EventData?.melodies?.type === 1 ? (
                <img
                  src={EventData?.melodies.path}
                  alt="more"
                  style={{ maxHeight: "300px", maxWidth: "100%" }}
                />
              ) : null}
              {EventData?.melodies?.type === 2 ? (
                <video
                  width="100%"
                  controls
                  disablePictureInPicture
                  playsInline
                  autoPlay
                  controlsList="nodownload"
                  id="waitingroomid"
                  loop
                >
                  <source src={EventData?.melodies.path} />
                </video>
              ) : null}
            </div>
          </>
        ) : null}

        {loading ? (
          <div style={{ textAlign: "center" }}>
            <img
              src={require("../../../Assets/Images/Events/loader.gif")}
              alt=""
              style={{ width: "50%" }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WaitingRoom;
