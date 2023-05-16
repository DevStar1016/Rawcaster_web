import { useSelector } from "react-redux";

export const useAuthData = () => {
  return useSelector((state) => state.auth.loginUserData);
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

export const useAuth = () => {
  return useSelector((state) => state.auth);
};

export const useProfileVerifyModal = () => {
  return useSelector((state) => state.dashboard.profileVerifyModalShow);
};
