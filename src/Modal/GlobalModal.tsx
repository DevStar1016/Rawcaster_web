import { Button, Modal } from "antd";
import classes from "./Modal.module.css";

type GlobalModalProps = {
  closable?: boolean;
  title?: string | null;
  width?: number | undefined;
  open: boolean;
  children?: any;
  isChildren?: boolean;
  message?: string;
  isSubmitAvailable?: boolean;
  isCloseAvailable?: boolean;
  SubmitButtonTitle?: string;
  closeButtonTitle?: string;
  onSuccess?: (value?: any | undefined) => void;
  onClose?: (value?: any | undefined) => void;
  primary?: "success" | "failure";
};

function GlobalModal({
  title = null,
  open,
  children,
  isChildren = false,
  message,
  isSubmitAvailable = false,
  isCloseAvailable = false,
  SubmitButtonTitle = "",
  closeButtonTitle = "",
  onSuccess,
  onClose,
  primary = "success",
  width = undefined,
  closable = false,
}: GlobalModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      footer={null}
      closable={closable}
      centered
      width={width}
      onCancel={onClose}
    >
      {isChildren ? (
        <>
          {children}
          {(isSubmitAvailable || isCloseAvailable) && (
            <div className={classes.actionBtn}>
              {isSubmitAvailable && (
                <Button
                  ghost
                  type="primary"
                  htmlType="button"
                  size="large"
                  className={
                    primary === "success"
                      ? classes.reportBtn
                      : classes.cancelBtn
                  }
                  onClick={() => {
                    if (primary === "success") {
                      if (onSuccess) {
                        onSuccess();
                      }
                    } else if (onClose) {
                      onClose();
                    }
                  }}
                >
                  {SubmitButtonTitle}
                </Button>
              )}
              {isCloseAvailable && (
                <Button
                  ghost
                  type="primary"
                  style={{ marginLeft: "10px" }}
                  htmlType="button"
                  size="large"
                  className={
                    primary === "failure"
                      ? classes.reportBtn
                      : classes.cancelBtn
                  }
                  onClick={() => {
                    if (primary === "failure") {
                      if (onSuccess) {
                        onSuccess();
                      }
                    } else if (onClose) {
                      onClose();
                    }
                  }}
                >
                  {closeButtonTitle}
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className={`${classes.profileModal} ${classes.globalModal}`}>
          <img
            height="43px"
            alt={"Rawcaster Logo"}
            src={require("../Assets/Images/png/rawcater_logo.png")}
          />
          <p>{message}</p>
          <div className={classes.actionBtn}>
            {isSubmitAvailable && (
              <Button
                ghost
                type="primary"
                htmlType="button"
                size="large"
                className={
                  primary === "success" ? classes.reportBtn : classes.cancelBtn
                }
                onClick={() => {
                  if (primary === "success") {
                    if (onSuccess) {
                      onSuccess();
                    }
                  } else if (onClose) {
                    onClose();
                  }
                }}
              >
                {closeButtonTitle}
              </Button>
            )}
            {isCloseAvailable && (
              <Button
                ghost
                type="primary"
                style={{ marginLeft: "10px" }}
                htmlType="button"
                size="large"
                className={
                  primary === "failure" ? classes.reportBtn : classes.cancelBtn
                }
                onClick={() => {
                  if (primary === "failure") {
                    if (onSuccess) {
                      onSuccess();
                    }
                  } else if (onClose) {
                    onClose();
                  }
                }}
              >
                {SubmitButtonTitle}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default GlobalModal;
