import NotFound from "../Components/NotFound/NotFound";
import ModalLayout from "../Layouts/ModalLayout";
import { AuthRoute } from "./AuthRoutes";
import { DashboardRoute } from "./DashboardRoute";
import { ProfileRoute } from "./ProfileRoutes";

export const routerpaths = [
  {
    path: "/",
    element: <ModalLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        children: [...AuthRoute, ...DashboardRoute, ...ProfileRoute],
      },
    ],
  },
];
