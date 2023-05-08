import Dashboard from "../Components/Dashboard/Dashboard";
import Development from "../Components/Development";
import GlobalSearchResult from "../Components/GlobalSearchResult";
import SelectInfluencers from "../Components/Influencers/SelectInfluencers";
import Membership from "../Components/Membership";
import Notification from "../Components/Notifications";
import Cookiespolicy from "../Components/Policy/CookiePolicy";
import Privacypolicy from "../Components/Policy/Privacypolicy";
import TermsandConditions from "../Components/Policy/TermsandConditions";
import Profile from "../Components/Profile";
import Claimaccount from "../Components/Profile/Claimaccount";
import Referel from "../Components/Referel";
import Settings from "../Components/Settings";
import HomeLayout from "../Layouts/HomeLayout";

import ViewNugget from "../Sharedcomponents/Nuggets/ViewNugget";
import { HomePrivateRoute } from "./PrivateRoute";

export const DashboardRoute = [
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
          {
            path: "/viewprofile/:user_id",
            element: <Profile />,
          },
          {
            path: "/setting",
            element: <Settings />,
          },
          {
            path: "/membership",
            element: <Membership />,
          },
          {
            path: "/referel",
            element: <Referel />,
          },
          {
            path: "/view/:nugID",
            element: <ViewNugget />,
          },
          {
            path: "claim/:user_id",
            element: <Claimaccount />,
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
        path: "/globalsearch/:key",
        element: <GlobalSearchResult />,
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
      {
        path: "dev",
        element: <Development />,
      },
    ],
  },
];
