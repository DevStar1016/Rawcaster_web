import React, { useEffect } from "react";
import { CHIME_SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { ChimesocketListen } from "../../../Services/SocketService";
import { useLayoutContect } from "../../../Layouts/EventLayout";

const MeetingManagerComponent = () => {
  const { setRequestList, RequestRef } = useLayoutContect();

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER,
      (user_data) => {
        RequestRef.current.push(user_data);
        setRequestList((pre) => [...pre, user_data]);
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER);
    };
  }, []);

  return <div></div>;
};

export default MeetingManagerComponent;
