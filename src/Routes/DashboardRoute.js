import Dashboard from "../Components/Dashboard/Dashboard";
import SelectInfluencers from "../Components/Influencers/SelectInfluencers";
import Cookiespolicy from "../Components/Policy/CookiePolicy";
import Privacypolicy from "../Components/Policy/Privacypolicy";
import TermsandConditions from "../Components/Policy/TermsandConditions";
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
        {
          path: "privacypolicy",
          element: <Privacypolicy />,
        },
        {
          path: "termsandconditions",
          element: <TermsandConditions />,
        },
        {
          path: "cookiespolicy",
          element: <Cookiespolicy />,
        },
      ],
    },
  ];
};
