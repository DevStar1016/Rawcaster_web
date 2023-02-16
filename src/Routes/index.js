import { AuthRoute } from "./AuthRoutes";
import { DashboardRoute } from "./DashboardRoute";

export const RootElement = () => {
  return [...AuthRoute(), ...DashboardRoute()];
};
