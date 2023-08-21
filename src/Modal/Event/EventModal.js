import { Modal } from "antd";
import React from "react";
import styles from "../Modal.module.css";
import LoadingOverlay from "react-loading-overlay";

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
  isFetching = [],
}) => {
  const getTitle = () => {
    if (title) {
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
        okBtnTitle ? okBtnTitle : `${isUpdate ? "Update" : "Create"} Event`
      }
      cancelText="Cancel"
      className="eventmodal"
      onOk={() => onSuccess()}
      onCancel={() => onClose()}
      confirmLoading={loading}
      cancelButtonProps={{ disabled: loading || getFetchingStatus().status }}
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
