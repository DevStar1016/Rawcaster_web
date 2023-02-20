import { useSelector } from "react-redux";

export const getUserData = () => {
  return useSelector((state) => state.auth.loginUserData);
};

export const getDashboard = () => {
  return useSelector((state) => state.dashboard);
};
