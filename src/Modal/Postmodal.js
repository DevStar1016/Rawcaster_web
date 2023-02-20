import { Button, Modal } from "antd";
import React from "react";
import classes from "./Modal.module.css";
import sampleuser from "../Assets/Images/svg/userImg.svg";
import pollIcon from "../Assets/Images/svg/pollIcon.svg";
import mikeIcon from "../Assets/Images/svg/mikeicon.svg";
import videoIcon from "../Assets/Images/svg/videoIcon.png";
import cameraIcon from "../Assets/Images/svg/cameraicon.svg";
import pictureIcon from "../Assets/Images/png/photoIcon.png";
import imageIcon from "../Assets/Images/png/videoAttach.png";
import TextArea from "antd/es/input/TextArea";

const Postmodal = ({ visible, onClose }) => {
  return (
    <Modal
      footer={null}
      open={visible}
      width={"650px"}
      onCancel={() => {
        onClose();
      }}
    >
      <div className={classes.nuggetModal}
        onClick={() => {
          onClose();
        }}
      >
      <h1>Post Nugget</h1>
      
      <div className={classes.topProsec}>
        <img className={classes.imguser} src={sampleuser} />
        <p className={classes.name}>Daiyan Khan</p>
        <p className={classes.onlymeBtn}><span class="material-icons">lock</span> Only me <span class="material-icons">arrow_drop_down</span></p>
        <div className={classes.rightSec}>
          <img src={pollIcon} />
          <img src={mikeIcon} />
          <img src={videoIcon} />
          <img src={cameraIcon} />
          <img src={pictureIcon} />
          <img src={imageIcon} />
        </div>
      </div>
      <TextArea placeholder="What's on your mind, Daniyal!" />
      <Button className={classes.btnstyle}>Post Nugget</Button>
        
      </div>
    </Modal>
  );
};

export default Postmodal;
