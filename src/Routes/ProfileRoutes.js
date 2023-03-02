import ProfileVerification from "../Components/ProfileVerification";
import UpdateProfile from "../Components/ProfileVerification/UpdateProfile";
import VerifyOtp from "../Components/ProfileVerification/VerifyOtp";

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
