import { Button } from "antd";
import React from "react";
import { SharedModal } from "../../Sharedcomponents/Modal";
import classes from "../Modal.module.css";

const WarningModal = ({
  open = false,
  msg = "",
  Btnname,
  onSuccess,
  onClose,
}) => {
  return (
    <SharedModal isVisible={open} closable={true}>
      <div className={classes.profileModal}>
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
            Cancel
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

export default WarningModal;
