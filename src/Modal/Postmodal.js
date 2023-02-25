import { Button, Dropdown, Modal } from "antd";
import React, { useContext, useState } from "react";
import classes from "./Modal.module.css";
import pollIcon from "../Assets/Images/svg/pollIcon.svg";
import mikeIcon from "../Assets/Images/svg/mikeicon.svg";
import videoIcon from "../Assets/Images/svg/videoIcon.png";
import cameraIcon from "../Assets/Images/svg/cameraicon.svg";
import pictureIcon from "../Assets/Images/png/photoIcon.png";
import imageIcon from "../Assets/Images/png/videoAttach.png";
import emoji from "../Assets/Images/svg/emoji.svg";
import TextArea from "antd/es/input/TextArea";
import CameraModal from "./CameraModal";
import { PostNuggetContext } from "../Shared/Context";
import { SHARED_TYPE } from "../Shared/Constant";
import AudioRecordModal from "./AudioRecordModal";
import EmojiPicker from "emoji-picker-react";

const Postmodal = ({ visible, onClose }) => {
  const {
    getPostValues,
    setFileValues,
    setNuggetValues,
    useAuthData,
    setFieldValue,
    handleSubmit,
    values,
    handleChange,
  } = useContext(PostNuggetContext);
  const [isAudioModal, setisAudioModal] = useState(false);
  const loginUserData = useAuthData();
  const [showEmojis, setShowEmojis] = useState(false);
  const [isCamera, setisCamera] = useState({ show: false, type: "" });
  const [ShareType, setShareType] = useState("Public");
  const imageOrVideoSingle = (data) => {
    if (data.type.includes("image")) {
      return (
        <img
          className="selecedImages"
          src={URL.createObjectURL(data)}
          alt=""
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
        />
      );
    } else if (data.type.includes("video")) {
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
            <source src={URL.createObjectURL(data)} />
          </video>
          <span class={`material-symbols-outlined ${classes.thumbPlayBtn}`}>
            play_circle
          </span>
        </>
      );
    } else if (data.type.includes("audio")) {
      return (
        <>
          <div className={classes.musicIcon}>
            <span class="material-symbols-outlined">music_note</span>
          </div>
        </>
      );
    }
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
        <h1>Post Nugget</h1>

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
            <img src={pollIcon} />
            <img
              src={mikeIcon}
              onClick={() => {
                setisAudioModal(true);
              }}
            />
            <img
              src={videoIcon}
              onClick={() => {
                setisCamera({ show: true, type: "Video" });
              }}
            />
            <img
              src={cameraIcon}
              onClick={() => {
                setisCamera({ show: true, type: "Camera" });
              }}
            />
            <img
              src={pictureIcon}
              onClick={() => {
                document.getElementById("post_nugget_image").click();
              }}
            />

            <input
              type="file"
              name="file"
              id="post_nugget_image"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => {
                console.log(e.target.files);
                if (e.target.files && e.target.files.length !== 0) {
                  setFileValues(e.target.files[0]);
                }
              }}
              style={{ display: "none" }}
            />
            <img
              src={imageIcon}
              onClick={() => {
                document.getElementById("post_nugget_video").click();
              }}
            />
            <input
              type="file"
              name="file"
              id="post_nugget_video"
              accept="video/mp4"
              onChange={(e) => {
                if (e.target.files && e.target.files.length !== 0) {
                  setFileValues(e.target.files[0]);
                }
              }}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className={classes.postTextcontent}>
          <TextArea
            className={classes.postTextarea}
            placeholder={`What's on your mind, ${loginUserData?.name}!`}
            value={values.content}
            onChange={handleChange("content")}
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
          <div
            className={classes.emojiPart}
            style={{
              position: "absolute",
              top: "190px",
              right: "50px",
              zIndex: 11,
            }}
          >
            <EmojiPicker
              searchDisabled
              suggestedEmojisMode="frequent"
              previewConfig={{
                showPreview: false,
              }}
              onEmojiClick={(e) => {
                setFieldValue("content", values.content.concat(e.emoji));
              }}
            />
          </div>
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
        {getPostValues().length !== 0 && (
          <div className={classes.attachementtDisplay}>
            {getPostValues().map((ele, index) => {
              return (
                <div className={classes.cardcontent}>
                  {imageOrVideoSingle(ele)}
                  <div
                    className={classes.overlay}
                    onClick={() => {
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
            onClose();
          }}
        >
          Post Nugget
        </Button>
      </div>
      <CameraModal
        visible={isCamera.show}
        type={isCamera.type}
        onSuccess={(value) => {
          setFileValues(value);

          setisCamera({ show: false, type: "" });
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
