import { Modal } from "antd";
import React from "react";

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
    >
      {children}
    </Modal>
  );
};

export default EventModal;
