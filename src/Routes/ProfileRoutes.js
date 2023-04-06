import UpdateProfile from "../Components/Profile/Verification/UpdateProfile";
import ProfileVerification from "../Components/Profile/Verification";
import VerifyOtp from "../Components/Profile/Verification/VerifyOtp";

export const ProfileRoute = [
  {
    path: "/",
    element: <ProfileVerification />,
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
