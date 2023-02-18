import { Modal } from "antd";
import React, { Fragment, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import classes from "./ImageGrid.module.css";

const ImageGrid = (props) => {
  const { imgArray, downloadable, muted, mutenuggetaudio } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [downloadPath, setdownloadPath] = useState(null);

  // const [ref] = useInView({
  //   threshold: 0.5,

  //   onLeave: () => {
  //     if (imgArray && imgArray.length > 0) {
  //       var v = document.getElementById(`videoSingleId${imgArray[0].media_id}`);
  //       v.pause();
  //     }
  //   },
  // });

  const volumechanged = (event) => {
    if (event.target.muted) {
      mutenuggetaudio(true);
    } else {
      mutenuggetaudio(false);
    }
  };

  const imageOrVideoSingle = (data) => {
    if (data.media_type === "image") {
      return (
        <img
          onClick={() => {
            console.log("open");
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
            //   ref={ref}
            id={`videoSingleId${data.media_id}`}
            width="100%"
            height="400"
            controls
            disablePictureInPicture
            playsInline
            controlsList="nodownload"
            muted={muted}
            onVolumeChange={volumechanged.bind(this)}
          >
            <source src={data.path} />
          </video>
        </Fragment>
      );
    }
  };

  const imageOrVideoSingleGallery = (data, type = "view") => {
    if (data.media_type === "image") {
      return (
        <img
          className={type === "fullview" ? "" : "imgGridsize"}
          src={data.path}
          alt=""
          style={{ zIndex: 0, height: "700px", margin: "auto", width: "500px" }}
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
            disablePictureInPicture
            playsInline
            controlsList="nodownload"
            muted={muted}
            onVolumeChange={volumechanged.bind(this)}
          >
            <source src={data.path} />
          </video>
        </Fragment>
      );
    }
  };

  const imageOrVideo = (data) => {
    if (data.media_type === "image") {
      return (
        <Fragment>
          <div
            className="borderLight"
            onClick={() => {
              console.log("open");
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
    } else {
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
            onVolumeChange={volumechanged.bind(this)}
          >
            <source src={data.path} />
          </video>
        </Fragment>
      );
    }
  };

  const openGallery = (index) => {
    setdownloadPath(imgArray[index].path);
    setIndex(index);
    setIsVisible(true);
  };

  const arrowStyles = {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    width: 30,
    height: 30,
    cursor: "pointer",
    borderRadius: 25,
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  };

  return (
    <Fragment>
      <div style={{ position: "relative" }}>
        {imgArray.length === 1 ? (
          <div>
            <div className="singleImage">{imageOrVideoSingle(imgArray[0])}</div>
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
          setIsVisible(false);
        }}
        footer={null}
        width={1500}
      >
        <div className="nuggets_popup">
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
                      style={{
                        position: "absolute",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        filter: "blur(10px)",
                        backgroundPosition: "center",
                        opacity: 0.5,
                        backgroundImage: `url(${ele.path})`,
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    ></div>

                    {imageOrVideoSingleGallery(ele, "fullview")}
                  </div>
                );
              })}
            </OwlCarousel>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default ImageGrid;
