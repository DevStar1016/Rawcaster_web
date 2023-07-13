import { Navigate, useParams } from "react-router";
import EventRoom from "../Components/Events/Room/EventRoom";
import EventValidaton from "../Components/Events/Room/EventValidaton";
import WaitingRoom from "../Components/Events/Room/WaitingRoom";
import NotFound from "../Components/NotFound/NotFound";
import EventLayout from "../Layouts/EventLayout";
import { useDispatch } from "react-redux";
import { useAuthToken } from "../Shared/Reduxfetcher";
import { fetchActiveEventData } from "../Store/Redux/Action";
import { useEffect } from "react";
import { useMainContext } from "../Shared/Context";

const HandleNavigate = () => {
  const { setActiveEvent } = useMainContext();
  const { ref_id } = useParams();
  const dispatch = useDispatch();
  const token = useAuthToken();

  useEffect(() => {
    dispatch(
      fetchActiveEventData({
        token,
        ref_id: ref_id,
      })
    ).then(({ payload }) => {
      setActiveEvent(payload);
      window.open(
        payload.is_host === 1 ? `/room/${ref_id}` : `/waitingroom/${ref_id}`,
        "_blank",
        {
          popup: true,
        }
      );
    });
  }, []);

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
            path: "/room/:event_id",
            element: <EventRoom />,
          },
        ],
      },
      {
        path: "/waitingroom/:event_id",
        element: <WaitingRoom />,
        errorElement: <NotFound />,
      },
    ],
  },
  {
    path: "/join/event/:ref_id",
    element: <HandleNavigate />,
  },
];
