/**
 * Custom React hook that returns the login user data from the Redux store.
 * @returns The login user data.
 */

import { useAppSelector } from "../Store/Redux/Config/Hooks";

export const useAuthData = () => {
  return useAppSelector((state) => state.auth.loginUserData);
};

export const useEventTempAuthData = () => {
  return useAppSelector((state) => state.auth.eventTempUserData);
};

export const useAuthToken = () => {
  return useAppSelector((state) => state.auth.loginToken);
};

export const useDashboard = () => {
  return useAppSelector((state) => state.dashboard);
};

export const useNuggets = () => {
  return useAppSelector((state) => state.nuggets);
};

export const useFriends = () => {
  return useAppSelector((state) => state.dashboard.friendsList);
};
export const useGroups = () => {
  return useAppSelector((state) => state.dashboard.groupsList);
};

export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useNotification = () => {
  return useAppSelector((state) => state.notification);
};

export const useProfileVerifyModal = () => {
  return useAppSelector((state) => state.dashboard.profileVerifyModalShow);
};

export const useSocket = () => {
  return useAppSelector((state) => state.socket);
};

export const useEventWindow = () => {
  return useAppSelector((state) => state.utility.eventWindowRef);
};
export const useUtility = () => {
  return useAppSelector((state) => state.utility);
};

export const useSettings = () => {
  return useAppSelector((state) => state.auth.userSettings)
}
