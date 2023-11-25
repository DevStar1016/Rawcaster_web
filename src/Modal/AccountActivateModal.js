/**
 * A modal component that displays a message to reactivate the user's account.
 * @param {boolean} open - Determines whether the modal is open or closed.
 * @param {function} close - Callback function to close the modal.
 * @returns A modal component with the account reactivation message.
 */
import { Modal } from "antd";
import classes from "./Modal.module.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleLoading } from "../Store/Redux/Reducer/DashboardReducer";
import { JSONtoformdata, RemoveToken } from "../Shared/Utility";
import { useAuthData } from "../Shared/Reduxfetcher";
import { handleResetNuggets } from "../Store/Redux/Reducer/NuggetsReducer";
import toast from "react-hot-toast";
import { logoutService } from "../Services/ApiService";

const AccountActivateModal = ({ open, close }) => {
  const dispatch = useDispatch();
  const loginUserData = useAuthData();
  const handleLogout = () => {
    dispatch(handleLoading(true));
    let logutData = {
      token: loginUserData?.token,
    };
    logoutService(JSONtoformdata(logutData))
      .then((res) => {
        if (res.data.status === 1) {
          close();
          RemoveToken(dispatch);
          dispatch(handleResetNuggets());
          window.location.assign("/");
        } else if (res.data.status === 0) {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {})
      .finally(() => {});
  };
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
        <div className="d-flex justify-content-between flex-wrap">
          <Link
            to="/setting"
            onClick={() => {
              close();
            }}
          >
            Go to Settings
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </Modal>
  );
};

export default AccountActivateModal;
