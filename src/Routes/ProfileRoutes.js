/**
 * Defines the routes for the profile section of the application.
 * @type {Array}
 * @property {string} path - The URL path for the route.
 * @property {ReactElement} element - The component to render for the route.
 * @property {ReactElement} errorElement - The component to render if there is an error.
 * @property {Array} children - An array of child routes.
 * @returns {Array} - An array of route objects.
 */
import UpdateProfile from "../Components/Profile/Verification/UpdateProfile";
import ProfileVerification from "../Components/Profile/Verification";
import VerifyOtp from "../Components/Profile/Verification/VerifyOtp";
import NotFound from "../Components/NotFound/NotFound";

export const ProfileRoute = [
  {
    path: "/",
    element: <ProfileVerification />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/profile",
        element: <UpdateProfile />,
      },
      {
        path: "/verifyotp",
        element: <VerifyOtp />,
      },
    ],
  },
];
