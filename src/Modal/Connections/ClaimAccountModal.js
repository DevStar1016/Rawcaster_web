/**
 * A React component that renders a modal for displaying a claim account request.
 * @param {boolean} visible - Determines whether the modal is visible or not.
 * @param {function} onClose - Callback function to close the modal.
 * @param {string} msg - The message to display in the modal.
 * @returns A modal component with the claim account request information.
 */
import classes from "./ClaimAccount.module.css";
import { Modal } from "antd";
import claimedAccount from "../../Assets/Icons/svg/Claim_success.svg";

const ClaimAccountModal = ({ visible, onClose, msg }) => {
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
          className="material-symbols-outlined"
          onClick={() => {
            onClose();
          }}
        >
          close
        </span>
      </div>
      <div className={classes.container}>
        <img src={claimedAccount} alt={"Claim Account"} />
        <p>{msg}</p>
      </div>
    </Modal>
  );
};

export default ClaimAccountModal;
