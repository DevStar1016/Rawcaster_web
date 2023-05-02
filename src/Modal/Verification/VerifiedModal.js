import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import classes from "./VerifiedModal.module.css";
import Confetti from "react-dom-confetti";

const VerifiedModal = ({ open, onClose, onSuccess }) => {
  const [showConfetti, setshowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setshowConfetti(true);
      }, 3000);
    }
  }, []);

  const config = {
    angle: "90",
    spread: "150",
    startVelocity: "40",
    elementCount: "120",
    dragFriction: "0.09",
    duration: "4010",
    stagger: "8",
    width: "9px",
    height: "8px",
    perspective: "1000px",
    colors: [
      "#faa21b",
      "#53284f",
      "#a864fd",
      "#29cdff",
      "#78ff44",
      "#ff718d",
      "#fdff6a",
    ],
  };

  return (
    <Modal
      open={open}
      onCancel={() => {
        onClose();
      }}
      closable={false}
      footer={null}
    >
      <div className={classes.profileModal}>
        <img
          height="38px"
          src={require("../../Assets/Images/png/rawcater_logo.png")}
        />
        <p>Congratulations! your account validation is completed</p>
        <div style={{ marginLeft: "50%" }}>
          <Confetti active={showConfetti} config={config} />
        </div>

        <div className={classes.actionBtn}>
          <Button
            type="primary"
            onClick={() => {
              onSuccess();
            }}
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VerifiedModal;
