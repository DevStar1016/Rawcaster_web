import { Button, Modal } from "antd";
import React from "react";
import { useNavigate } from "react-router";
import { removeSessionStorageData } from "../../Store/Storage";
import classes from "../Modal.module.css";

const LoginModal = ({ open, close }) => {
  const navigate = useNavigate();

  return (
    <Modal open={open} closable={false} footer={null}>
      <div className={classes.profileModal}>
        <img
          height="38px"
          src={require("../../Assets/Images/png/rawcater_logo.png")}
        />
        <p>You need to Login / Signup Rawcaster Account</p>

        <div className={classes.actionBtn}>
          <Button
            ghost
            type="primary"
            htmlType="button"
            onClick={() => {
              removeSessionStorageData("influencerData");
              close();
            }}
            size="large"
            className={classes.cancelBtn}
          >
            Later
          </Button>
          <Button
            type="primary"
            onClick={() => {
              navigate("/login");
              close();
            }}
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
          >
            Login
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
