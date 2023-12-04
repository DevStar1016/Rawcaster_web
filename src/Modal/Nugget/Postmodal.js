import {
  Alert,
  Button,
  Dropdown,
  Input,
  Modal,
  Space,
  Tooltip,
  message,
} from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import classes from "../Modal.module.css";
import pollIcon from "../../Assets/Images/svg/pollIcon.svg";
import mikeIcon from "../../Assets/Images/svg/mikeicon.svg";
import videoIcon from "../../Assets/Images/svg/videoIcon.png";
import cameraIcon from "../../Assets/Images/svg/cameraicon.svg";
import pictureIcon from "../../Assets/Images/png/photoIcon.png";
import imageIcon from "../../Assets/Images/png/videoAttach.png";
import emoji from "../../Assets/Images/svg/emoji.svg";
import CameraModal from "./CameraModal";
import {
  PostNuggetContext,
  useGlobalContext,
  useListNuggetContext,
} from "../../Shared/Context";
import { SHARED_TYPE } from "../../Shared/Constant";
import AudioRecordModal from "./AudioRecordModal";
import { toast } from "react-hot-toast";
import { JSONtoformdata, detectMob } from "../../Shared/Utility";
import {
  MediaPermissionsErrorType,
  requestAudioPermissions,
  requestVideoPermissions,
} from "mic-check/lib/requestMediaPermissions";
import Postpoll from "./Postpoll";
import EmojiPicker from "../../UIComponents/EmojiPicker";
import ImageGrid from "../../UIComponents/Imagegrid/ImageGrid";
import SpecificConnectionorGroup from "./SpecificConnectionorGroup";
import { parseInt } from "lodash";
import ImageEditModal from "../ImageEditModal";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import {
  GeturlmetadataService,
  complementaryMembershipService,
} from "../../Services/ApiService";
import { HandleVerifyModal } from "../DefaultModal";
import { defaultprofileImg } from "../../Shared/CommonConstants";
import { handleLoginData } from "../../Store/Redux/Reducer/AuthReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import useDataHandler from "../../Shared/ReduxCustomHooks";

