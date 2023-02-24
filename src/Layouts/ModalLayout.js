import React from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router";
import LoginModal from "../Modal/LoginModal";
import { VerificationModal } from "../Modal/ProfileVerificationModal";
import ValidateTypeModal from "../Modal/ValidateTypeModal";
import { useDashboard, useProfileVerifyModal } from "../Shared/Reduxfetcher";
import {
  handleloginModalShow,
  handleprofileVerifyModalShow,
  handletwostepVerifyModalshow,
} from "../Store/Redux/Reducer/DashboardReducer";

const ModalLayout = () => {
  const dispatch = useDispatch();
  const { loginModalShow, twostepVerifyModalshow } = useDashboard();
  const profileverifyStatus = useProfileVerifyModal();
  return (
    <>
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
    </>
  );
};

export default ModalLayout;
