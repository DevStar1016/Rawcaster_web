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
