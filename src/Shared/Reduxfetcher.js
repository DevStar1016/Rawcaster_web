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

export const useProfileVerifyModal = () => {
  return useSelector((state) => state.dashboard.profileVerifyModalShow);
};
