import { Button } from "antd";
import React from "react";
import { SharedModal } from "../../Sharedcomponents/Modal";
import classes from "../Modal.module.css";
import RawcasterLogo from "../../Assets/Images/png/rawcater_logo.png";
const RedirectModal = ({
  open = false,
  msg = "",
  Btnname,
  closeBtnName = "Cancel",
  onSuccess,
  onClose,
}) => {
  return (
    <SharedModal isVisible={open} closable={true}>
      <div className={classes.profileModal}>
        <img height="38px" src={RawcasterLogo} alt="Rawcaster" />
        <p>{msg}</p>

        <div className={classes.actionBtn}>
          <Button
            ghost
            type="primary"
            htmlType="button"
            size="large"
            className={classes.cancelBtn}
            onClick={() => {
              onClose();
            }}
          >
            {closeBtnName}
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
            onClick={() => {
              onSuccess();
            }}
          >
            {Btnname}
          </Button>
        </div>
      </div>
    </SharedModal>
  );
};

export default RedirectModal;
