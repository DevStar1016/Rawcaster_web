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
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { HandleVerifyModal } from "../DefaultModal";
import { useDispatch } from "react-redux";
import { complementaryMembershipService } from "../../Services/ApiService";
import { handleLoginData } from "../../Store/Redux/Reducer/AuthReducer";

const LoginModal = ({ open, close, AIopen, AIclose, AImessgae, isAI }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useAuthToken();
  const loginUserData = useAuthData();

  const ComplementaryMemberShip = () => {
    let formData = new FormData();
    formData.append("token", token);
    complementaryMembershipService(formData)
      .then((res) => {
        if (res.data.status === 1) {
          HandleVerifyModal({
            primary: "success",
            onSuccess: () => {
              dispatch(
                handleLoginData({
                  ...loginUserData,
                  user_status: res.data.user_status,
                  user_status_id: res.data.user_status_id,
                })
              );
            },
            isCloseAvailable: false,
            SubmitButtonTitle: "Ok",
            message: res.data.msg,
          });
        } else {
          navigate("/membership");
        }
      })
      .catch((err) => {});
  };

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
          {!isAI ? (
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
          ) : null}
          <Button
            type="primary"
            onClick={() => {
              if (isAI) {
                close();
              } else {
                if (AIopen) {
                  close();
                  if (loginUserData.complementary_status === 1) {
                    ComplementaryMemberShip();
                  } else {
                    navigate("/membership");
                  }
                } else {
                  navigate("/login");
                  close();
                }
              }
            }}
            style={{ marginLeft: "10px" }}
            htmlType="Continue"
            size="large"
            className={classes.reportBtn}
          >
            {isAI ? "Ok" : AIopen ? "Ok" : "Login"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
