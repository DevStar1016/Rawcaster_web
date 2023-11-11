/**
 * Defines the routes for the dashboard.
 * @returns An array of route objects.
 */
import { useDispatch } from "react-redux";
import Dashboard from "../Components/Dashboard/Dashboard";
import Development from "../Components/Development";
import Viewevent from "../Components/Events/Viewevent";
import GlobalSearchResult from "../Components/GlobalSearchResult";
import SelectInfluencers from "../Components/Influencers/SelectInfluencers";
import Membership from "../Components/Membership";
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
import { HomePrivateRoute } from "./PrivateRoute";
import IdenfyVerification from "../Components/Idenfy/IdenfyVerification";

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
          {
            path: "documentverify",
            element: <IdenfyVerification />,
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
        path: "/viewprofile/:user_id",
        element: <Profile />,
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
