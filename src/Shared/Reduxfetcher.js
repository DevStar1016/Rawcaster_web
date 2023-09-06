/**
 * Custom React hook that returns the login user data from the Redux store.
 * @returns The login user data.
 */
import { useSelector } from "react-redux";

export const useAuthData = () => {
  return useSelector((state) => state.auth.loginUserData);
};

export const useEventTempAuthData = () => {
  return useSelector((state) => state.auth.eventTempUserData);
};

export const useAuthToken = () => {
  return useSelector((state) => state.auth.loginToken);
};

export const useDashboard = () => {
  return useSelector((state) => state.dashboard);
};

export const useNuggets = () => {
  return useSelector((state) => state.nuggets);
};

export const useFriends = () => {
  return useSelector((state) => state.dashboard.friendsList);
};
export const useGroups = () => {
  return useSelector((state) => state.dashboard.groupsList);
};

export const useAuth = () => {
  return useSelector((state) => state.auth);
};

export const useNotification = () => {
  return useSelector((state) => state.notification);
};

export const useProfileVerifyModal = () => {
  return useSelector((state) => state.dashboard.profileVerifyModalShow);
};

export const useSocket = () => {
  return useSelector((state) => state.socket);
};

export const useEventWindow = () => {
  return useSelector((state) => state.utility.eventWindowRef);
};
