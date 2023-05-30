import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router";
import LoginModal from "../Modal/Verification/LoginModal";
import { VerificationModal } from "../Modal/Verification/ProfileVerificationModal";
import ValidateTypeModal from "../Modal/Verification/ValidateTypeModal";
import {
  useAuth,
  useDashboard,
  useProfileVerifyModal,
} from "../Shared/Reduxfetcher";
import {
  handleloginModalShow,
  handleprofileVerifyModalShow,
  handletwostepVerifyModalshow,
} from "../Store/Redux/Reducer/DashboardReducer";
import AccountActivateModal from "../Modal/AccountActivateModal";
import { handleAccountActive } from "../Store/Redux/Reducer/AuthReducer";
import { removeSessionStorageData } from "../Store/Storage";
import HelmetComponent from "../Components/SEO";

const ModalLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { loginModalShow, twostepVerifyModalshow } = useDashboard();
  const { isAccountActive, userSettings } = useAuth();
  const profileverifyStatus = useProfileVerifyModal();

  useEffect(() => {
    if (location.pathname !== "/setpassword") {
      removeSessionStorageData("CountDown");
    }
    if (location.pathname !== "/verifyotp") {
      removeSessionStorageData("verifyCountDown");
    }
    if (location.pathname !== "/setting") {
      if (userSettings && userSettings.account_active_inactive === 0) {
        dispatch(handleAccountActive(true));
      }
    }
  }, [location]);

  return (
    <>
      <HelmetComponent />
      <Outlet />
      <ValidateTypeModal
        open={twostepVerifyModalshow}
        handleClose={() => {
          dispatch(handletwostepVerifyModalshow(false));
        }}
      />
      <LoginModal
        open={loginModalShow}
        close={() => {
          dispatch(handleloginModalShow(false));
        }}
      />
      <VerificationModal
        open={profileverifyStatus.show}
        msg={profileverifyStatus.msg}
        close={() => {
          dispatch(handleprofileVerifyModalShow({ show: false, msg: "" }));
        }}
      />
      <AccountActivateModal
        open={isAccountActive}
        close={() => {
          dispatch(handleAccountActive(false));
        }}
      />
    </>
  );
};

export default ModalLayout;
