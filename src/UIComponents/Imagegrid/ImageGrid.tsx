import { Image as AndImage, Modal } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import classes from "./ImageGrid.module.css";
import BackgroundImg from "../../Assets/Images/png/audioImg.png";
import { useInView } from "react-hook-inview";
import { useAuthData, useNuggets } from "../../Shared/Reduxfetcher";
import AudioPlayer from "../../Sharedcomponents/AudioPlayer";
import { Carousel } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { handleisNuggetMuted } from "../../Store/Redux/Reducer/NuggetsReducer";
import { useMainContext } from "../../Shared/Context";
import { downloadurl } from "../../Shared/Utility";

type ImageProps = {
  path: string;
  media_type: string;
  media_file_type: string;
  media_id: string;
};

type props = {
  imgArray: ImageProps[];
  downloadable: number;
  isPreview?: boolean;
  isThumb?: boolean;
  onPlay: () => void;
};

function ImageGrid({
  imgArray,
  downloadable,
  isPreview = false,
  isThumb = false,
  onPlay,
}: props) {
  const dispatch = useDispatch();
  const { nuggetVideoPaused, isNuggetMuted } = useNuggets();
  const { player, setplayer } = useMainContext();
  const [isPlaying, setisPlaying] = useState<string | number | undefined>();
  const [isVisible, setIsVisible] = useState(false);
  const [ActiveModalIndex, setActiveModalIndex] = useState(0);

  const [ref] = useInView({
    threshold: 0.5,
    onEnter: (entry: IntersectionObserverEntry) => {
      if (entry.target) {
        setisPlaying(entry.target.id);
      }
    },
    onLeave: () => {
      if (imgArray && imgArray.length > 0) {
        var v: any = document.getElementById(
          `videoSingleId${imgArray[0]?.media_id}`
        );
        var a: any = document.getElementById(
          `audioSingleId${imgArray[0]?.media_id}`
        );
        if (v) {
          v?.pause();
        }
        if (a) {
          a?.pause();
        }
      }
    },
  });

  function isValidImg(URL: string) {
    var tester = new Image();
    tester.onload = () => {
      return true;
    };

    tester.onerror = (evet) => {
      return false;
    };
    tester.src = URL;
    return true;
  }

  const getAspectRatio = (index: number) => {
    const length = imgArray.length;

    if (length === 1) {
      return 1.5;
    } else if (length === 2) {
      return 0.7;
    } else if (length >= 3) {
      if (index === 1) {
        return 1;
      } else {
        if (length === 3) {
          return 0.8;
        } else if (length === 4) {
          return 0.9;
        } else {
        }
      }
    }
    return 1.3;
  };

  useEffect(() => {
    if (nuggetVideoPaused) {
      if (imgArray && imgArray.length > 0) {
        var v: any = document.getElementById(
          `videoSingleId${imgArray[0].media_id}`
        );
        if (v) {
          v?.pause();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nuggetVideoPaused]);

  const volumechanged = (event: any) => {
    if (!isPreview) {
      dispatch(handleisNuggetMuted(event.target.muted));
    }
  };

  useEffect(() => {
    if (imgArray.length !== 0) {
      let filter = imgArray.filter(
        (ele: ImageProps) => `videoSingleId${ele?.media_id}` !== isPlaying
      );
      // eslint-disable-next-line  array-callback-return
      filter.map((ele) => {
        let v: any = document.getElementById(`videoSingleId${ele.media_id}`);
        if (v) {
          v.pause();
        }
      });
    }
  }, [imgArray, isPlaying]);

  const ImageOrVideoThumb = ({ data }) => {
    if (data.media_type === "image") {
      return isValidImg(data.path) ? (
        <img
          className="selecedImages"
          src={data.path}
          alt={data.path}
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = BackgroundImg;
          }}
        />
      ) : null;
    } else if (data.media_type === "video") {
      return (
        <>
          <video
            preload="metadata"
            src={`${data.path}#t=0.001`}
            // type="video/mp4"
            className="selecedImages"
            controls={false}
            disablePictureInPicture
            playsInline={false}
            controlsList={downloadable === 1 ? "download" : "nodownload"}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
              // backgroundColor: "red",
            }}
          ></video>
          <span className={`material-symbols-outlined ${classes.thumbPlayBtn}`}>
            play_circle
          </span>
        </>
      );
    } else if (data.media_type === "audio") {
      return (
        <>
          <div className={classes.musicIcon}>
            <span className="material-symbols-outlined">music_note</span>
          </div>
        </>
      );
    }
  };

  const imageOrVideoSingle = (data: ImageProps, index: number) => {
    if (data.media_type === "image") {
      return isValidImg(data.path) ? (
        <img
          onClick={() => {
            openGallery(0);
          }}
          className="imgGridsize"
          src={data.path}
          alt={data.path}
          style={{ zIndex: 0, aspectRatio: getAspectRatio(index) }}
          onError={({ currentTarget, ...evt }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = BackgroundImg;
          }}
        />
      ) : null;
    } else if (data.media_file_type === "wav") {
      return (
        <>
          <AudioPlayer
            url={data.path}
            audioId={`audioSingleId${data.media_id}`}
            isPreview={isPreview}
            isDownloadEnable={downloadable === 1}
          />
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
            controlsList={downloadable === 1 ? "download" : "nodownload"}
            muted={!isPreview && isNuggetMuted}
            onPlayCapture={(e: any) => {
              if (player && player.id !== `videoSingleId${data.media_id}`) {
                player.pause();
              }
              const video = document.getElementById(
                `videoSingleId${data.media_id}`
              );
              setplayer(video);
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
            // type="video/mp4"
            onVolumeChange={volumechanged}
          ></video>
        </Fragment>
      );
    } else if (data.media_type === "audio") {
      return (
        <>
          <AudioPlayer
            url={data.path}
            audioId={`audioSingleId${data.media_id}`}
            isPreview={isPreview}
            isDownloadEnable={downloadable === 1}
          />
        </>
      );
    }
  };

  const imageOrVideoSingleGallery = (data: any, type = "view", i: any) => {
    if (data.media_type === "image") {
      return isValidImg(data.path) ? (
        <img
          className={`type === "fullview" ? "" : "imgGridsize" ${classes.modalSingleimage}`}
          src={data.path}
          alt={data.path}
          key={data.media_id || ""}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = BackgroundImg;
          }}
        />
      ) : null;
    } else if (data.media_type === "video") {
      return (
        <video
          width="100%"
          height="100%"
          style={{ zIndex: 500, maxHeight: 525 }}
          controls
          preload="metadata"
          id={`modal_video_${i}`}
          className="video-item"
          disablePictureInPicture
          playsInline
          controlsList={downloadable === 1 ? "download" : "nodownload"}
          muted={isNuggetMuted}
          onPlayCapture={(e: any) => {
            if (player && player.id !== `modal_video_${i}`) {
              player.pause();
            }
            const video = document.getElementById(`modal_video_${i}`);
            setplayer(video);
            // eslint-disable-next-line  array-callback-return
            let findArray = imgArray?.map((ele: ImageProps, i: number) => {
              if (`modal_video_${i}` !== e.target.id) {
                return `modal_video_${i}`;
              } else {
                // eslint-disable-next-line  array-callback-return
                return;
              }
            });
            // eslint-disable-next-line  array-callback-return
            findArray = findArray.filter(
              (ele: string | undefined) => ele !== undefined
            );
            // eslint-disable-next-line  array-callback-return
            findArray.map((ele: string | undefined) => {
              if (ele) {
                const findVal: HTMLElement | null =
                  document.getElementById(ele);

                if (findVal && findVal instanceof HTMLVideoElement) {
                  findVal.pause();
                }
              }
            });

            if (onPlay) {
              onPlay();
            }
          }}
          src={`${data.path}#t=0.001`}
          onVolumeChange={volumechanged}
        ></video>
      );
    } else if (data.media_type === "audio") {
      return (
        <>
          <AudioPlayer
            url={data.path}
            audioId={`audioSingleId${data.media_id}`}
            isPreview={undefined}
            isDownloadEnable={downloadable === 1}
          />
        </>
      );
    }
  };

  const imageOrVideoSingleBg = (data: ImageProps) => {
    if (data.media_type === "image") {
      return `url(
        ${data.path}
      )`;
    } else if (data.media_type === "video") {
      return BackgroundImg;
    }
  };

  const imageOrVideo = (data: ImageProps, isThumb: boolean) => {
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
            alt={data.path}
            className="imgGridsize"
            style={{
              zIndex: 0,
            }}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = BackgroundImg;
            }}
          />
        </Fragment>
      );
    } else if (data.media_type === "audio") {
      return (
        <>
          <AudioPlayer
            url={data?.path}
            isThumb={isThumb}
            audioId={`audioSingleId${data.media_id}`}
            isPreview={undefined}
            isDownloadEnable={downloadable === 1}
          />
        </>
      );
    } else if (data.media_type === "video") {
      return (
        <Fragment>
          <img
            src={require("../../Assets/Icons/png/fb_play_btn.png")}
            alt="more"
            style={{ width: "10%", position: "absolute" }}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = BackgroundImg;
            }}
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
            controlsList={
              !isThumb && downloadable === 1 ? "download" : "nodownload"
            }
            muted={isNuggetMuted}
            onVolumeChange={volumechanged}
            src={`${data.path}#t=0.001`}
            // type="video/mp4"
          ></video>
        </Fragment>
      );
    }
  };

  const openGallery = (index: number) => {
    setActiveModalIndex(index);
    // setdownloadPath(imgArray[index].path);
    // setIndex(index);
    setIsVisible(true);
  };

  const ImageorSingleModal = (data: ImageProps, index: number) => {
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
    } else if (data.media_type === "audio") {
      return (
        <div key={index} style={{ height: "100%" }}>
          <div className={`${classes.audiomodalContainer}`}>
            {imageOrVideoSingleGallery(data, "fullview", index)}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {isThumb ? (
        ImageOrVideoThumb({ data: imgArray[0] })
      ) : (
        // <>
        //   <ImageOrVideoThumb data={imgArray[0]} />
        // </>
        <Fragment>
          <div style={{ position: "relative" }}>
            {imgArray.length === 1 ? (
              <div>
                <div className="singleImage">
                  {imageOrVideoSingle(imgArray[0], 0)}
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
                  {imageOrVideo(imgArray[0], true)}
                </div>
                <div
                  onClick={() => {
                    openGallery(1);
                  }}
                  style={{ flex: 1, position: "relative" }}
                  className="image-item borderTop  borderRight"
                >
                  {imageOrVideo(imgArray[1], true)}
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
                  {imageOrVideo(imgArray[0], true)}
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
                    {imageOrVideo(imgArray[1], true)}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(2);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[2], true)}
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
                    {imageOrVideo(imgArray[0], true)}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(1);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop borderRight"
                  >
                    {imageOrVideo(imgArray[1], true)}
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
                    {imageOrVideo(imgArray[2], true)}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(3);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop   borderRight"
                  >
                    {imageOrVideo(imgArray[3], true)}
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
                    {imageOrVideo(imgArray[0], true)}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(1);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[1], true)}
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
                    {imageOrVideo(imgArray[2], true)}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(3);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[3], true)}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(4);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[4], true)}
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
                    {imageOrVideo(imgArray[0], true)}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(1);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[1], true)}
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
                    {imageOrVideo(imgArray[2], true)}
                  </div>
                  <div
                    onClick={() => {
                      openGallery(3);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[3], true)}
                  </div>

                  <div
                    onClick={() => {
                      openGallery(4);
                    }}
                    style={{ flex: 1, position: "relative" }}
                    className="image-item borderTop  borderRight"
                  >
                    {imageOrVideo(imgArray[4], true)}

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
            centered
            className={`gallery_popup ${classes.GalleryImgModal}`}
            open={isVisible}
            onCancel={() => {
              let findArray = imgArray?.map((ele: ImageProps, i: number) => {
                return `modal_video_${i}`;
              });
              // eslint-disable-next-line  array-callback-return
              findArray.map((ele: any) => {
                let findVal: any = document.getElementById(ele);
                if (findVal) {
                  findVal?.pause();
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
                  style={{
                    marginTop: 13,
                    cursor: "pointer",
                    zIndex: 25,
                  }}
                  onClick={() => {
                    downloadurl(imgArray[ActiveModalIndex]?.path);

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
                      <b className="arrow next ">›</b>
                    ) : null
                  }
                  prevIcon={
                    ActiveModalIndex !== 0 ? (
                      <b className="arrow prev">‹</b>
                    ) : null
                  }
                >
                  {imgArray?.map((ele: ImageProps, index: number) => {
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
}

export default ImageGrid;
