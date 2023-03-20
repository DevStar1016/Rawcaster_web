import { Button, Dropdown, Modal, Tooltip } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import classes from "../Modal.module.css";
import pollIcon from "../../Assets/Images/svg/pollIcon.svg";
import mikeIcon from "../../Assets/Images/svg/mikeicon.svg";
import videoIcon from "../../Assets/Images/svg/videoIcon.png";
import cameraIcon from "../../Assets/Images/svg/cameraicon.svg";
import pictureIcon from "../../Assets/Images/png/photoIcon.png";
import imageIcon from "../../Assets/Images/png/videoAttach.png";
import emoji from "../../Assets/Images/svg/emoji.svg";
import CameraModal from "./CameraModal";
import { PostNuggetContext } from "../../Shared/Context";
import { SHARED_TYPE } from "../../Shared/Constant";
import AudioRecordModal from "./AudioRecordModal";
import { toast } from "react-hot-toast";
import { detectMob } from "../../Shared/Utility";
import {
  MediaPermissionsErrorType,
  requestAudioPermissions,
} from "mic-check/lib/requestMediaPermissions";
import Postpoll from "./Postpoll";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import EmojiPicker from "../../UIComponents/EmojiPicker";
import ImageGrid from "../../UIComponents/Imagegrid/ImageGrid";
import { sendMessage, socketListen } from "../../Services/SocketService";

