import { AuthRoute } from "./AuthRoutes";
import { DashboardRoute } from "./DashboardRoute";

export const RootElement = ({ isAuth, isHome }) => {
  return [...AuthRoute(isAuth), ...DashboardRoute(isHome)];
};
