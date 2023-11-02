/**
 * A React component that renders a login modal.
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Whether the modal is open or not.
 * @param {function} props.close - Function to close the modal.
 * @param {boolean} props.AIopen - Whether the AI is open or not.
 * @param {function} props.AIclose - Function to close the AI.
 * @param {string} props.AImessgae - The message to display in the modal.
 * @returns A modal component that allows users to login or signup for a Rawcaster account.
 */
import { Button, Modal } from "antd";
import { useNavigate } from "react-router";
import { removeSessionStorageData } from "../../Store/Storage";
import classes from "../Modal.module.css";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { HandleVerifyModal } from "../DefaultModal";

const LoginModal = ({ open, close, AIopen, AIclose, AImessgae }) => {
  const navigate = useNavigate();
  const token = useAuthToken();
  return (
    <Modal centered open={open} closable={false} footer={null}>
      <div className={classes.profileModal}>
        <img
          height="38px"
          alt="Rawcaster"
          src={require("../../Assets/Images/png/rawcater_logo.png")}
        />
        <p>
          {AImessgae
            ? AImessgae
            : "You need to Login / Signup Rawcaster Account"}
        </p>

        <div className={classes.actionBtn}>
          <Button
            ghost
            type="primary"
            htmlType="button"
            onClick={() => {
              if (AIclose) {
                close();
              } else {
                removeSessionStorageData("influencerData");
                close();
              }
            }}
            size="large"
            className={classes.cancelBtn}
          >
            Later
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (AIopen) {
                close();
                HandleVerifyModal({
                  primary: "success",
                  onSuccess: () => {},
                  isCloseAvailable: false,
                  SubmitButtonTitle: "Ok",
                  message:
                    "you have been granted a complementary upgrade for xx days",
                });
                // window.location.assign("/membership");
              } else {
                navigate("/login");
                close();
              }
            }}
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
          >
            {AIopen ? "Upgrade" : "Login"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
