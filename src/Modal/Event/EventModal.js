import { Modal } from "antd";
import React from "react";
import styles from "../Modal.module.css";

const EventModal = ({ open, onClose, onSuccess, children, isUpdate }) => {
  return (
    <Modal
      title={`${isUpdate ? "Update" : "Create"} Talk Show`}
      centered
      open={open}
      okText={`${isUpdate ? "Update" : "Create"} Event`}
      cancelText="Cancel"
      className="eventmodal"
      onOk={() => onSuccess()}
      onCancel={() => onClose()}
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
