import { useEffect, useRef, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import {
  useAuthData,
  useAuthToken,
  useFriends,
} from "../../Shared/Reduxfetcher";
import { useReactMediaRecorder } from "react-media-recorder";
import {
  MediaPermissionsErrorType,
  requestAudioPermissions,
  requestVideoPermissions,
} from "mic-check/lib/requestMediaPermissions";
import { toast } from "react-hot-toast";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import classes from "./Chat.module.css";
import moment from "moment";
import ChatIcon from "../../Assets/Icons/svg/chat_icon.svg";
import ChatProfile from "../../Assets/Icons/svg/chat_r_logo.svg";
import {
  BlobUrlToFile,
  JSONtoformdata,
  Timer,
  formatBytes,
  handleCopyText,
} from "../../Shared/Utility";
import ChatAudioplayer from "../AudioPlayer/ChatAudioplayer";
import CameraModal from "../../Modal/Nugget/CameraModal";
import { Dropdown, Image, Tooltip, message } from "antd";
import { useChatContext } from "../../Shared/Context";
import EmojiPicker from "../../UIComponents/EmojiPicker";
import { defaultprofileImg } from "../../Shared/CommonConstants";
import { uploadChatAttachmentService } from "../../Services/ApiService";

export const ChatInput = ({
  value = "",
  onInput,
  isSendLoading = false,
  HandleSendMessage,
  onAudioResult,
  disabled,
  fileuploadEnabled = false,
  cameraenabled = false,
  isSendOnly = false,
  onSendResponse,
  onFileResult,
  onCameraResult,
  isEdit = false,
  onEditClose,
  onEdit,
}) => {
  const token = useAuthToken();
  const { seconds, minutes, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [isFloatingOpen, setisFloatingOpen] = useState(false);
  const [isFetchingUrl, setisFetchingUrl] = useState(false);
  const textareaRef = useRef(null);
  const [isEmoji, setisEmoji] = useState(false);
  const fileRef = useRef(null);
  const ImagefileRef = useRef();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCamera, setisCamera] = useState({ show: false, type: "" });
  const [IsRecording, setIsRecording] = useState(false);
  const [AudioElement, setAudioElement] = useState();
  const timerRef = useRef(null);
  const recordingRef = useRef(null);
  const [ChatMessage, setChatMessage] = useState("");
  const loginUserData = useAuthData();
  const isSend = useRef(null);
  const [isChatContentValid, setisChatContentValid] = useState(true);
  const onRecordStart = () => {
    setIsRecording(true);
    reset();
    timerRef.current = new Timer(function () {
      if (recordingRef.current === "recording") {
        isSend.current = false;
        stopRecording();
      }
    }, 120000);
  };

  useEffect(() => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [ChatMessage]);

  useEffect(() => {
    if (value && value !== "") {
      setChatMessage(value);
    }
  }, [value]);

  const onRecordStop = (url, blob) => {
    if (isSend.current) {
      const file = new File([blob], "blobtofile.mp3", {
        type: blob.type,
      });
      fetchAudioUrl(file);
    } else {
      const audio = new Audio(url);

      setAudioElement(audio);
      audio.play();
    }
  };

  const handleClose = () => {
    pause();
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.stop();
      })
      .catch((error) => {});
  };

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      stopStreamsOnStop: true,

      onStart: onRecordStart,
      onStop: onRecordStop,
    });

  const handleAllowMicPermission = () => {
    requestAudioPermissions()
      .then(() => {
        if (status === "idle" || status === "stopped") {
          startRecording();
        } else {
          stopRecording();
        }
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

  const handleCameraPermission = (type) => {
    requestVideoPermissions()
      .then(() => {
        console.log("isCamera");
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

  useEffect(() => {
    recordingRef.current = status;
  }, [status]);

  const getNuggetTextLength = () => {
    if (loginUserData) {
      return loginUserData?.nugget_content_length;
    } else {
      return 0;
    }
  };

  const getValidNumber = (num) => {
    return num.toString().length == 1
      ? num.toString().padStart(2, "0")
      : num.toString();
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
  }

  const fetchAudioUrl = (file) => {
    const formData = {
      token,
      chatattachment: file,
    };
    uploadChatAttachmentService(JSONtoformdata(formData))
      .then((res) => {
        onAudioResult({
          user: 1,
          type: "audio",
          message: res.data.filepath,
          created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
          read_out_url: null,
        });
      })
      .finally(() => {
        setisFetchingUrl(false);
        setIsRecording(false);
      });
  };
  return (
    <>
      {!isChatContentValid && (
        <p className="ErrTxt mx-auto text-center mb-1">
          Message Content cannot be longer than {getNuggetTextLength() + " "}
          characters
        </p>
      )}
      {isEdit && (
        <div className={classes.editContainer}>
          <span>{value}</span>
          <i
            class="material-symbols-outlined"
            onClick={() => {
              setChatMessage("");
              onEditClose();
            }}
          >
            cancel
          </i>
        </div>
      )}
      {!IsRecording ? (
        <div className="d-flex flex-row">
          <div className={classes.whatsapp_textarea_wrapper}>
            <i
              className={`material-symbols-outlined ${classes.emojiIcon}`}
              onClick={() => {
                setisEmoji(!isEmoji);
              }}
            >
              mood
            </i>
            <textarea
              ref={textareaRef}
              className={classes.whatsapp_textarea}
              placeholder="Type a message..."
              value={ChatMessage}
              rows="1"
              // onKeyDown={(e) => {
              //   if (e.key === "Enter" && !disabled) {
              //     HandleSendMessage(ChatMessage);
              //     setChatMessage("");
              //   }
              // }}
              onChange={(e) => {
                textareaRef.current.style.height = "auto";
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                if (onInput) {
                  onInput(e.target.value);
                }
                if (e.target.value.length <= getNuggetTextLength()) {
                  setChatMessage(e.target.value);
                  setisChatContentValid(true);
                } else {
                  setChatMessage(
                    e.target.value.slice(0, getNuggetTextLength())
                  );

                  setisChatContentValid(false);
                }
              }}
            />
            {!isSendOnly &&
              fileuploadEnabled &&
              !isEdit &&
              ChatMessage === "" && (
                <>
                  <i
                    className={classes.upload_icon}
                    onClick={() => {
                      fileRef?.current.click();
                    }}
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    name="file"
                    id="chat_file"
                    onClick={(event) => {
                      event.target.value = null;
                    }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length !== 0) {
                        if (onFileResult) {
                          onFileResult(e.target.files[0]);
                        }
                      }
                    }}
                    style={{ display: "none" }}
                  />
                </>
              )}
            {!isSendOnly && cameraenabled && !isEdit && ChatMessage === "" && (
              <>
                <i
                  className={classes.camera_icon}
                  onClick={() => {
                    setisFloatingOpen(!isFloatingOpen);
                    // handleCameraPermission("Camera");
                  }}
                />
                {isFloatingOpen && (
                  <div className={classes.floating_menu_options}>
                    <Tooltip placement="left" title={"Capture Image"}>
                      <button
                        className={classes.floating_menu_option}
                        onClick={() => {
                          handleCameraPermission("Camera");
                        }}
                      >
                        <span class="material-symbols-outlined">camera</span>
                      </button>
                    </Tooltip>

                    <Tooltip placement="left" title={"Record Video"}>
                      <button
                        className={classes.floating_menu_option}
                        onClick={() => {
                          handleCameraPermission("Video");
                        }}
                      >
                        <span class="material-symbols-outlined">videocam</span>
                      </button>
                    </Tooltip>
                    <Tooltip placement="left" title={"Upload Image or Video"}>
                      <button
                        className={classes.floating_menu_option}
                        onClick={() => {
                          ImagefileRef.current.click();
                        }}
                      >
                        <span class="material-symbols-outlined">
                          attach_file
                        </span>
                      </button>
                      <input
                        ref={ImagefileRef}
                        type="file"
                        name="file"
                        accept="image/*,video/*"
                        onClick={(event) => {
                          event.target.value = null;
                        }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length !== 0) {
                            const filterValidFiles = [
                              ...Array.from(e.target.files),
                            ].filter((fileInfo) =>
                              ["video", "image"].includes(
                                fileInfo.type.split("/")[0]
                              )
                            );
                            if (filterValidFiles.length !== 0) {
                              onCameraResult(filterValidFiles[0]);
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
                    </Tooltip>
                  </div>
                )}
              </>
            )}
            {isEdit ? (
              <div
                className={classes.searchIcon}
                onClick={() => {
                  setisEmoji(false);
                  if (!disabled) {
                    onEdit(ChatMessage);
                    setChatMessage("");
                  }
                }}
              >
                <span
                  className={`material-symbols-outlined ${classes.SendIcon}`}
                >
                  done
                </span>
              </div>
            ) : ChatMessage === "" && !isSendOnly ? (
              <div className={classes.searchIcon}>
                <i
                  className={classes.mic_icon}
                  onClick={() => {
                    handleAllowMicPermission();
                  }}
                />
              </div>
            ) : (
              <>
                {isFetchingUrl || isSendLoading ? (
                  <div className={classes.searchIcon}>
                    <Spinner
                      animation="border"
                      role="status"
                      className={classes.loader}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div
                    className={classes.searchIcon}
                    onClick={() => {
                      setisEmoji(false);
                      if (isSendOnly) {
                        if (onSendResponse) {
                          onSendResponse(ChatMessage);
                        }
                        setChatMessage("");
                      } else if (!disabled) {
                        if (ChatMessage && ChatMessage.trim() !== "") {
                          HandleSendMessage(ChatMessage);
                          setChatMessage("");
                        }
                      }
                    }}
                  >
                    <span
                      className={`material-symbols-outlined ${classes.SendIcon}`}
                    >
                      send
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
          {/* {!isSendOnly && !isEdit && (
            <i
              className={classes.mic_icon}
              onClick={() => {
                handleAllowMicPermission();
              }}
            />
          )} */}
        </div>
      ) : (
        <div className={classes.recordingBox}>
          <div className={classes.RecordingTimeSec}>
            {AudioElement ? (
              <>{AudioElement ? formatTime(AudioElement.currentTime) : null}</>
            ) : (
              <>{getValidNumber(minutes) + `:` + getValidNumber(seconds)}</>
            )}
          </div>
          <div className={classes.ActionSec}>
            {AudioElement ? (
              <>
                {AudioElement && AudioElement?.paused ? (
                  <span
                    class="material-symbols-rounded"
                    onClick={() => {
                      AudioElement.play();
                    }}
                  >
                    play_circle
                  </span>
                ) : (
                  <span
                    class="material-symbols-rounded"
                    onClick={() => {
                      AudioElement.pause();
                    }}
                  >
                    pause_circle
                  </span>
                )}
              </>
            ) : (
              <span
                class="material-symbols-rounded"
                onClick={() => {
                  isSend.current = false;
                  stopRecording();
                }}
              >
                stop_circle
              </span>
            )}
            <span
              class={`material-symbols-outlined ${classes.closeIcon}`}
              onClick={() => {
                handleClose();
                clearBlobUrl();
              }}
            >
              delete
            </span>
            {isFetchingUrl || isSendLoading ? (
              <div className={classes.searchIcon}>
                <Spinner
                  animation="border"
                  role="status"
                  className={classes.loader}
                >
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <InputGroup.Text
                className={classes.searchIcon}
                onClick={() => {
                  if (!isFetchingUrl && !isSendLoading) {
                    setisFetchingUrl(true);
                    if (mediaBlobUrl) {
                      BlobUrlToFile(mediaBlobUrl, "blobtofile.mp3").then(
                        (res) => {
                          fetchAudioUrl(res);
                        }
                      );
                    } else {
                      isSend.current = true;
                      stopRecording();
                    }

                    setAudioElement(null);
                    clearBlobUrl();
                    handleClose();
                  }
                }}
              >
                <span
                  className={`material-symbols-outlined ${classes.SendIcon}`}
                >
                  send
                </span>
              </InputGroup.Text>
            )}
          </div>
        </div>
      )}
      {isEmoji ? (
        <div className={classes.emojiContainer}>
          <EmojiPicker
            emojiButtonColors={["#364157"]}
            emojiButtonRadius="8px"
            skinTonePosition="none"
            previewPosition="none"
            //   onClickOutside={() => {
            //     setisEmoji(!isEmoji);
            //   }}
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
              setChatMessage((pre) => pre.concat(e.native));
            }}
          />
        </div>
      ) : null}
      {isCamera.show && (
        <CameraModal
          visible={isCamera.show}
          videoRef={videoRef}
          canvasRef={canvasRef}
          type={isCamera.type}
          onSuccess={(value) => {
            if (onCameraResult) {
              onCameraResult(value);
            }
          }}
          isPreviewEnabled={false}
          onClose={() => {
            setisCamera({ show: false, type: "" });
          }}
        />
      )}
    </>
  );
};

export const MessageContent = (props) => {
  const { Messages, setEditData } = useChatContext();
  const {
    message = null,
    user,
    index,
    type,
    file_path = null,
    file,
    isGroup,
    message_id,
    isEdited,
    onDelete,
  } = props;
  const friends_list = useFriends();
  const loginUserData = useAuthData();

  const [isAvatarErr, setisAvatarErr] = useState(false);

  const isUser = (id) => {
    if (id === loginUserData?.chime_user_id) {
      return true;
    }
    return false;
  };

  const getUserData = () => {
    if (user === loginUserData?.chime_user_id) {
      return {
        profile_img: null,
        display_name: null,
      };
    } else {
      const friendData = friends_list.find((ele) => ele.chime_user_id === user);
      if (friendData) {
        return {
          profile_img: friendData?.profile_img,
          display_name: friendData?.display_name,
        };
      } else {
        return {
          profile_img: defaultprofileImg,
          display_name: "Rawcaster User",
        };
      }
    }
  };

  const getmessageType = () => {
    if (!Messages[index - 1] || Messages[index - 1]?.user !== user) {
      return "first";
    } else if (
      Messages[index - 1] &&
      Messages[index - 1]?.user === user &&
      Messages[index + 1] &&
      Messages[index + 1]?.user === user
    ) {
      return "middle";
    } else if (!Messages[index + 1] || Messages[index + 1]?.user !== user) {
      return "end";
    }
  };

  const GetValidComponent = () => {
    console.log(type);
    switch (true) {
      case type.includes("image"):
        return (
          <Image
            className={`${classes.chatimg}  ${message ? "mb-0" : ""} ${
              isUser(user) ? "" : "mt-0"
            }`}
            preview={{
              mask: false,
            }}
            src={file_path}
          />
        );
      case type.includes("video"):
        return (
          <video
            controls
            className={`${classes.chatimg} ${message ? "mb-0" : ""} ${
              isUser(user) ? "" : "mt-0"
            }`}
          >
            <source src={file_path} />
          </video>
        );
      case type.includes("audio"):
        return (
          <div className={classes.audioSec}>
            <div className={classes.audioplayer}>
              <ChatAudioplayer
                textColor={isUser(user) ? "#FFFFFF" : "#000000"}
                url={file_path}
                time={moment(props.created_at, "YYYY-MM-DD HH:mm:ss").format(
                  "hh:mm A"
                )}
              />
            </div>
            <div className={classes.avatar}>
              <img
                src={isUser(user) ? loginUserData?.profile_image : ChatProfile}
              />
            </div>
          </div>
        );

      default:
        if (file && Object.keys(file).length !== 0) {
          const validcontent = file.type.split("/")[1];
          return (
            <div
              className={classes.fileSec}
              style={{
                marginTop: isUser(user) ? 1 : 0,
              }}
            >
              <div
                className={classes.filContainer}
                onClick={() => {
                  window.open(file_path, "_self");
                }}
                style={{
                  background: isUser(user) ? "#FFFFFF" : "#563662",
                }}
              >
                <i
                  className={classes.file_icon}
                  style={{
                    background: isUser(user) ? "#563662" : "#FFFFFF",
                  }}
                />
              </div>
              <div className={classes.textSec}>
                <h6>{file.name}</h6>
                <p>
                  {validcontent.toUpperCase()} - {formatBytes(file.size)}
                </p>
              </div>
            </div>
          );
        }
        return null;
    }
  };

  const getBorderType = () => {
    if (getmessageType() === "first") {
      if (isUser(user)) {
        return "br_top_right";
      } else {
        return "br_top_left";
      }
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => {
            handleCopyText(message);
          }}
        >
          Copy
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => {
            setEditData({ msg: message, message_id: message_id });
          }}
        >
          Edit
        </div>
      ),
    },
    {
      key: "3",
      label: <div onClick={onDelete}>Forward</div>,
    },
    {
      key: "4",
      label: <div onClick={onDelete}>Select</div>,
    },
    {
      key: "5",
      label: <div onClick={onDelete}>Delete</div>,
    },
  ];

  return (
    <div
      className={`${
        isUser(user) ? classes.MessageContainer : classes.receiverConteiner
      } ${isUser(user) ? "br_top_right" : "br_top_left"}`}
    >
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        arrow
        trigger={["contextMenu"]}
      >
        <div className={classes.msgBox}>
          {isGroup && (
            <div className={classes.avatar}>
              {getmessageType() !== "first" ? (
                <div
                  style={{
                    height: 30,
                    width: 30,
                  }}
                ></div>
              ) : (
                <img
                  src={
                    isUser(user)
                      ? loginUserData?.profile_image
                      : getUserData().profile_img
                  }
                  onError={(e) => {
                    setisAvatarErr(true);
                  }}
                />
              )}
            </div>
          )}
          <div
            key={index}
            className={`${classes.chatbox_message} ${
              isUser(user) ? classes.user_chatbox_message : ""
            } ${getBorderType()}`}
          >
            <div className={classes.content}>
              {!isUser(user) && isGroup && getUserData().display_name && (
                <p className={classes.userNameSec}>
                  {getUserData().display_name}
                </p>
              )}
              <GetValidComponent />

              {message && message.trim() !== "null" && (
                <p
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {message}
                </p>
              )}
              {props.created_at && type !== "audio" && (
                <span className={classes.timestamp}>
                  {isEdited ? `edited - ` : ""}
                  {moment(props.created_at, "YYYY-MM-DD HH:mm:ss").format(
                    "hh:mm A"
                  )}
                </span>
              )}
            </div>
          </div>
          {isUser(user) && (
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              arrow
              trigger={["click"]}
            >
              <span
                className={`material-symbols-outlined ${classes.moreIcon}`}
                style={{
                  color: "black",
                }}
              >
                more_vert
              </span>
            </Dropdown>
          )}
        </div>
      </Dropdown>
    </div>
  );
};

export const ChatInputBox = () => {
  const [isEmoji, setisEmoji] = useState(false);
  const textareaRef = useRef(null);
  const handleChange = () => {
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  return (
    <div className={classes.whatsapp_textarea_wrapper}>
      <i
        className={`material-symbols-outlined ${classes.emojiIcon}`}
        onClick={() => {
          setisEmoji(!isEmoji);
        }}
      >
        mood
      </i>
      <textarea
        ref={textareaRef}
        className={classes.whatsapp_textarea}
        placeholder="Type a message..."
        // value={message}
        rows="1"
        onChange={handleChange}
      />
      <div className={classes.searchIcon}>
        <img src={ChatIcon} />
      </div>
    </div>
  );
};
