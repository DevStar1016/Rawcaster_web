import Dashboard from "../Components/Dashboard/Dashboard";
import Development from "../Components/Development";
import GlobalSearchResult from "../Components/GlobalSearchResult";
import SelectInfluencers from "../Components/Influencers/SelectInfluencers";
import Cookiespolicy from "../Components/Policy/CookiePolicy";
import Privacypolicy from "../Components/Policy/Privacypolicy";
import TermsandConditions from "../Components/Policy/TermsandConditions";
import Profile from "../Components/Profile";
import HomeLayout from "../Layouts/HomeLayout";
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
            path: "/viewprofile",
            element: <Profile />,
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
