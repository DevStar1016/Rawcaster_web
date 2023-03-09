import { Modal } from "antd";
import React from "react";

const EventModal = ({ open, onClose, onSuccess, children }) => {
  return (
    <Modal
      title="Create Talk Show"
      centered
      open={open}
      okText="Create Event"
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
