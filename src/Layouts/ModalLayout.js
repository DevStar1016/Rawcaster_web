/**
 * A layout component that renders various modals and handles their state and logic.
 * @returns The rendered modals and their corresponding logic.
 */
import React, { useEffect, useRef, useState } from "react";
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
import { MainContext } from "../Shared/Context";
import {
  useMeetingManager,
  useRosterState,
} from "amazon-chime-sdk-component-library-react";

const ModalLayout = () => {
  const PlayerSource = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const [player, setplayer] = useState(null);
  const [ActiveEvent, setActiveEvent] = useState(null);
  const meetingManager = useMeetingManager();
  const { roster } = useRosterState();
  const attendees = Object.values(roster);
  const [isChatOpen, setisChatOpen] = useState({
    show: false,
    type: "",
    id: "",
  });
  const [ReferenceId, setReferenceId] = useState(null);
  const { loginModalShow, twostepVerifyModalshow } = useDashboard();
  const { isAccountActive, userSettings } = useAuth();
  const profileverifyStatus = useProfileVerifyModal();

  /**
   * React hook that runs an effect when the 'location' dependency changes.
   * The effect pauses the player if it exists and cancels any ongoing requests
   * made by the 'PlayerSource' ref.
   * @param {object} location - The location object that triggers the effect when it changes.
   * @returns None
   */
  useEffect(() => {
    if (player) {
      player.pause();
    }
    if (PlayerSource.current) {
      PlayerSource.current.cancel("Request Cancelled");
    }
  }, [location]);

  /**
   * Executes the specified side effects when the location pathname changes.
   * @param {function} callback - The callback function to execute.
   * @param {Array} dependencies - The dependencies to watch for changes.
   * @returns None
   */
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
    <MainContext.Provider
      value={{
        meetingManager,
        attendees,
        player,
        setplayer,
        PlayerSource,
        setisChatOpen,
        isChatOpen,
        setActiveEvent,
        ActiveEvent,
        ReferenceId,
        setReferenceId,
      }}
    >
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
    </MainContext.Provider>
  );
};

export default ModalLayout;
