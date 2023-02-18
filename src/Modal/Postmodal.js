import { Modal } from "antd";
import React from "react";

const Postmodal = ({ visible, onClose }) => {
  return (
    <Modal
      footer={null}
      open={visible}
      onCancel={() => {
        onClose();
      }}
    >
      <div
        onClick={() => {
          onClose();
        }}
      >
        11234
      </div>
    </Modal>
  );
};

export default Postmodal;
