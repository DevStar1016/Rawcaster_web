import { Button, Input, Modal, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import classes from "./Modal.module.css";
import mikeIcon from "../Assets/Images/svg/mikeicon.svg";
import pictureIcon from "../Assets/Images/png/photoIcon.png";
import imageIcon from "../Assets/Images/png/videoAttach.png";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import ImageEditModal from "./ImageEditModal";
import {
  MediaPermissionsErrorType,
  requestAudioPermissions,
} from "mic-check/lib/requestMediaPermissions";
import AudioRecordModal from "./Nugget/AudioRecordModal";
import ChatDocument from "./Influencer/ChatDocument";
import { useAuthData, useDashboard } from "../Shared/Reduxfetcher";
import moment from "moment";
import { sendMessage } from "../Services/SocketService";

const validationSchema = yup.object().shape({
  message: yup.string().required(`Please input your Message!`),
});

const InfluencerSend = ({ open, close, user }) => {
  const userData = useAuthData();
  const { groupsList } = useDashboard();
  const VideoRef = useRef();
  const ImageRef = useRef();
  const [NuggetImg, setNuggetImg] = useState();
  const [isAudioModal, setisAudioModal] = useState(false);
  const [NuggetData, setNuggetData] = useState([]);
  const { values, handleChange, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema,
    onSubmit: (value) => {
      handleSendChatValue(value);
    },
  });

  /**
   * Handles the nugget files by updating the NuggetData state.
   * If an index is provided, it updates the file at that index with the given value.
   * If the index is undefined, it either adds a new file to the NuggetData state if it is empty,
   * or appends a new file to the existing NuggetData state.
   * @param {any} value - The value of the file to be added or updated.
   * @param {number | undefined} index - The index of the file to be updated. If undefined, a new file will be added.
   * @returns None
   */
  const handleNuggetFiles = (value, index) => {
    if (index !== undefined) {
      let tempData = [...NuggetData];
      tempData[index] = { file: value, file_path: null };
      setNuggetData(tempData);
    } else if (NuggetData === 0) {
      setNuggetData([{ file: value, file_path: null }]);
    } else {
      setNuggetData((pre) => [...pre, { file: value, file_path: null }]);
    }
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
          toast.error("browser does not have permission to access microphone");
        } else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
          toast.error("user didn't allow app to access microphone");
        } else {
          toast.error(message);
        }
      });
  };

  /**
   * Checks if a given type is valid based on the file types in NuggetData.
   * @param {string} type - The type to check for validity.
   * @returns {boolean} - True if the type is valid, false otherwise.
   */
  const checkValidType = (type) => {
    let findData = NuggetData.find((ele) => ele.file.type.includes(type));
    if (findData || NuggetData.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Returns the corresponding media type code for the given media type.
   * @param {string | number} type - The media type to get the code for.
   * @returns {string | number} - The media type code.
   */
  const getMediaType = (type) => {
    switch (type) {
      case "image":
        return 2;
      case 2:
        return "image";
      case "video":
        return 4;
      case 4:
        return "video";
      case "audio":
        return 3;
      case 3:
        return "audio";
      default:
        return 0;
    }
  };

  /**
   * Retrieves the "My Fans" group from the list of groups.
   * @returns {object | string} - The "My Fans" group object if found, otherwise an empty string.
   */
  const getFansGroup = () => {
    let myfansGroup = groupsList.find((ele) => ele.group_name === "My Fans");
    if (myfansGroup) {
      return myfansGroup;
    } else {
      return "";
    }
  };

  /**
   * Generates the post data object for an event message in a group chat.
   * @param {string} type - The type of the message (e.g. text, image, video).
   * @param {string} textMessage - The text content of the message.
   * @param {string | null} [mediaPath=null] - The path to the media file associated with the message.
   * @returns {object} - The post data object.
   */
  const getEventPostData = (type, textMessage, mediaPath = null) => {
    const uniqueId =
      userData.user_id +
      "" +
      getFansGroup().group_id +
      "" +
      moment.utc().format("x") +
      "" +
      Math.floor(Math.random() * 10000 + 1);
    return {
      event: "groupchatmessage",
      type: getMediaType(type),
      message: textMessage ? textMessage.trim() : "",
      groupId: parseInt(getFansGroup().group_id),
      senderId: userData.user_id,
      senderName: userData.name, // data.display_name,
      userImage: userData.profile_image, //data.profile_img,
      parentMsgId: null,
      sentType: 1,
      file_upload_status: mediaPath ? 2 : 1,
      file_download_status: 1,
      uniqueId: uniqueId.toString(),
      is_edited: 0,
      is_read: 0,
      msg_from: 1,
      group_name: getFansGroup().group_name,
      media_path: mediaPath,
      sent_datetime: moment.utc().format("YYYY-MM-DD HH:mm:ss"),
      thumbnail: null,
      duration: null,
      isContainLink: false,
      linkpreviewdata: null,
    };
  };

  /**
   * Handles sending a chat value to the server.
   * @param {any} value - The value to send as a chat message.
   * @returns None
   */
  const handleSendChatValue = (value) => {
    if (NuggetData && NuggetData.length !== 0) {
      for (let index = 0; index < NuggetData.length; index++) {
        const element = NuggetData[index];
        let type = element.file.type.split("/");
        let socketMes = {
          ...getEventPostData(
            type[0],
            value.message !== "" ? value.message : null,
            element.file_path
          ),
          message: value.message ?? "",
          is_read: 0,
          media_path: null,
          file_upload_status: 1,
          file_download_status: 2,
        };
        sendMessage(socketMes, "groupchatting");
      }
    } else if (value.message !== "") {
      let socketMes = {
        ...getEventPostData(1, value.message, null),
        message: value.message ?? "",
        is_read: 0,
        media_path: null,
        file_upload_status: 1,
        file_download_status: 0,
      };

      sendMessage(socketMes, "groupchatting");
    }
    close();
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={() => {
        close();
      }}
    >
      <div className={classes.influencerModal}>
        <h2>Send message to Fans</h2>

        <div className={classes.topProsec}>
          <div className={classes.leftec}>
            <div className={classes.postTextcontent}>
              <Input.TextArea
                id="post_nugget_textarea"
                className={classes.postTextarea}
                placeholder={`What’s on your mind for Fans !`}
                value={values.message}
                onChange={handleChange("message")}
              />
              {touched.message && <p className="ErrTxt">{errors?.message}</p>}
            </div>
          </div>
          <div className={classes.rightSec}>
            {checkValidType("audio") ? (
              <Tooltip title="Record Audio">
                <img
                  src={mikeIcon}
                  alt={"Record Audio"}
                  style={{
                    opacity: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleAllowMicPermission();
                  }}
                />
              </Tooltip>
            ) : (
              <img
                src={mikeIcon}
                alt={"Record Audio"}
                style={{
                  opacity: 0.6,
                  cursor: "",
                }}
              />
            )}

            {checkValidType("image") ? (
              <Tooltip title="Upload Image">
                <img
                  src={pictureIcon}
                  alt={"Upload Image"}
                  style={{
                    opacity: 1,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (ImageRef.current) {
                      ImageRef.current.click();
                    }
                  }}
                />
                <input
                  ref={ImageRef}
                  type="file"
                  name="file"
                  multiple
                  id="post_nugget_image"
                  accept="image/png, image/gif, image/jpeg"
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length !== 0) {
                      const files = e.target.files;
                      for (let index = 0; index < files.length; index++) {
                        const elem = files[index];
                        handleNuggetFiles(elem);
                      }
                    }
                  }}
                  style={{ display: "none" }}
                />
              </Tooltip>
            ) : (
              <img
                src={pictureIcon}
                alt={"Upload Image"}
                style={{
                  opacity: 0.6,
                  cursor: "",
                }}
              />
            )}

            {checkValidType("video") ? (
              <Tooltip title="Upload Video">
                <img
                  src={imageIcon}
                  alt={"Upload Video"}
                  onClick={() => {
                    if (VideoRef.current) {
                      VideoRef.current.click();
                    }
                  }}
                />
                <input
                  ref={VideoRef}
                  type="file"
                  name="file"
                  multiple
                  id="post_nugget_video"
                  accept="video/mp4"
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length !== 0) {
                      const files = e.target.files;
                      for (let index = 0; index < files.length; index++) {
                        const elem = files[index];
                        handleNuggetFiles(elem);
                      }
                    }
                  }}
                  style={{ display: "none" }}
                />
              </Tooltip>
            ) : (
              <img
                src={imageIcon}
                alt={"Upload Video"}
                style={{
                  opacity: 0.6,
                  cursor: "",
                }}
              />
            )}
          </div>
        </div>
        {NuggetData && NuggetData.length !== 0 && (
          <div className={classes.attachementtDisplay}>
            {NuggetData?.map((ele, index) => {
              return (
                <ChatDocument
                  ele={ele.file}
                  index={index}
                  setNuggetData={setNuggetData}
                  setNuggetImg={setNuggetImg}
                  // onUpload={(val) => {
                  //   let tempData = [...NuggetData];
                  //   tempData[index] = val;
                  //
                  // }}
                />
              );
            })}
          </div>
        )}
        <>
          <Button
            disabled={values.message === "" && NuggetData.length === 0}
            className={classes.btnstyle}
            onClickCapture={() => {
              handleSubmit();
            }}
          >
            Send
          </Button>
        </>
      </div>
      <AudioRecordModal
        visible={isAudioModal}
        onSuccess={(file) => {
          handleNuggetFiles(file);
        }}
        onClose={() => {
          setisAudioModal(false);
        }}
      />
      {NuggetImg && (
        <ImageEditModal
          open={NuggetImg}
          initialFile={NuggetImg.ele}
          onSuccess={(url) => {
            var file = new File([url.Blob], "edited_img.jpeg", {
              type: url.Blob.type,
            });
            handleNuggetFiles(file, NuggetImg.index);
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

export default InfluencerSend;
