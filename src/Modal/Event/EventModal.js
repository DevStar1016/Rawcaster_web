import { Modal } from "antd";
import React from "react";
import styles from "../Modal.module.css";

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
}) => {
  const getTitle = () => {
    if (title) {
      return title;
    } else {
      return `${isUpdate ? "Update" : "Create"} ` + Type;
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
      cancelButtonProps={{ disabled: loading }}
      closeIcon={
        <div className={styles.modalCloseIcon}>
          <span class="material-symbols-outlined">close</span>
        </div>
      }
    >
      {children}
    </Modal>
  );
};

export default EventModal;
