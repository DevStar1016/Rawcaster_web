import React from "react";
import classes from "./ClaimAccount.module.css";
import { Modal } from "antd";
import claimedAccount from "../../Assets/Icons/svg/Claim_success.svg";

const ClaimAccountModal = ({ visible, onClose }) => {
  return (
    <Modal
      centered
      className="claimrequestModal"
      footer={null}
      open={visible}
      closable={false}
      height={600}
      width={650}
      onCancel={() => {
        onClose();
      }}
    >
      <div className={classes.header}>
        Claim request{" "}
        <span
          class="material-symbols-outlined"
          onClick={() => {
            onClose();
          }}
        >
          close
        </span>
      </div>
      <div className={classes.container}>
        <img src={claimedAccount} alt={"Claim Account"} />
        <p>
          You have placed a claim on a predefined influencer profile; We will
          contact you to validate your claim. Please contact us at
          info@rawcaster.com if you have any questions.
        </p>
      </div>
    </Modal>
  );
};

export default ClaimAccountModal;
