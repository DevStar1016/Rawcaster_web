import { useRouteError } from "react-router";
import NotFound from "../Components/NotFound/NotFound";
import ModalLayout from "../Layouts/ModalLayout";
import { AuthRoute } from "./AuthRoutes";
import { DashboardRoute } from "./DashboardRoute";
import { EventRoute } from "./EventRoute";
import { ProfileRoute } from "./ProfileRoutes";

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>{JSON.stringify(error)}</div>;
}

export const routerpaths = [
  {
    path: "/",
    element: <ModalLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        children: [
          ...AuthRoute,
          ...DashboardRoute,
          ...ProfileRoute,
          ...EventRoute,
        ],
      },
    ],
  },
];
