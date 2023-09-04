/**
 * A modal component that displays a message and two buttons for redirection.
 * @param {boolean} open - Determines whether the modal is visible or not. Default is false.
 * @param {string} msg - The message to be displayed in the modal.
 * @param {string} Btnname - The label for the button that triggers the onSuccess callback.
 * @param {string} [closeBtnName="Cancel"] - The label for the button that triggers the onClose callback. Default is "Cancel".
 * @param {function} onSuccess - The callback function to be executed when the onSuccess button is clicked.
 * @param {function} onClose - The callback function to be executed when the onClose button is clicked.
 * @returns The Redirect
 */
import { Button } from "antd";
import { SharedModal } from "../../Sharedcomponents/Modal";
import classes from "../Modal.module.css";
import RawcasterLogo from "../../Assets/Images/png/rawcater_logo.png";
const RedirectModal = ({
  open = false,
  msg = "",
  Btnname,
  closeBtnName = "Cancel",
  onSuccess,
  onClose,
}) => {
  return (
    <SharedModal isVisible={open} closable={true}>
      <div className={classes.profileModal}>
        <img height="38px" src={RawcasterLogo} alt="Rawcaster" />
        <p>{msg}</p>

        <div className={classes.actionBtn}>
          <Button
            ghost
            type="primary"
            htmlType="button"
            size="large"
            className={classes.cancelBtn}
            onClick={() => {
              onClose();
            }}
          >
            {closeBtnName}
          </Button>
          <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
            onClick={() => {
              onSuccess();
            }}
          >
            {Btnname}
          </Button>
        </div>
      </div>
    </SharedModal>
  );
};

export default RedirectModal;
