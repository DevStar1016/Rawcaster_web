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

const VerifyContent = (props: GlobalModalProps) => {
  const {
    message,
    isSubmitAvailable,
    primary,
    onSuccess,
    onClose,
    closeButtonTitle,
    SubmitButtonTitle,
    isCloseAvailable,
  } = props;
  return (
    <div className={`${classes.profileModal} ${classes.globalModal}`}>
      <img
        height="53px"
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
              setTimeout(() => {
                if (primary === "success") {
                  if (onSuccess) {
                    onSuccess();
                  }
                } else if (onClose) {
                  onClose();
                }
              }, 500);
              Modal.destroyAll();
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
              primary === "failure" ? classes.reportBtn : classes.cancelBtn
            }
            onClick={() => {
              setTimeout(() => {
                if (primary === "failure") {
                  if (onSuccess) {
                    onSuccess();
                  }
                } else if (onClose) {
                  onClose();
                }
              }, 500);
              Modal.destroyAll();
            }}
          >
            {closeButtonTitle}
          </Button>
        )}
      </div>
    </div>
  );
};

export const ShowDefaultModal = (props: GlobalModalProps) => {
  Modal.confirm({
    title: null,
    icon: null,
    width: 600,
    centered: true,
    content: VerifyContent(props),
    footer: null,
  });
};

export const HandleVerifyModal = ({
  primary,
  onSuccess,
  SubmitButtonTitle,
  closeButtonTitle,
  message,
  onClose,
}) => {
  ShowDefaultModal({
    open: true,
    isCloseAvailable: true,
    isSubmitAvailable: true,
    primary,
    onSuccess,
    onClose,
    SubmitButtonTitle,
    closeButtonTitle,
    message,
  });
};
