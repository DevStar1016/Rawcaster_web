import React, { useEffect } from "react";
import EventBox from "./EventBox";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesocketListen } from "../../../Services/SocketService";
import MeetingManagerComponent from "./MeetingManagerComponent";

const EventRoom = () => {
  return (
    <div>
      <MeetingManagerComponent />
      <EventBox />
    </div>
  );
};

export default EventRoom;
