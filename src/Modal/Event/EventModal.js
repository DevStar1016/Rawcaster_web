import { Modal } from "antd";
import React from "react";
import styles from "../Modal.module.css";
import LoadingOverlay from "react-loading-overlay";
import classes from "../../Components/Events/Events.module.css";

const EventModal = ({
  Type = "Talk Show",
  okBtnTitle = "",
  title,
  open,
  onClose,
  onSuccess,
  children,
  isUpdate,
  loading,
  isLinkScreen = false,
  isFetching = [],
}) => {
  const getTitle = () => {
    if (isLinkScreen) {
      return (
        <div className={classes.headingSec}>
          {Type + " Scheduling Successful"}
        </div>
      );
    } else if (title) {
      return title;
    } else {
      return `${isUpdate ? "Update" : "Create"} ` + Type;
    }
  };

  const getFetchingStatus = () => {
    const FetchingData = [
      { type: "event_melody", text: "Fetching Event Melody..." },
      { type: "event_type", text: "Fetching Event Type..." },
      { type: "event_layout", text: "Fetching Event Layout..." },
    ];

    if (isFetching.length !== 0) {
      const findData = FetchingData.find(
        (ele) => ele.type === isFetching[isFetching.length - 1]
      );
      return { status: false, FetchingText: findData.text };
    } else {
      return { status: false, FetchingText: "" };
    }
  };
  return (
    <Modal
      title={getTitle()}
      centered
      width={700}
      open={open}
      okText={
        isLinkScreen
          ? "Close"
          : okBtnTitle
          ? okBtnTitle
          : `${isUpdate ? "Update" : "Create"} Event`
      }
      cancelText={isLinkScreen ? "" : "Cancel"}
      className="eventmodal"
      onOk={() => {
        if (isLinkScreen) {
          onClose();
        } else {
          onSuccess();
        }
      }}
      onCancel={() => onClose()}
      confirmLoading={loading}
      cancelButtonProps={{
        disabled: loading || getFetchingStatus().status,
        style: {
          display: isLinkScreen ? "none" : "",
        },
      }}
      okButtonProps={{ disabled: getFetchingStatus().status }}
      closeIcon={
        <div className={styles.modalCloseIcon}>
          <span className="material-symbols-outlined">close</span>
        </div>
      }
    >
      <LoadingOverlay
        active={getFetchingStatus().status || loading}
        spinner
        text={
          loading
            ? `${isUpdate ? "Updating Event..." : "Creating Event..."}`
            : getFetchingStatus().FetchingText
        }
      >
        {children}
      </LoadingOverlay>
    </Modal>
  );
};

export default EventModal;
