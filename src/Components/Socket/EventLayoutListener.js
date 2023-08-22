import React, { useEffect } from "react";
import { ChimesocketListen } from "../../Services/SocketService";
import { CHIME_SOCKET_EVENTS } from "../../Services/ServiceConstants";

const EventLayoutListener = () => {
  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER,
      (message) => {
        console.log(message, "message");
        localStorage.setItem(
          CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER,
          JSON.stringify(message)
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER);
    };
  }, []);
  return <div></div>;
};

export default EventLayoutListener;
