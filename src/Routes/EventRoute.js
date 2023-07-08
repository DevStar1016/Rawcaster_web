import EventRoom from "../Components/Events/Room/EventRoom";
import NotFound from "../Components/NotFound/NotFound";
import EventLayout from "../Layouts/EventLayout";

export const EventRoute = [
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
];
