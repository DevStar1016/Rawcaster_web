import { Button, Input, Modal, Tooltip } from "antd";
import React from "react";
import classes from "./Modal.module.css";
import mikeIcon from "../Assets/Images/svg/mikeicon.svg";

import pictureIcon from "../Assets/Images/png/photoIcon.png";
import imageIcon from "../Assets/Images/png/videoAttach.png";

const InfluencerSend = ({ open, close, user }) => {
  return (
    <Modal
      open={open}
      footer={null}
      onCancel={() => {
        close();
      }}
    >
      <div className={classes.influencerModal}>
        <h2>Send message to {user?.first_name}</h2>

        <div className={classes.topProsec}>
          <div className={classes.leftec}>
            <div className={classes.postTextcontent}>
              <Input.TextArea
                id="post_nugget_textarea"
                className={classes.postTextarea}
                placeholder={`What’s on your mind for ${user?.first_name} !`}
              />
            </div>
          </div>
          <div className={classes.rightSec}>
            <Tooltip title="Record Audio">
              <img src={mikeIcon} />
            </Tooltip>

            <Tooltip title="Upload Image">
              <img src={pictureIcon} />
            </Tooltip>

            <Tooltip title="Upload Video">
              <img src={imageIcon} />
            </Tooltip>
          </div>
        </div>

        <>
          <Button className={classes.btnstyle}>Send</Button>
        </>
      </div>
    </Modal>
  );
};

export default InfluencerSend;
