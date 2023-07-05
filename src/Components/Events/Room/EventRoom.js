import React, { useEffect } from "react";
import EventBox from "./EventBox";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesocketListen } from "../../../Services/SocketService";

const EventRoom = () => {
  useEffect(() => {
    ChimesocketListen.on("connect", () => {
      console.log(ChimesocketListen.connected, "Chime Socket");
    });
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.CREATE_MEETING_ROOM, (message) => {
      console.log(message);
    });
  }, []);
  return (
    <div>
      <EventBox />
    </div>
  );
};

export default EventRoom;
