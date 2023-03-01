import { Modal } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import classes from "./ImageGrid.module.css";
import BackgroundImg from "../Assets/Images/png/audioImg.png";
import { useInView } from "react-hook-inview";
import { useDashboard } from "../Shared/Reduxfetcher";

const ImageGrid = ({
  imgArray,
  downloadable,
  muted,
  mutenuggetaudio,
  isThumb = false,
  onPlay,
}) => {
  const { nuggetVideoPaused } = useDashboard();
  const [isPlaying, setisPlaying] = useState();
  const [isVisible, setIsVisible] = useState(false);

  const [ref] = useInView({
    threshold: 0.5,
    onEnter: (entry) => {
      if (entry.target) {
        setisPlaying(entry.target.id);
      }
    },
    onLeave: () => {
      if (imgArray && imgArray.length > 0) {
        var v = document.getElementById(`videoSingleId${imgArray[0].media_id}`);
        v.pause();
      }
    },
  });

  useEffect(() => {
    if (nuggetVideoPaused) {
      if (imgArray && imgArray.length > 0) {
        var v = document.getElementById(`videoSingleId${imgArray[0].media_id}`);
        console.log(v);
        if (v) {
          v.pause();
        }
      }
    }
  }, [nuggetVideoPaused]);

  const volumechanged = (event) => {
    if (event.target.muted) {
      mutenuggetaudio(true);
    } else {
      mutenuggetaudio(false);
    }
  };

  useEffect(() => {
    console.log(imgArray);
    if (imgArray.length !== 0) {
      let filter = imgArray.filter(
        (ele) => `videoSingleId${ele.media_id}` !== isPlaying
      );
      console.log(filter);
      filter.map((ele) => {
        let v = document.getElementById(`videoSingleId${ele.media_id}`);
        if (v) {
          v.pause();
        }
      });
    }
  }, [imgArray, isPlaying]);

  const ImageOrVideoThumb = ({ data }) => {
    if (data.media_type === "image") {
      return (
        <img
          className="selecedImages"
          src={data.path}
          alt=""
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
        />
      );
    } else if (data.media_type === "video") {
      return (
        <>
          <video
            className="selecedImages"
            controls={false}
            disablePictureInPicture
            playsInline={false}
            controlsList="nodownload"
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
          >
            <source src={data.path} />
          </video>
          <span class={`material-symbols-outlined ${classes.thumbPlayBtn}`}>
            play_circle
          </span>
        </>
      );
    } else if (data.media_type === "audio") {
      return (
        <>
          <div className={classes.musicIcon}>
            <span class="material-symbols-outlined">music_note</span>
          </div>
        </>
      );
    }
  };

  const imageOrVideoSingle = (data) => {
    if (data.media_type === "image") {
      return (
        <img
          onClick={() => {
            openGallery(0);
          }}
          className="imgGridsize"
          src={data.path}
          alt=""
          style={{ zIndex: 0 }}
        />
      );
    } else {
      return (
        <Fragment>
          {/* <img
              src={require("../../../assets/fb_play_btn.png")}
              alt="more"
              style={{ width: "10%", position: "absolute" }}
            /> */}
          <video
            id={`videoSingleId${data.media_id}`}
            ref={ref}
            width="100%"
            height="400"
            controls
            disablePictureInPicture
            className={classes.SingleVideoBg}
            playsInline
            controlsList="nodownload"
            muted={muted}
            onPlaying={(e) => {
              console.log(e);
            }}
            onPlayCapture={(e) => {
              setisPlaying(e.target.id);
              // if (`videoSingleId${data.media_id}` !== e.target.id) {
              //   {
              //     let findVal = document.getElementById(ele);
              //     if (findVal) {
              //       findVal.pause();
              //     }
              //   }

              if (onPlay) {
                onPlay();
              }
            }}
            onVolumeChange={volumechanged.bind(this)}
          >
            <source src={data.path} />
          </video>
        </Fragment>
      );
    }
  };

  const imageOrVideoSingleGallery = (data, type = "view", i) => {
    if (data.media_type === "image") {
      return (
        <img
          className={`type === "fullview" ? "" : "imgGridsize" ${classes.modalSingleimage}`}
          src={data.path}
          alt=""
        />
      );
    } else {
      return (
        <Fragment>
          <video
            width="100%"
            height="100%"
            style={{ zIndex: 500 }}
            controls
            id={`modal_video_${i}`}
            disablePictureInPicture
            playsInline
            controlsList="nodownload"
            muted={muted}
            onPlayCapture={(e) => {
              let findArray = imgArray.map((ele, i) => {
                if (`modal_video_${i}` !== e.target.id) {
                  return `modal_video_${i}`;
                } else {
                  return;
                }
              });
              console.log(findArray);
              findArray = findArray.filter((ele) => ele !== undefined);
              findArray.map((ele) => {
                let findVal = document.getElementById(ele);
                console.log(findVal);
                if (findVal) {
                  findVal.pause();
                }
              });
              if (onPlay) {
                onPlay();
              }
            }}
            onVolumeChange={volumechanged.bind(this)}
          >
            <source src={data.path} />
          </video>
        </Fragment>
      );
    }
  };

  const imageOrVideoSingleBg = (data) => {
    if (data.media_type === "image") {
      return `url(
        ${data.path}
      )`;
    } else if (data.media_type === "video") {
      return BackgroundImg;
    }
  };

  const imageOrVideo = (data) => {
    if (data.media_type === "image") {
      return (
        <Fragment>
          <div
            className="borderLight"
            onClick={() => {
              openGallery(0);
            }}
            style={{
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              filter: "blur(2px)",
              backgroundPosition: "center",
              opacity: 0.3,
              top: 0,
              left: 0,
            }}
          ></div>
          <img
            src={data.path}
            alt=""
            className="imgGridsize"
            style={{
              zIndex: 0,
            }}
          />
        </Fragment>
      );
    } else if (data.media_type === "video") {
      return (
        <Fragment>
          <img
            src={require("../Assets/Icons/png/fb_play_btn.png")}
            alt="more"
            style={{ width: "10%", position: "absolute" }}
          />

          <video
            width="100%"
            height="100%"
            style={{
              objectFit: "cover",
              objectPosition: "top",
            }}
            disablePictureInPicture
            playsInline
            controlsList="nodownload"
            muted={muted}
            onPlay={(vid) => {
              console.log(vid);
            }}
            onVolumeChange={volumechanged.bind(this)}
          >
            <source src={data.path} />
          </video>
        </Fragment>
      );
    }
  };

  const openGallery = (index) => {
    // setdownloadPath(imgArray[index].path);
    // setIndex(index);
    setIsVisible(true);
  };

  return (
    <>
      {isThumb ? (
        <>
          <ImageOrVideoThumb data={imgArray[0]} />
        </>
      ) : (
        <Fragment>
          <div style={{ position: "relative" }}>
            {imgArray.length === 1 ? (
              <div>
                <div className="singleImage">
                  {imageOrVideoSingle(imgArray[0])}
                </div>
              </div>
            ) : null}

            {imgArray.length === 2 ? (
              <div className="image-list" style={{ height: 300 }}>
                <div
                  onClick={() => {
                    openGallery(0);
                  }}
                  style={{ flex: 1, position: "relative" }}
                  className="image-item borderTop  borderRight"
                >
                  {imageOrVideo(imgArray[0])}
                </div>
                <div
                  onClick={() => {
                    openGallery(1);
                  }}
                  style={{ flex: 1, position: "relative" }}
                  className="image-item borderTop  borderRight"
                >
                  {imageOrVideo(imgArray[1])}
                </div>
              </div>
            ) : null}

            {imgArray.length === 3 ? (
              <div className="image-list" style={{ height: 400 }}>
                <div
                  onClick={() => {
                    openGallery(0);
                  }}
                  style={{ flex: 1, position: "relative" }}
                  className="image-item borderTop  borderRight"
                >
                  {imageOrVideo(imgArray[0])}
                </div>

                <div
                  style={{ flex: 1, flexDirection: "column" }}
                  className="image-list"
                >
                  <div
                    onClick={() => {
                      openGallery(1);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[1])}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(2);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[2])}
                  </div>
                </div>
              </div>
            ) : null}

            {imgArray.length === 4 ? (
              <div className="image-list" style={{ height: 450 }}>
                <div
                  style={{ flex: 1, flexDirection: "column" }}
                  className="image-list"
                >
                  <div
                    onClick={() => {
                      openGallery(0);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop borderRight"
                  >
                    {imageOrVideo(imgArray[0])}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(1);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop borderRight"
                  >
                    {imageOrVideo(imgArray[1])}
                  </div>
                </div>

                <div
                  style={{ flex: 1, flexDirection: "column" }}
                  className="image-list"
                >
                  <div
                    onClick={() => {
                      openGallery(2);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop   borderRight"
                  >
                    {imageOrVideo(imgArray[2])}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(3);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop   borderRight"
                  >
                    {imageOrVideo(imgArray[3])}
                  </div>
                </div>
              </div>
            ) : null}

            {imgArray.length === 5 ? (
              <div className="image-list" style={{ height: 500 }}>
                <div
                  style={{ flex: 1, flexDirection: "column" }}
                  className="image-list"
                >
                  <div
                    onClick={() => {
                      openGallery(0);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[0])}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(1);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[1])}
                  </div>
                </div>

                <div
                  style={{ flex: 1, flexDirection: "column" }}
                  className="image-list"
                >
                  <div
                    onClick={() => {
                      openGallery(2);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[2])}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(3);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[3])}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(4);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[4])}
                  </div>
                </div>
              </div>
            ) : null}

            {imgArray.length > 5 ? (
              <div className="image-list" style={{ height: 500 }}>
                <div
                  style={{ flex: 1, flexDirection: "column" }}
                  className="image-list"
                >
                  <div
                    onClick={() => {
                      openGallery(0);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[0])}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(1);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[1])}
                  </div>
                </div>

                <div
                  style={{ flex: 1, flexDirection: "column" }}
                  className="image-list"
                >
                  <div
                    onClick={() => {
                      openGallery(2);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[2])}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(3);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[3])}
                  </div>

                  <div
                    onClick={() => {
                      openGallery(4);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[4])}

                    <div
                      style={{
                        background: "rgba(0, 0, 0, 0.7)",
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <span style={{ fontSize: 40, color: "#fff" }}>
                        +{imgArray.length - 5}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <Modal
            className={`gallery_popup ${classes.GalleryImgModal}`}
            open={isVisible}
            onCancel={() => {
              let findArray = imgArray.map((ele, i) => {
                return `modal_video_${i}`;
              });
              findArray.map((ele) => {
                let findVal = document.getElementById(ele);
                if (findVal) {
                  findVal.pause();
                }
              });
              setIsVisible(false);
            }}
            footer={null}
            width={1000}
          >
            <div className={classes.nuggets_popup}>
              {downloadable === 1 && (
                <i
                  onClick={() => {
                    //   utility.downloadHandler(downloadPath);
                  }}
                  className={`material-icons ${classes.download_icon}`}
                >
                  download
                </i>
              )}

              <div className="custom-slider">
                <OwlCarousel
                  className="owl-theme"
                  margin={10}
                  nav
                  items={1}
                  dots={false}
                  navText={[
                    '<span class="arrow prev">‹</span>',
                    '<span class="arrow next">›</span>',
                  ]}
                >
                  {imgArray.map((ele, index) => {
                    return (
                      <div key={index}>
                        <div
                          className={classes.bgblured}
                          style={{
                            backgroundImage: imageOrVideoSingleBg(ele),
                          }}
                        ></div>
                        <div className={classes.modalContainer}>
                          {imageOrVideoSingleGallery(ele, "fullview", index)}
                        </div>
                      </div>
                    );
                  })}
                </OwlCarousel>
              </div>
            </div>
          </Modal>
        </Fragment>
      )}
    </>
  );
};

export default ImageGrid;
