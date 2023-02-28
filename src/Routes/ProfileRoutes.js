import ProfileVerification from "../ProfileVerification";
import UpdateProfile from "../ProfileVerification/UpdateProfile";
import VerifyOtp from "../ProfileVerification/VerifyOtp";

export const ProfileRoute = () => {
  return [
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
};
