/**
 * Defines the routes for the events feature in the application.
 * @returns An array of route objects that define the paths and components for the events feature.
 */
import { Navigate, useParams } from "react-router";
import EventRoom from "../Components/Events/Room/EventRoom";
import EventValidaton from "../Components/Events/Room/EventValidaton";
import WaitingRoom from "../Components/Events/Room/WaitingRoom";
import NotFound from "../Components/NotFound/NotFound";
import EventLayout from "../Layouts/EventLayout";
import { useEffect } from "react";
import { useToken } from "antd/es/theme/internal";

/**
 * Handles the navigation to a specific room based on the ref_id parameter in the URL.
 * @returns A Navigate component that redirects the user to the dashboard page.
 */
const HandleNavigate = () => {
  const { ref_id } = useParams();
  const token = useToken();
  useEffect(() => {
    if (token) {
      window.open(`/room/${ref_id}`, "_blank", {
        popup: true,
      });
    }
  }, [token]);

  return <Navigate to={`/dashboard`} />;
};

export const EventRoute = [
  {
    path: "/",
    element: <EventValidaton />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <EventLayout />,
        errorElement: <NotFound />,
        children: [
          {
            path: "/room/:ref_id",
            element: <EventRoom />,
          },
        ],
      },
      {
        path: "/waitingroom/:ref_id",
        element: <WaitingRoom />,
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: "/join/:event/:ref_id",
    element: <HandleNavigate />,
  },
];
