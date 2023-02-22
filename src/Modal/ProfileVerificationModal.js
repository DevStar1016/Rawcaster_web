import { Button, Modal } from "antd";
import React from "react";
import classes from "./Modal.module.css";

export const VerificationModal = ({ open, close }) => {
  return (
    <Modal open={open} closable={false} footer={null}>
      <div className={classes.profileModal}>
        <img
          height="38px"
          src={require("../Assets/Images/png/rawcater_logo.png")}
        />
        <p>
          You need to complete your account validation before you can do this.
          Do you want to validate it now?
        </p>

        <div className={classes.actionBtn}>
          <Button
            ghost
            type="primary"
            htmlType="button"
            onClick={() => {
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
              console.log("validate");
            }}
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
          >
            Validate Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};