const Postmodal = ({ visible, onClose }) => {
  const {
    getPostValues,
    setFileValues,
    setNuggetValues,
    useAuthData,
    setFieldValue,
    handleSubmit,
    values,
    NuggetData,
    isPoll,
    setisPoll,
    MetaData,
    setMetaData,
  } = useContext(PostNuggetContext);
  new Picker({
    parent: document.querySelector("#picker"),
    data: data,
    emojiButtonSize: 50,
    emojiSize: 38,
    emojiButtonColors: ["rgba(102, 51, 153, .2)"],
    icons: "solid",
  });
  const [isAudioModal, setisAudioModal] = useState(false);
  const loginUserData = useAuthData();
  const ImageRef = useRef();
  const VideoRef = useRef();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isCamera, setisCamera] = useState({ show: false, type: "" });
  const [ShareType, setShareType] = useState("Public");
  const [oldUrl, setOldurl] = useState("");

  function fetchData(type) {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((res) => {
        setisCamera({ show: true, type: type });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  const handleAllowMicPermission = () => {
    requestAudioPermissions()
      .then(() => {
        setisAudioModal(true);
      })
      .catch((err) => {
        const { type, message } = err;
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          toast.error("browser does not have permission to access microphone");
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          toast.error("user didn't allow app to access microphone");
        } else {
          toast.error(message);
        }
      });
  };

  const getLinkInfo = (val) => {
    let expression =
      /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    var t = val;
    if (t.match(regex)) {
      let url = t.match(regex);
      let addHttp = url[url.length - 1].replace(
        /^(?:(.*:)?\/\/)?(.*)/i,
        (match, schemma, nonSchemmaUrl) =>
          schemma ? match : `http://${nonSchemmaUrl}`
      );
      let index = addHttp.indexOf("http");
      if (index > 0) {
        addHttp = addHttp.substring(index, addHttp.length);
      }
      if (oldUrl !== addHttp) {
        setOldurl(addHttp);
        let message = { event: "getmetadata", url: addHttp };
        sendMessage(message, "nuggets");
      }
    }
  };

  useEffect(() => {
    socketListen.on("nuggets", (message) => {
      switch (message.event) {
        case "getmetadata":
          Getmetadata(message);
          break;
      }
    });
  }, []);

  const Getmetadata = (message) => {
    setMetaData(message.data);
  };

  return (
    <Modal
      footer={null}
      open={visible}
      height={600}
      width={650}
      onCancel={() => {
        onClose();
      }}
    >
      <div className={classes.nuggetModal}>
        <h1>Post {isPoll ? "Poll" : "Nugget"}</h1>

        <div className={classes.topProsec}>
          <img className={classes.imguser} src={loginUserData?.profile_image} />
          <p className={classes.name}>{loginUserData?.name}</p>
          <Dropdown
            menu={{
              items: SHARED_TYPE,
              onClick: ({ key }) => {
                let findData = SHARED_TYPE.find(
                  (ele) => ele.key === parseInt(key)
                );
                setShareType(findData.Value);
                setFieldValue("share_type", parseInt(key));
              },
            }}
          >
            <p className={classes.onlymeBtn}>
              <span class="material-icons">lock</span> {ShareType}{" "}
              <span class="material-icons">arrow_drop_down</span>
            </p>
          </Dropdown>
          <div className={classes.rightSec}>
            {!isPoll && (
              <Tooltip title="Post Poll">
                <img
                  src={pollIcon}
                  onClick={() => {
                    setisPoll(true);
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title="Record Audio">
              <img
                src={mikeIcon}
                onClick={() => {
                  setisPoll(false);
                  handleAllowMicPermission();
                }}
              />
            </Tooltip>
            {!detectMob() && (
              <Tooltip title="Record Video">
                <img
                  src={videoIcon}
                  onClick={() => {
                    setisPoll(false);
                    fetchData("Video");
                  }}
                />
              </Tooltip>
            )}
            {!detectMob() && (
              <Tooltip title="Capture Image">
                <img
                  src={cameraIcon}
                  onClick={() => {
                    setisPoll(false);
                    fetchData("Camera");
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title="Upload Image">
              <img
                src={pictureIcon}
                onClick={() => {
                  if (ImageRef.current) {
                    setisPoll(false);
                    ImageRef.current.click();
                  }
                }}
              />
            </Tooltip>
            <input
              ref={ImageRef}
              type="file"
              name="file"
              id="post_nugget_image"
              accept="image/png, image/gif, image/jpeg"
              onClick={(event) => {
                event.target.value = null;
              }}
              onChange={(e) => {
                console.log(e.target.files);
                if (e.target.files && e.target.files.length !== 0) {
                  setFileValues(e.target.files[0]);
                }
              }}
              style={{ display: "none" }}
            />
            <Tooltip title="Upload Video">
              <img
                src={imageIcon}
                onClick={() => {
                  if (VideoRef.current) {
                    setisPoll(false);
                    VideoRef.current.click();
                  }
                }}
              />
            </Tooltip>
            <input
              ref={VideoRef}
              type="file"
              name="file"
              id="post_nugget_video"
              accept="video/mp4"
              onClick={(event) => {
                event.target.value = null;
              }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length !== 0) {
                  setFileValues(e.target.files[0]);
                }
              }}
              style={{ display: "none" }}
            />
          </div>
        </div>
        {isPoll ? (
          <Postpoll setisPoll={setisPoll} />
        ) : (
          <>
            <div className={classes.postTextcontent}>
              <textarea
                id="post_nugget_textarea"
                className={classes.postTextarea}
                placeholder={`What's on your mind, ${loginUserData?.name}!`}
                onKeyDown={(e) => {
                  console.log(e.key, "--->key");
                }}
                value={values.content}
                onChange={(e) => {
                  if (e.target.value.length <= 700) {
                    setFieldValue("content", e.target.value);
                    getLinkInfo(e.target.value);
                  }
                }}
              />
              <img
                width="24px"
                className={classes.emojiIcon}
                src={emoji}
                style={{ cursor: "pointer" }}
                onClick={() => setShowEmojis(!showEmojis)}
              />
            </div>
            {showEmojis && (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <EmojiPicker
                  emojiButtonColors={["#364157"]}
                  emojiButtonRadius="8px"
                  skinTonePosition="none"
                  previewPosition="none"
                  // onClickOutside={() => {
                  //   setShowEmojis(!showEmojis);
                  // }}
                  categories={[
                    "people",
                    "nature",
                    "foods",
                    "activity",
                    "places",
                    "objects",
                    "symbols",
                    "flags",
                  ]}
                  onEmojiSelect={(e) => {
                    console.log(e);

                    // insertMyText(e.native);
                    setFieldValue("content", values.content.concat(e.native));
                    // console.log(e);
                  }}
                />
              </div>
              // <div
              //   id="picker"
              //   className={classes.emojiPart}
              //   style={{
              //     position: "absolute",
              //     top: "190px",
              //     right: "50px",
              //     zIndex: 11,
              //   }}
              // >
              //   {/* <CustomPicker /> */}
              //   {/* <EmojiPicker
              //     searchDisabled
              //     suggestedEmojisMode="frequent"
              //     previewConfig={{
              //       showPreview: false,
              //     }}
              //     onEmojiClick={(e) => {
              //       setFieldValue("content", values.content.concat(e.emoji));
              //     }}
              //   /> */}
              // </div>
            )}
            {/* {showEmojis && (
          <div>
            <Picker
              showPreview={false}
              showSkinTones={false}
              className={classes.emojiPart}
              style={{
                position: "absolute",
                bottom: "100px",
                right: "50px",
                zIndex: 11,
              }}
              onSelect={(e) => {
                setFieldValue("content", values.content.concat(e.native));
              }}
            />
          </div>
        )} */}
            {MetaData && NuggetData.length === 0 ? (
              <div className={classes.shareLinkSec}>
                <div
                  className={classes.clsBtn}
                  onClick={() => setMetaData(null)}
                >
                  <span class="material-icons">close</span>
                </div>
                <p className={classes.title}>{MetaData.title}</p>
                {MetaData.image && MetaData.image !== "" ? (
                  <img
                    src={MetaData.image}
                    width="100%"
                    height="200px"
                    style={{ objectFit: "cover" }}
                  ></img>
                ) : (
                  <div className={classes.domainName}>{MetaData.source}</div>
                )}
                <p>{MetaData.description}</p>
              </div>
            ) : null}

            {NuggetData.length !== 0 && (
              <div className={classes.attachementtDisplay}>
                {NuggetData.map((ele, index) => {
                  const getURL = () => {
                    console.log(URL.createObjectURL(ele));
                    let type = ele.type.split("/");
                    return {
                      path: URL.createObjectURL(ele),
                      media_type: type[0],
                      media_file_type: type[1],
                      media_id: ele.lastModified,
                    };
                  };
                  return (
                    <div className={classes.cardcontent}>
                      <ImageGrid
                        imgArray={[getURL()]}
                        muted={false}
                        isThumb={true}
                      />
                      <div
                        className={classes.overlay}
                        onClick={() => {
                          let tempData = getPostValues().filter(
                            (ele, i) => i !== index
                          );
                          setNuggetValues((pre) =>
                            pre.filter((ele, i) => i !== index)
                          );
                        }}
                      >
                        {/* <img
                src={require("../../../assets/delete.png")}
                alt="more"
                style={{ width: "20px", height: "20px" }}
              /> */}
                        <span class="material-icons">delete</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Button
              className={classes.btnstyle}
              onClick={() => {
                setShowEmojis(false);
                handleSubmit();
              }}
            >
              Post Nugget
            </Button>
          </>
        )}
      </div>
      <CameraModal
        visible={isCamera.show}
        videoRef={videoRef}
        canvasRef={canvasRef}
        type={isCamera.type}
        onSuccess={(value) => {
          setFileValues(value);
        }}
        onClose={() => {
          setisCamera({ show: false, type: "" });
        }}
      />
      <AudioRecordModal
        visible={isAudioModal}
        onClose={() => {
          setisAudioModal(false);
        }}
      />
    </Modal>
  );
};

export default Postmodal;
