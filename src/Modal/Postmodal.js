import { Button, Dropdown, Modal } from "antd";
import React, { useContext, useState } from "react";
import classes from "./Modal.module.css";
import sampleuser from "../Assets/Images/svg/userImg.svg";
import pollIcon from "../Assets/Images/svg/pollIcon.svg";
import mikeIcon from "../Assets/Images/svg/mikeicon.svg";
import videoIcon from "../Assets/Images/svg/videoIcon.png";
import cameraIcon from "../Assets/Images/svg/cameraicon.svg";
import pictureIcon from "../Assets/Images/png/photoIcon.png";
import imageIcon from "../Assets/Images/png/videoAttach.png";
import TextArea from "antd/es/input/TextArea";
import CameraModal from "./CameraModal";
import { PostNuggetContext } from "../Shared/Context";
import { SHARED_TYPE } from "../Shared/Constant";

const Postmodal = ({ visible, onClose }) => {
  const {
    getPostValues,
    setFileValues,
    setNuggetValues,
    getUserData,
    setFieldValue,
    handleSubmit,
    values,
    handleChange,
  } = useContext(PostNuggetContext);
  const loginUserData = getUserData();
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
    } else {
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
    }
  };
  return (
    <Modal
      footer={null}
      open={visible}
      width={"650px"}
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
              {ShareType} <span class="material-icons">arrow_drop_down</span>
            </p>
          </Dropdown>
          <div className={classes.rightSec}>
            <img src={pollIcon} />
            <img src={mikeIcon} />
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
                document.getElementById("nugget_image").click();
              }}
            />

            <input
              type="file"
              name="file"
              id="nugget_image"
              onChange={(e) => {
                setFileValues(e.target.files[0]);
              }}
              style={{ display: "none" }}
            />
            <img
              src={imageIcon}
              onClick={() => {
                document.getElementById("nugget_video").click();
              }}
            />
            <input
              type="file"
              name="file"
              id="nugget_video"
              onChange={(e) => {
                setFileValues(e.target.files[0]);
              }}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <TextArea
          placeholder={`What's on your mind, ${loginUserData?.name}!`}
          value={values.content}
          onChange={handleChange("content")}
        />
        <div className="d-flex flex-row pt-3">
          {getPostValues().map((ele, index) => {
            return (
              <div className="card--content">
                {imageOrVideoSingle(ele)}
                <div
                  className="middle"
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
                  <span style={{ color: "#fff" }}>Delete</span>
                </div>
              </div>
            );
          })}
        </div>
        <Button
          className={classes.btnstyle}
          onClick={() => {
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
    </Modal>
  );
};

export default Postmodal;
