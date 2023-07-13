import React, { useState } from "react";
import classes from "./WaitingRoom.module.css";
import { useDashboard } from "../../../Shared/Reduxfetcher";
import { useLoaderData } from "react-router";

const WaitingRoom = () => {
  const albums = useLoaderData();
  console.log(albums, "albumsalbums");
  const { ActiveEventData } = useDashboard();
  const [audioPlay, setaudioPlay] = useState(false);
  const [loading, setloading] = useState(false);
  return (
    <div className={classes.contactBg}>
      <h1 className={classes.heading_h1}>{ActiveEventData?.eventName || ""}</h1>
      <div className={classes.container}>
        {!loading ? (
          <>
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <span style={{ fontSize: 16, fontWeight: "bold" }}>
                {ActiveEventData?.waiting_room === 1
                  ? "Please wait for a moment while host approves your request."
                  : "Please wait for a moment, host not available yet.."}
              </span>
              <img
                src={require("../../../Assets/Images/Events/loader.gif")}
                alt=""
                style={{ width: "50%" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              {ActiveEventData?.melodies.type === 3 ? (
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
                        alt="more"
                      ></img>
                    ) : (
                      <img
                        src={require("../../../Assets/Images/Events/music_play.png")}
                        alt="more"
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
                    <source src={ActiveEventData?.melodies.path} />
                  </video>
                </React.Fragment>
              ) : null}

              {ActiveEventData?.melodies.type === 1 ? (
                <img
                  src={ActiveEventData?.melodies.path}
                  alt="more"
                  style={{ maxHeight: "300px", maxWidth: "100%" }}
                />
              ) : null}
              {ActiveEventData?.melodies.type === 2 ? (
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
                  <source src={ActiveEventData?.melodies.path} />
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
