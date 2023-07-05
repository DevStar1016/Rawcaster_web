import { Button, Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { removeSessionStorageData } from "../../Store/Storage";
import classes from "../Modal.module.css";

const LoginModal = ({ open, close, AIopen, AIclose, AImessgae }) => {
  const navigate = useNavigate();

  return (
    <Modal centered open={open} closable={false} footer={null}>
      <div className={classes.profileModal}>
        <img
          height="38px"
          alt="Rawcaster"
          src={require("../../Assets/Images/png/rawcater_logo.png")}
        />
        <p>
          {AImessgae
            ? AImessgae
            : "You need to Login / Signup Rawcaster Account"}
        </p>

        <div className={classes.actionBtn}>
          <Button
            ghost
            type="primary"
            htmlType="button"
            onClick={() => {
              if (AIclose) {
                close();
              } else {
                removeSessionStorageData("influencerData");
                close();
              }
            }}
            size="large"
            className={classes.cancelBtn}
          >
            Later
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (AIopen) {
                close();
                window.location.assign("/membership");
              } else {
                navigate("/login");
                close();
              }
            }}
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
          >
            {AIopen ? "Upgrade" : "Login"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
