/**
 * A modal component that displays a message to reactivate the user's account.
 * @param {boolean} open - Determines whether the modal is open or closed.
 * @param {function} close - Callback function to close the modal.
 * @returns A modal component with the account reactivation message.
 */
import { Modal } from "antd";
import classes from "./Modal.module.css";
import { Link } from "react-router-dom";

const AccountActivateModal = ({ open, close }) => {
  return (
    <Modal open={open} footer={null} closable={false} centered>
      <div className={classes.AccountactiveSec}>
        <img
          height="38px"
          alt={"Rawcaster Logo"}
          src={require("../Assets/Images/png/rawcater_logo.png")}
        />
        <p>
          Before you can share nuggets, and chat with your friends we need to
          reactivate your account. Please go to Settings, click on General and
          switch from <span>Inactive</span> to <span>Active</span>.
        </p>
        <Link
          to="/setting"
          onClick={() => {
            close();
          }}
        >
          Go to Settings
        </Link>
      </div>
    </Modal>
  );
};

export default AccountActivateModal;
