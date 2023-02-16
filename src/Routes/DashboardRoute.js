import Dashboard from "../Components/Dashboard/Dashboard";
import SelectInfluencers from "../Components/Influencers/SelectInfluencers";
import HomeLayout from "../Layouts/HomeLayout";
import { HomePrivateRoute } from "./PrivateRoute";

export const DashboardRoute = () => {
  return [
    {
      path: "/",
      element: <HomePrivateRoute />,
      children: [
        {
          path: "/",
          element: <HomeLayout />,
          children: [
            {
              path: "/selectinfluencers",
              element: <SelectInfluencers />,
            },
          ],
        },
      ],
    },

    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
      ],
    },
  ];
};
