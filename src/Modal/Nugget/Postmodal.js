import { Button, Dropdown, Input, Modal, Tooltip } from "antd";
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
import { PostNuggetContext, useListNuggetContext } from "../../Shared/Context";
import { SHARED_TYPE } from "../../Shared/Constant";
import AudioRecordModal from "./AudioRecordModal";
import { toast } from "react-hot-toast";
import { detectMob, getAspectRatio } from "../../Shared/Utility";
import {
  MediaPermissionsErrorType,
  requestAudioPermissions,
  requestVideoPermissions,
} from "mic-check/lib/requestMediaPermissions";
import Postpoll from "./Postpoll";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import EmojiPicker from "../../UIComponents/EmojiPicker";
import ImageGrid from "../../UIComponents/Imagegrid/ImageGrid";
import { sendMessage, socketListen } from "../../Services/SocketService";
import ImageCropModal from "../ImageCropModal";
import SpecificConnectionorGroup from "./SpecificConnectionorGroup";
import { parseInt } from "lodash";
import ImageEditModal from "../ImageEditModal";

const Postmodal = ({ visible, onClose }) => {
  const {
    setFileValues,
    setNuggetValues,
    useAuthData,
    setFieldValue,
    handleSubmit,
    values,
    NuggetData,
    setshareWithData,
    isPoll,
    setisPoll,
    MetaData,
    setMetaData,
    previewMedia,
    setpreviewMedia,
    shareWithData,
    setdeletedMedia,
  } = useContext(PostNuggetContext);
  const { isEdit } = useListNuggetContext();
  const textinputRef = useRef(null);
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
  const [NuggetImg, setNuggetImg] = useState();
  const [isCamera, setisCamera] = useState({ show: false, type: "" });
  const [ShareType, setShareType] = useState("Public");

  const [oldUrl, setOldurl] = useState("");
  const [GrouporConnectionModal, setGrouporConnectionModal] = useState({
    show: false,
    type: "",
  });

  const handleCameraPermission = (type) => {
    requestVideoPermissions()
      .then(() => {
        setisPoll(false);
        setisCamera({ show: true, type: type });
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

  useEffect(() => {
    const findShareType = SHARED_TYPE.find(
      (ele) => ele.id === values.share_type
    );
    if (findShareType) {
      setShareType(findShareType.Value);
    }
  }, [values]);

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
    // return () => {
    //   socketListen.off("call");
    // };
  }, []);

  const Getmetadata = (message) => {
    setMetaData(message.data);
  };

  return (
    <Modal
      centered
      footer={null}
      open={visible}
      height={600}
      width={650}
      onCancel={() => {
        onClose();
      }}
    >
      <div className={classes.nuggetModal}>
        <h1>
          {isEdit ? "Update" : "Post"} {isPoll ? "Poll" : "Nugget"}
        </h1>

        <div className={classes.topProsec}>
          <img className={classes.imguser} src={loginUserData?.profile_image} />
          <p className={classes.name}>{loginUserData?.name}</p>
          <Dropdown
            menu={{
              items: SHARED_TYPE,
              onClick: ({ key }) => {
                if (parseInt(key) === 3 || parseInt(key) === 4) {
                  setGrouporConnectionModal({
                    show: true,
                    type:
                      parseInt(key) === 3
                        ? "group"
                        : parseInt(key) === 4 && "connections",
                  });
                } else {
                  let findData = SHARED_TYPE.find(
                    (ele) => ele.key === parseInt(key)
                  );
                  setShareType(findData.Value);
                  setFieldValue("share_type", parseInt(key));
                  setshareWithData([]);
                }
              },
            }}
          >
            <p className={classes.onlymeBtn}>
              <span class="material-icons">lock</span> {ShareType}{" "}
              <span class="material-icons">arrow_drop_down</span>
            </p>
          </Dropdown>
          <div
            className={classes.posteditSec}
            style={{
              display:
                parseInt(values.share_type) === 3 ||
                parseInt(values.share_type) === 4
                  ? ""
                  : "none",
            }}
          >
            <span
              class="material-symbols-outlined mx-2"
              onClick={() => {
                setGrouporConnectionModal({
                  show: true,
                  type:
                    parseInt(values.share_type) === 3
                      ? "group"
                      : parseInt(values.share_type) === 4 && "connections",
                });
              }}
            >
              edit
            </span>
          </div>
          <div className={classes.rightSec}>
            {!isPoll && !isEdit && (
              <Tooltip title="Post Poll">
                <img
                  src={pollIcon}
                  alt="Post poll"
                  onClick={() => {
                    setisPoll(true);
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title="Record Audio">
              <img
                src={mikeIcon}
                alt="Record Audio"
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
                  alt="Record Video"
                  onClick={() => {
                    handleCameraPermission("Video");
                  }}
                />
              </Tooltip>
            )}
            {!detectMob() && (
              <Tooltip title="Capture Image">
                <img
                  src={cameraIcon}
                  alt="Capture Image"
                  onClick={() => {
                    handleCameraPermission("Camera");
                  }}
                />
              </Tooltip>
            )}
            <Tooltip title="Upload Image">
              <img
                src={pictureIcon}
                alt="Upload Image"
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
                if (e.target.files && e.target.files.length !== 0) {
                  setFileValues(e.target.files[0]);
                }
              }}
              style={{ display: "none" }}
            />
            <Tooltip title="Upload Video">
              <img
                src={imageIcon}
                alt="Upload Video"
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
              <Input.TextArea
                id="post_nugget_textarea"
                ref={textinputRef}
                className={classes.postTextarea}
                placeholder={`What's on your mind, ${loginUserData?.name}!`}
                onPaste={(event) => {
                  const pastedText = event.clipboardData.getData("text/plain");
                  const selectedText = window.getSelection().toString();
                  const updatedText = textinputRef.current.value.replace(
                    selectedText,
                    pastedText
                  );
                  setFieldValue("content", updatedText);
                  getLinkInfo(updatedText);
                }}
                value={values.content}
                onChange={(e) => {
                  // let MAX_LENGTH = 700;
                  // if (e.target.value.length <= MAX_LENGTH) {
                  setFieldValue("content", e.target.value);
                  getLinkInfo(e.target.value);
                  // } else {
                  //   setFieldValue(
                  //     "content",
                  //     e.target.value.slice(0, MAX_LENGTH)
                  //   );
                  //   getLinkInfo(e.target.value.slice(0, MAX_LENGTH));
                  // }
                }}
              />
              <img
                width="24px"
                alt="Add Emoji"
                className={classes.emojiIcon}
                src={emoji}
                style={{ cursor: "pointer" }}
                onClick={() => setShowEmojis(!showEmojis)}
              />
            </div>
            {showEmojis && (
              <div
                className={classes.emojiPicker}
                style={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <EmojiPicker
                  emojiButtonColors={["#364157"]}
                  emojiButtonRadius="8px"
                  skinTonePosition="none"
                  previewPosition="none"
                  perLine={detectMob() ? 8 : 9}
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
                  onEmojiSelect={(event, emojiObject) => {
                    setFieldValue(
                      "content",
                      values.content.concat(event.native)
                    );
                  }}
                />
              </div>
            )}

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
                    alt="Meta Data"
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

            {(NuggetData.length !== 0 || previewMedia.length !== 0) && (
              <div className={classes.attachementtDisplay}>
                {previewMedia?.map((ele, index) => {
                  return (
                    <div className={classes.cardcontent}>
                      <ImageGrid
                        imgArray={[ele]}
                        muted={false}
                        isThumb={true}
                      />
                      <div
                        className={classes.overlay}
                        onClick={() => {
                          setpreviewMedia((pre) =>
                            pre.filter((elem) => elem.media_id !== ele.media_id)
                          );
                          setdeletedMedia((pre) => [...pre, ele.media_id]);
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
                {NuggetData?.map((ele, index) => {
                  const getURL = () => {
                    let type = ele.type.split("/");
                    return {
                      path: URL.createObjectURL(ele),
                      media_type: type[0],
                      media_file_type: type[1],
                      media_id: ele.lastModified,
                    };
                  };
                  return (
                    <>
                      <div className={classes.cardcontent}>
                        <ImageGrid
                          imgArray={[getURL()]}
                          muted={false}
                          isThumb={true}
                        />
                        <div
                          className={classes.overlay}
                          onClick={() => {
                            setNuggetValues((pre) =>
                              pre.filter((ele, i) => i !== index)
                            );
                          }}
                        >
                          <span class="material-icons">delete</span>
                        </div>
                      </div>
                      {getURL().media_type.includes("image") && (
                        <div
                          className={classes.editSec}
                          onClick={() => {
                            setNuggetImg({ ele: ele, index: index });
                          }}
                        >
                          <span class="material-symbols-outlined">edit</span>
                        </div>
                      )}
                    </>
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
              {isEdit ? "Edit Nugget" : "Post Nugget"}
            </Button>
          </>
        )}
      </div>
      {isCamera.show && (
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
      )}
      <AudioRecordModal
        visible={isAudioModal}
        onSuccess={(file) => {
          setFileValues(file);
        }}
        onClose={() => {
          setisAudioModal(false);
        }}
      />
      {GrouporConnectionModal.show && (
        <SpecificConnectionorGroup
          open={GrouporConnectionModal.show}
          type={GrouporConnectionModal.type}
          shareWithData={shareWithData}
          share_type={
            GrouporConnectionModal.type === "group"
              ? 3
              : GrouporConnectionModal.type === "connections"
              ? 4
              : ""
          }
          onSuccess={(val) => {
            if (GrouporConnectionModal.type === "group") {
              let findData = SHARED_TYPE.find((ele) => ele.key === 3);
              setShareType(findData.Value);
              setFieldValue("share_type", 3);
              let finalVal = val.map((ele) => ele.group_id);
              setshareWithData(finalVal);
            } else if (GrouporConnectionModal.type === "connections") {
              let findData = SHARED_TYPE.find((ele) => ele.key === 4);
              setShareType(findData.Value);
              setFieldValue("share_type", 4);
              let finalVal = val.map((ele) => ele.user_id);
              setshareWithData(finalVal);
            }
            setGrouporConnectionModal({
              show: false,
              type: "",
            });
          }}
          onClose={() => {
            setGrouporConnectionModal({
              show: false,
              type: "",
            });
          }}
        />
      )}
      {/* {NuggetImg && (
        <ImageCropModal
          open={NuggetImg}
          validsize={5}
          src={URL.createObjectURL(NuggetImg.ele)}
          ratio={getAspectRatio(150, 150)}
          onSuccess={(val) => {
            setFileValues(val, NuggetImg.index);
            setNuggetImg();
          }}
          onFailure={() => {
            setNuggetImg();
          }}
        />
      )} */}
      {NuggetImg && (
        <ImageEditModal
          open={NuggetImg}
          initialFile={NuggetImg.ele}
          onSuccess={(url) => {
            var file = new File([url.Blob], "edited_img.jpeg", {
              type: url.Blob.type,
            });
            setFileValues(file, NuggetImg.index);
            setNuggetImg();
          }}
          onFailure={() => {
            setNuggetImg();
          }}
        />
      )}
    </Modal>
  );
};

export default Postmodal;
