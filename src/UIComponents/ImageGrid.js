import { Modal } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import classes from "./ImageGrid.module.css";
import BackgroundImg from "../Assets/Images/png/audioImg.png";
import { useInView } from "react-hook-inview";
import { useDashboard } from "../Shared/Reduxfetcher";
import AudioPlayer from "../Sharedcomponents/AudioPlayer";
import { Carousel } from "react-bootstrap";

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
  const [ActiveModalIndex, setActiveModalIndex] = useState(0);
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

  const getAspectRatio = (index) => {
    const length = imgArray.length;

    if (length === 1) {
      return 0.89;
    } else if (length === 2) {
      return 0.7;
    } else if (length >= 3) {
      if (index === 1) {
        return 1;
      }
      return 0.8;
      // else {
      //   if (length === 3) {
      //     return 0.8;
      //   }
      //    else if (length === 4) {
      //     return 0.9;
      //   }
      // }
    }
    return 1.3;
  };

  useEffect(() => {
    if (nuggetVideoPaused) {
      if (imgArray && imgArray.length > 0) {
        var v = document.getElementById(`videoSingleId${imgArray[0].media_id}`);
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
    if (imgArray.length !== 0) {
      let filter = imgArray.filter(
        (ele) => `videoSingleId${ele.media_id}` !== isPlaying
      );
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
            preload="metadata"
            src={`${data.path}#t=0.001`}
            type="video/mp4"
            className="selecedImages"
            controls={false}
            disablePictureInPicture
            playsInline={false}
            controlsList="nodownload"
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
            onClickCapture={(e) => {
              console.log(e, "===>ImageOrVideoThumb");
            }}
          ></video>
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
    } else if (data.media_file_type === "wav") {
      return (
        <>
          <AudioPlayer url={data.path} />
        </>
      );
    } else if (data.media_type === "video") {
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
            onClickCapture={(e) => {
              console.log(e, "===>imageOrVideoSingle");
            }}
            onPlayCapture={(e) => {
              console.log(e);
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
            preload="metadata"
            src={`${data.path}#t=0.001`}
            type="video/mp4"
            onVolumeChange={volumechanged.bind(this)}
          ></video>
        </Fragment>
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

  const imageOrVideoSingleGallery = (data, type = "view", i) => {
    if (data.media_type === "image") {
      return (
        <img
          className={`type === "fullview" ? "" : "imgGridsize" ${classes.modalSingleimage}`}
          src={data.path}
          alt=""
        />
      );
    } else if (data.media_type === "video") {
      return (
        <video
          width="100%"
          height="100%"
          style={{ zIndex: 500 }}
          controls
          preload="metadata"
          id={`modal_video_${i}`}
          className="video-item"
          disablePictureInPicture
          playsInline
          controlsList="nodownload"
          muted={muted}
          onClickCapture={(e) => {
            console.log(e, "===>imageOrVideoSingleGallery");
          }}
          onPlayCapture={(e) => {
            let findArray = imgArray.map((ele, i) => {
              if (`modal_video_${i}` !== e.target.id) {
                return `modal_video_${i}`;
              } else {
                return;
              }
            });

            findArray = findArray.filter((ele) => ele !== undefined);
            findArray.map((ele) => {
              let findVal = document.getElementById(ele);

              if (findVal) {
                findVal.pause();
              }
            });
            if (onPlay) {
              onPlay();
            }
          }}
          src={`${data.path}#t=0.001`}
          type="video/mp4"
          onVolumeChange={volumechanged.bind(this)}
        ></video>
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
    } else if (data.media_file_type === "wav") {
      return (
        <>
          {" "}
          <AudioPlayer url={data.path} />
        </>
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
            preload="metadata"
            style={{
              objectFit: "cover",
              objectPosition: "top",
            }}
            disablePictureInPicture
            playsInline
            controlsList="nodownload"
            muted={muted}
            onVolumeChange={volumechanged.bind(this)}
            src={`${data.path}#t=0.001`}
            type="video/mp4"
            onClickCapture={(e) => {
              console.log(e, "===>imageOrVideo");
            }}
            onPlay={(e) => {
              console.log(e);
            }}
          ></video>
        </Fragment>
      );
    }
  };

  const openGallery = (index) => {
    setActiveModalIndex(index);
    // setdownloadPath(imgArray[index].path);
    // setIndex(index);
    setIsVisible(true);
  };

  const ImageorSingleModal = (data, index) => {
    if (data.media_type === "image") {
      return (
        <div key={index} style={{ height: "100%" }}>
          <div
            className={classes.bgblured}
            style={{
              backgroundImage: imageOrVideoSingleBg(data),
            }}
          ></div>
          <div className={classes.imagemodalContainer}>
            {imageOrVideoSingleGallery(data, "fullview", index)}
          </div>
        </div>
      );
    } else if (data.media_type === "video") {
      return (
        <div key={index} style={{ height: "100%" }}>
          <div className={`${classes.videomodalContainer}`}>
            {imageOrVideoSingleGallery(data, "fullview", index)}
          </div>
        </div>
      );
    }
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
                <Carousel
                  indicators={false}
                  interval={null}
                  touch={false}
                  activeIndex={ActiveModalIndex}
                  onSelect={(e) => {
                    setActiveModalIndex(e);
                  }}
                  nextIcon={
                    ActiveModalIndex !== imgArray.length - 1 ? (
                      <b class="arrow next ">›</b>
                    ) : null
                  }
                  prevIcon={
                    ActiveModalIndex !== 0 ? <b class="arrow prev">‹</b> : null
                  }
                >
                  {imgArray.map((ele, index) => {
                    return (
                      <Carousel.Item>
                        {ImageorSingleModal(ele, index)}
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              </div>
            </div>
          </Modal>
        </Fragment>
      )}
    </>
  );
};

export default ImageGrid;
