import Dashboard from "../Components/Dashboard/Dashboard";
import Development from "../Components/Development";
import EventRoom from "../Components/Events/Room/EventRoom";
import Viewevent from "../Components/Events/Viewevent";
import GlobalSearchResult from "../Components/GlobalSearchResult";
import SelectInfluencers from "../Components/Influencers/SelectInfluencers";
import Membership from "../Components/Membership";
import NotFound from "../Components/NotFound/NotFound";
import Notification from "../Components/Notifications";
import Cookiespolicy from "../Components/Policy/CookiePolicy";
import Privacypolicy from "../Components/Policy/Privacypolicy";
import TermsandConditions from "../Components/Policy/TermsandConditions";
import Profile from "../Components/Profile";
import Claimaccount from "../Components/Profile/Claimaccount";
import Referel from "../Components/Referel";
import ReferalDashboard from "../Components/Referel/Dashboard/Dashboard";
import Settings from "../Components/Settings";
import HomeLayout from "../Layouts/HomeLayout";

import ViewNugget from "../Sharedcomponents/Nuggets/ViewNugget";
import { NuggetLoader } from "./Actions";
import { HomePrivateRoute } from "./PrivateRoute";

export const DashboardRoute = [
  {
    path: "/",
    element: <HomePrivateRoute />,
    // errorElement: <NotFound />,
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
            path: "/referel/dashboard",
            element: <ReferalDashboard />,
          },
          {
            path: "/view/:nugID",
            element: <ViewNugget />,
          },
          {
            path: "/viewevent/:event_id",
            element: <Viewevent />,
          },
          {
            path: "claim/:user_id",
            element: <Claimaccount />,
          },
          {
            path: "verifyaccount",
            element: <Claimaccount />,
          },
        ],
      },
    ],
  },

  {
    path: "/",
    element: <HomeLayout />,
    // errorElement: <NotFound />,
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
