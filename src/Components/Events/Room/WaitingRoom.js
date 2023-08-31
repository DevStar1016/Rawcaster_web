import React, { useEffect, useState } from "react";
import classes from "./WaitingRoom.module.css";
import { useEventRoomContext } from "../../../Shared/Context";
import { Button } from "antd";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import {
  useAuthData,
  useEventTempAuthData,
} from "../../../Shared/Reduxfetcher";
import { ChimesendMessage } from "../../../Services/SocketService";

const WaitingRoom = () => {
  const userData = useAuthData();
  const tempuserData = useEventTempAuthData();

  const { RequestStatusMessage, setRequestStatusMessage, EventData } =
    useEventRoomContext();
  const [audioPlay, setaudioPlay] = useState(false);

  const isRetryEnable = () => {
    return (
      RequestStatusMessage &&
      RequestStatusMessage.statusCode === "host_not_available"
    );
  };

  const getUserData = () => {
    if (userData) {
      return userData;
    } else {
      return tempuserData;
    }
  };

  return (
    <div className={classes.contactBg}>
      <h1 className={classes.heading_h1}>{EventData?.event_name || ""}</h1>
      <div className={classes.container}>
        <>
          <div
            style={{
              textAlign: "center",
              marginTop: 10,
              marginBottom: RequestStatusMessage ? 20 : 0,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: "bold" }}>
              {RequestStatusMessage
                ? RequestStatusMessage.message
                : EventData?.waiting_room === 1 && EventData?.type !== 2
                ? "Please wait for a moment while host approves your request."
                : "Please wait for a moment, host not available yet.."}
            </span>
            {!RequestStatusMessage && (
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

        {/* <div style={{ textAlign: "center" }}>
          <img
            src={require("../../../Assets/Images/Events/loader.gif")}
            alt=""
            style={{ width: "50%" }}
          />
        </div> */}
      </div>
      {RequestStatusMessage && (
        <div className={classes.retrySec}>
          {isRetryEnable() && (
            <Button
              className={classes.CreateBtn}
              onClick={() => {
                ChimesendMessage(
                  {
                    userId: getUserData()?.user_id,
                    refId: EventData?.reference_id,
                    name: getUserData()?.name,
                    image: getUserData()?.profile_image,
                  },
                  CHIME_SOCKET_EVENTS.JOIN_REQUEST
                );
                setRequestStatusMessage(null);
              }}
            >
              Retry
            </Button>
          )}
          <Button
            className={`${classes.CreateBtn} ${classes.CloseBtn}`}
            onClick={() => {
              window.close();
            }}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
