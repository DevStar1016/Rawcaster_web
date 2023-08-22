import {
  ChimesendMessage,
  ChimesocketListen,
} from "../../Services/SocketService";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { CHIME_SOCKET_EVENTS } from "../../Services/ServiceConstants";
import { useAuthData } from "../../Shared/Reduxfetcher";

const ChimeSocketComponent = () => {
  const userData = useAuthData();

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.CONNECT_SOCKET, () => {
      console.log(ChimesocketListen.connected);
      // if (userData) {
      //   // ChimesendMessage(
      //   //   { userId: userData.user_id },
      //   //   CHIME_SOCKET_EVENTS.JOIN_SOCKET
      //   // );
      // }
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.CONNECT_SOCKET);
    };
  }, [userData]);

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

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING,
      (message) => {
        localStorage.setItem(
          CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING,
          JSON.stringify(message)
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER, (message) => {
      localStorage.setItem(
        CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER,
        JSON.stringify(message)
      );
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS,
      (message) => {
        localStorage.removeItem(CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS);
        localStorage.setItem(
          CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS,
          JSON.stringify(message)
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND, (message) => {
      localStorage.removeItem(CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND);
      localStorage.setItem(
        CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND,
        JSON.stringify(message)
      );
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_RAISE_HAND);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER, (message) => {
      localStorage.setItem(
        CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER,
        JSON.stringify(message)
      );
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.DISABLE_SHARE_SCREEN_ANSWER,
      (message) => {
        localStorage.setItem(
          CHIME_SOCKET_EVENTS.DISABLE_SHARE_SCREEN_ANSWER,
          JSON.stringify(message)
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.DISABLE_SHARE_SCREEN_ANSWER);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER,
      (message) => {
        localStorage.setItem(
          CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER,
          JSON.stringify(message)
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER, (message) => {
      localStorage.setItem(
        CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER,
        JSON.stringify(message)
      );
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.DISABLE_AUDIO_ANSWER,
      (message) => {
        localStorage.setItem(
          CHIME_SOCKET_EVENTS.DISABLE_AUDIO_ANSWER,
          JSON.stringify(message)
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.DISABLE_AUDIO_ANSWER);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER,
      (message) => {
        localStorage.setItem(
          CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER,
          JSON.stringify(message)
        );
      }
    );
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER);
    };
  }, []);

  return <Outlet />;
};

export default ChimeSocketComponent;