const Postmodal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    resetForm,
  } = useContext(PostNuggetContext);
  const { usePartialDisplayName } = useDataHandler();
  const display_name = usePartialDisplayName();
  const { setPostContent } = useGlobalContext() ?? {};
  const [messageApi] = message.useMessage();
  const { isEdit } = useListNuggetContext();
  const textinputRef = useRef(null);
  const [isAudioModal, setisAudioModal] = useState(false);
  const loginUserData = useAuthData();
  const ImageRef = useRef();
  const oldURL = useRef();
  const VideoRef = useRef();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isPostContentValid, setisPostContentValid] = useState(true);
  const [NuggetImg, setNuggetImg] = useState();
  const [isCamera, setisCamera] = useState({ show: false, type: "" });
  const [ShareType, setShareType] = useState("Public");
  const [LimitExceeds, setLimitExceeds] = useState(false);
  const token = useAuthToken();
  const [GrouporConnectionModal, setGrouporConnectionModal] = useState({
    show: false,
    type: "",
  });

  const HandleClose = () => {
    setisPostContentValid(true);
    resetForm();
    setLimitExceeds(false);
    onClose();
    setMetaData(null);
    setPostContent("");
  };

  /**
   * Handles the camera permission for a specific type.
   * @param {string} type - The type of camera permission to handle.
   * @returns None
   */
  const handleCameraPermission = (type) => {
    requestVideoPermissions()
      .then(() => {
        setisPoll(false);
        setisCamera({ show: true, type: type });
      })
      .catch((err) => {
        const { type, message } = err;
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          toast.remove("rawcaster");
          toast.error("browser does not have permission to access microphone", {
            id: "rawcaster",
          });
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          toast.remove("rawcaster");
          toast.error("user didn't allow app to access microphone", {
            id: "rawcaster",
          });
        } else {
          toast.remove("rawcaster");
          toast.error(message, { id: "rawcaster" });
        }
      });
  };

  /**
   * Handles the action of allowing microphone permission.
   * Requests audio permissions and sets the 'isAudioModal' state to true if permission is granted.
   * Displays an error toast message if permission is denied.
   * @returns None
   */
  const handleAllowMicPermission = () => {
    requestAudioPermissions()
      .then(() => {
        setisAudioModal(true);
      })
      .catch((err) => {
        const { type, message } = err;
        if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
          toast.remove("rawcaster");
          toast.error("browser does not have permission to access microphone", {
            id: "rawcaster",
          });
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          toast.remove("rawcaster");
          toast.error("user didn't allow app to access microphone", {
            id: "rawcaster",
          });
        } else {
          toast.remove("rawcaster");
          toast.error(message, { id: "rawcaster" });
        }
      });
  };

  /**
   * useEffect hook that updates the share type based on the selected value in the values array.
   * @param {Array} values - The array of values to watch for changes.
   * @returns None
   */
  useEffect(() => {
    const findShareType = SHARED_TYPE.find(
      (ele) => ele.id === values.share_type
    );
    if (findShareType) {
      setShareType(findShareType.Value);
    }
  }, [values]);

  /**
   * Extracts link information from a given value.
   * @param {string} val - The value to extract link information from.
   * @returns None
   */

  const getLinkInfo = (val) => {
    if (val) {
      // let expression = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#]?[\w-]+)*\/?/gm;
      let expression =
        /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,6}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
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
        if (oldURL.current !== addHttp) {
          oldURL.current = addHttp;
          const userData = {
            token,
            url,
          };
          GeturlmetadataService(JSONtoformdata(userData))
            .then((res) => {
              if (res.data.status === 1) {
                setMetaData(res.data.data);
              }
            })
            .catch(() => {});

          // let message = { event: "getmetadata", url: addHttp };
          // handleSendMetadatamessage(message);
        }
      } else {
        setMetaData(null);
      }
    }
  };

  /**
   * Retrieves the length of the nugget text from the login user data.
   * If the login user data is available, it returns the value of the `nugget_content_length` property.
   * If the login user data is not available, it returns 0.
   * @returns The length of the nugget text.
   */
  const getNuggetTextLength = () => {
    if (loginUserData) {
      return loginUserData?.nugget_content_length;
    } else {
      return 0;
    }
  };

  /**
   * Handles the closing of the limit exceeds alert.
   * @returns None
   */
  const handleLimitExceedsClose = () => setLimitExceeds(false);

  const ComplementaryMemberShip = () => {
    let formData = new FormData();
    formData.append("token", token);
    complementaryMembershipService(formData)
      .then((res) => {
        if (res.data.status === 1) {
          HandleVerifyModal({
            primary: "success",
            onSuccess: () => {
              handleLimitExceedsClose();
              dispatch(
                handleLoginData({
                  ...loginUserData,
                  user_status: res.data.user_status,
                  user_status_id: res.data.user_status_id,
                  complementary_status: res.data.complementary_status ?? 0,
                })
              );
            },
            isCloseAvailable: false,
            SubmitButtonTitle: "Ok",
            message: res.data.msg,
          });
        } else {
          navigate("/membership");
        }
      })
      .catch((err) => {});
  };

  return (
    <Modal
      centered
      footer={null}
      open={visible}
      height={600}
      width={650}
      onCancel={() => {
        HandleClose();
      }}
    >
      <div className={classes.nuggetModal}>
        <h1>
          {isEdit ? "Update" : "Post"} {isPoll ? "Poll" : "Nugget"}
        </h1>

        <div className={classes.topProsec}>
          <img
            className={classes.imguser}
            src={loginUserData?.profile_image}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = defaultprofileImg;
            }}
          />
          <p className={classes.name}>{display_name}</p>
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
              <span className="material-icons">lock</span> {ShareType}{" "}
              <span className="material-icons">arrow_drop_down</span>
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
              className="material-symbols-outlined mx-2"
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
              multiple={!isEdit}
              accept="image/png, image/gif, image/jpeg"
              onClick={(event) => {
                event.target.value = null;
              }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length !== 0) {
                  const filterValidFiles = [
                    ...Array.from(e.target.files),
                  ].filter((fileInfo) =>
                    ["audio", "video", "image"].includes(
                      fileInfo.type.split("/")[0]
                    )
                  );
                  if (filterValidFiles.length !== 0) {
                    setFileValues(filterValidFiles);
                  } else {
                    messageApi.open({
                      type: "warning",
                      content: "Please Select Valid File",
                    });
                  }
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
              multiple={!isEdit}
              onClick={(event) => {
                event.target.value = null;
              }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length !== 0) {
                  const filterValidFiles = [
                    ...Array.from(e.target.files),
                  ].filter((fileInfo) =>
                    ["audio", "video", "image"].includes(
                      fileInfo.type.split("/")[0]
                    )
                  );
                  if (filterValidFiles.length !== 0) {
                    setFileValues(filterValidFiles);
                  } else {
                    messageApi.open({
                      type: "warning",
                      content: "Please Select Valid File",
                    });
                  }
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
                placeholder={`What's on your mind, ${display_name}!`}
                // onPaste={(event) => {
                //   const pastedText = event.clipboardData.getData("text/plain");
                //   if (
                //     values.content.concat(pastedText).length <=
                //     getNuggetTextLength()
                //   ) {
                //     getLinkInfo(pastedText);
                //   }
                // }}
                value={values.content}
                onChange={(e) => {
                  if (e.target.value.length <= getNuggetTextLength()) {
                    setFieldValue("content", e.target.value);
                    getLinkInfo(e.target.value);
                    setisPostContentValid(true);
                    setLimitExceeds(false);
                  } else {
                    setFieldValue(
                      "content",
                      e.target.value.slice(0, getNuggetTextLength())
                    );
                    getLinkInfo(e.target.value.slice(0, getNuggetTextLength()));
                    if (parseInt(loginUserData?.user_status_id) !== 4) {
                      setisPostContentValid(false);
                      setLimitExceeds(true);
                    }
                  }
                }}
              />
              {/* <LoginModal
                  open={LimitExceeds}
                 close={handleLimitExceedsClose}
                   AIclose={true}
                 AIopen="Upgrade"
                  AImessgae="You have reached your character limit, to increase the limit upgrade your membership!"
                 /> */}
              <img
                width="24px"
                alt="Add Emoji"
                className={classes.emojiIcon}
                src={emoji}
                style={{ cursor: "pointer" }}
                onClick={() => setShowEmojis(!showEmojis)}
              />
            </div>
            {!isPostContentValid && (
              <p className="ErrTxt">
                Post Content cannot be longer than {getNuggetTextLength() + " "}
                characters
              </p>
            )}
            <div
              style={{ paddingTop: "20px" }}
              className={classes.alertContainer}
              id="Alertdiv"
            >
              {LimitExceeds && loginUserData?.user_status_id !== 4 && (
                <Alert
                  message="Upgrade Your Plan"
                  description="You have reached your character limit, to increase the limit upgrade your membership!"
                  type="info"
                  style={{
                    alignItems:
                      loginUserData.complementary_status === 1
                        ? "flex-start"
                        : "center",
                  }}
                  action={
                    <Space direction="vertical">
                      <Button
                        size="small"
                        className={classes.upgradeBtn}
                        type="primary"
                        onClick={() => {
                          if (loginUserData.complementary_status === 1) {
                            ComplementaryMemberShip();
                          } else {
                            navigate("/membership");
                          }
                        }}
                      >
                        {loginUserData.complementary_status === 1
                          ? "Upgrade"
                          : "Ok"}
                      </Button>

                      {loginUserData.complementary_status === 1 && (
                        <Button
                          className={classes.LaterBtn}
                          onClick={handleLimitExceedsClose}
                          size="small"
                          danger
                          type="primary"
                        >
                          {"Cancel"}
                        </Button>
                      )}
                    </Space>
                  }
                />
              )}
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
                  <span className="material-icons">close</span>
                </div>
                <p className={classes.title}>
                  {MetaData[0].title ?? MetaData[0].url}
                </p>
                {MetaData[0].open_graph_image &&
                MetaData[0].open_graph_image !== "" ? (
                  <img
                    src={MetaData[0].open_graph_image}
                    alt="Meta Data"
                    width="100%"
                    height="200px"
                    style={{ objectFit: "cover" }}
                  ></img>
                ) : (
                  <div className={classes.domainName}>
                    {MetaData[0].source || ""}
                  </div>
                )}
                <p>{MetaData[0].description}</p>
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
                          setdeletedMedia((pre) => {
                            if (pre.length !== 0) {
                              return [ele.media_id];
                            } else {
                              return [...pre, ele.media_id];
                            }
                          });
                          setpreviewMedia((pre) =>
                            pre.filter((elem) => elem.media_id !== ele.media_id)
                          );
                        }}
                      >
                        {/* <img
                src={require("../../../assets/delete.png")}
                alt="more"
                style={{ width: "20px", height: "20px" }}
              /> */}
                        <span className="material-icons">delete</span>
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
                          <span className="material-icons">delete</span>
                        </div>
                      </div>
                      {getURL().media_type.includes("image") && (
                        <div
                          className={classes.editSec}
                          onClick={() => {
                            setNuggetImg({ ele: ele, index: index });
                          }}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
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
