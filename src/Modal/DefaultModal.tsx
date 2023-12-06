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

type VerifyModalProps = {
  message?: string;
  isCloseAvailable?: boolean;
  SubmitButtonTitle?: string;
  closeButtonTitle?: string;
  onSuccess?: (value?: any | undefined) => void;
  onClose?: (value?: any | undefined) => void;
  primary?: "success" | "failure";
};

type UnclaimedModalProps = {
  message?: string;
  isSubmitAvailable?: boolean;
  SubmitButtonTitle?: string;
  onSuccess?: (value?: any | undefined) => void;
};

type LinkOpenModalProps = {
  type?: string | undefined;
  message?: string;
  url?: string;
  onClose?: (value?: any | undefined) => void;
  onSuccess?: (value?: any | undefined) => void;
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
  isCloseAvailable = true,
  SubmitButtonTitle,
  closeButtonTitle,
  message,
  onClose,
}: VerifyModalProps) => {
  ShowDefaultModal({
    open: true,
    isCloseAvailable,
    isSubmitAvailable: true,
    primary,
    onSuccess,
    onClose,
    SubmitButtonTitle,
    closeButtonTitle,
    message,
  });
};

const UnclaimedAccountContent = (props: UnclaimedModalProps) => {
  const { message, isSubmitAvailable, onSuccess, SubmitButtonTitle } = props;
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
            className={classes.reportBtn}
            onClick={() => {
              setTimeout(() => {
                if (onSuccess) {
                  onSuccess();
                }
              }, 500);
              Modal.destroyAll();
            }}
          >
            {SubmitButtonTitle}
          </Button>
        )}
      </div>
    </div>
  );
};

export const ShowUnclaimedAccountModal = (props: UnclaimedModalProps) => {
  Modal.confirm({
    title: null,
    icon: null,
    width: 600,
    centered: true,
    content: UnclaimedAccountContent(props),
    footer: null,
  });
};

const LinkOpenContent = (props: LinkOpenModalProps) => {
  const defaultMessage =
    "The site you have requested is not managed by Rawcaster.com, we cannot vouch for the contents of the site. We recommend, that you exercise precautions before you click unknown sites.";
  const { onClose, url, onSuccess, message = defaultMessage, type } = props;
  return (
    <div className={classes.reportModal}>
      <p style={{ fontSize: "16px", textIndent: "10px", marginTop: "15px" }}>
        {message}
      </p>

      <div className={classes.actionBtn} style={{ marginTop: "22px" }}>
        <Button
          ghost
          type="primary"
          htmlType="button"
          onClick={() => {
            if (onClose) {
              onClose();
            }
            Modal.destroyAll();
          }}
          size="large"
          className={classes.cancelBtn}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (url) {
              window.open(url, type);
            } else if (onSuccess) {
              onSuccess();
            }

            Modal.destroyAll();
          }}
          style={{ marginLeft: "10px" }}
          htmlType="submit"
          size="large"
          className={classes.reportBtn}
        >
          Continue
        </Button>
      </div>
      <p style={{ textAlign: "center", marginTop: "15px", fontSize: "12px" }}>
        Rawcaster.com LLC
      </p>
    </div>
  );
};

export const ShowLinkOpenModal = (props: LinkOpenModalProps) => {
  Modal.confirm({
    title: "Warning !",
    icon: null,
    width: 600,
    centered: true,
    content: LinkOpenContent(props),
    footer: null,
  });
};
