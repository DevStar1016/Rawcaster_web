/**
 * A reusable modal component for displaying events.
 * @param {string} Type - The type of event (default: "Talk Show").
 * @param {string} okBtnTitle - The title of the OK button (default: "").
 * @param {string} title - The title of the modal.
 * @param {boolean} open - Whether the modal is open or not.
 * @param {function} onClose - Callback function to handle modal close event.
 * @param {function} onSuccess - Callback function to handle successful event creation/update.
 * @param {ReactNode} children - The content to be displayed inside the modal.
 * @param {boolean} isUpdate - Whether the event is an update or not.
 *
 */
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
  /**
   * Returns the title component based on the current state and props.
   * @returns {ReactNode} - The title component.
   */
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

  /**
   * Retrieves the fetching status and text based on the current state of the "isFetching" array.
   * @returns An object containing the status and fetching text.
   */
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
