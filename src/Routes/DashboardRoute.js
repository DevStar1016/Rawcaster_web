import InfluencerDashboard from "../Components/Influencers/InfluencerDashboard";
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
      path: "/profile",
      element: (
        <HomePrivateRoute auth={isHome}>
          <InfluencerDashboard />
        </HomePrivateRoute>
      ),
    },
  ];
};
