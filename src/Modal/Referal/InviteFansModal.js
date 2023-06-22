import React, { useState } from "react";
import classes from "./Referal.module.css";
import { Button, Form, Input, Modal, Tag } from "antd";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { EmailReferalContainer, handleSendEmail } from "./utility";

const InviteFansModal = ({ open, close }) => {
  return (
    <Modal
      open={open}
      destroyOnClose={() => {
        close();
      }}
      onCancel={() => {
        close();
      }}
      footer={null}
      width={600}
    >
      <EmailReferalContainer close={close} />
    </Modal>
  );
};

export default InviteFansModal;
