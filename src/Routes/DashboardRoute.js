import Dashboard from "../Components/Dashboard/Dashboard";
import SelectInfluencers from "../Components/Influencers/SelectInfluencers";
import { HomePrivateRoute } from "./PrivateRoute";

export const DashboardRoute = (isHome = true) => {
  return [
    {
      path: "/selectinfluencers",
      element: (
        <HomePrivateRoute auth={isHome}>
          <SelectInfluencers />
        </HomePrivateRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <HomePrivateRoute auth={isHome}>
          <Dashboard />
        </HomePrivateRoute>
      ),
    },
  ];
};
