/**
 * A modal component that displays a warning message when opening a link.
 * @param {boolean} open - Determines whether the modal is open or closed.
 * @param {function} close - Callback function to close the modal.
 * @param {string} url - The URL of the site to be opened.
 * @returns A modal component with a warning message and buttons to cancel or continue.
 */
import { Modal, Button } from "antd";
import classes from "../Modal.module.css";

const LinkOpenModal = ({ open, close, url }) => {
  return (
    <Modal
      centered
      open={open}
      closable={false}
      footer={null}
      title="Warning !"
    >
      <div className={classes.reportModal}>
        <p style={{ fontSize: "16px", textIndent: "10px", marginTop: "15px" }}>
          The site you have requested is not managed by Rawcaster.com, we cannot
          vouch for the contents of the site. We recommend, that you exercise
          precautions before you click unknown sites.
        </p>

        <div className={classes.actionBtn} style={{ marginTop: "22px" }}>
          <Button
            ghost
            type="primary"
            htmlType="button"
            onClick={() => {
              close();
            }}
            size="large"
            className={classes.cancelBtn}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => {
              close();
              window.open(url);
            }}
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
          >
            Continue
          </Button>
        </div>
        <p style={{ textAlign: "center", marginTop: "15px", fontSize: "12px" }}>
          Rawcaster.com LLC
        </p>
      </div>
    </Modal>
  );
};

export default LinkOpenModal;
