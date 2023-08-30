import { ChimesocketListen } from "../../Services/SocketService";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { CHIME_SOCKET_EVENTS } from "../../Services/ServiceConstants";
import { useAuthData } from "../../Shared/Reduxfetcher";
import {
  useLocalVideo,
  useToggleLocalMute,
} from "amazon-chime-sdk-component-library-react";

const ChimeSocketComponent = () => {
  const userData = useAuthData();
  const { muted } = useLocalVideo();
  const { isVideoEnabled } = useToggleLocalMute();

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.CONNECT_SOCKET, () => {
      console.log(ChimesocketListen.connected);
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.CONNECT_SOCKET);
    };
  }, [userData]);

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER,
      (message) => {
        localStorage.removeItem(CHIME_SOCKET_EVENTS.JOIN_REQUEST_FROM_USER);
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
        localStorage.removeItem(CHIME_SOCKET_EVENTS.NEW_USER_JOINED_MEETING);
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
      localStorage.removeItem(CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER);
      setTimeout(() => {
        localStorage.removeItem(CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER);
        localStorage.setItem(
          CHIME_SOCKET_EVENTS.JOIN_REQUEST_ANSWER,
          JSON.stringify(message)
        );
      }, 1000);
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
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_IN_CALL_EVENTS);
    };
  }, [isVideoEnabled, muted]);

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
      localStorage.removeItem(CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER);
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
        localStorage.removeItem(
          CHIME_SOCKET_EVENTS.DISABLE_SHARE_SCREEN_ANSWER
        );
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
        localStorage.removeItem(CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER);
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
      localStorage.removeItem(CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER);
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
        localStorage.removeItem(CHIME_SOCKET_EVENTS.DISABLE_AUDIO_ANSWER);
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
        localStorage.removeItem(CHIME_SOCKET_EVENTS.UPDATE_LAYOUT_ANSWER);
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

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER, (message) => {
      localStorage.removeItem(CHIME_SOCKET_EVENTS.RENAME_USER_ANSWER);
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
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.END_MEETING_ANSWER, (message) => {
      localStorage.removeItem(CHIME_SOCKET_EVENTS.END_MEETING_ANSWER);
      localStorage.setItem(
        CHIME_SOCKET_EVENTS.END_MEETING_ANSWER,
        JSON.stringify(message)
      );
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.END_MEETING_ANSWER);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.KICK_USER_ANSWER, (message) => {
      localStorage.removeItem(CHIME_SOCKET_EVENTS.KICK_USER_ANSWER);
      localStorage.setItem(
        CHIME_SOCKET_EVENTS.KICK_USER_ANSWER,
        JSON.stringify(message)
      );
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.KICK_USER_ANSWER);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG, (message) => {
      localStorage.removeItem(CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG);
      localStorage.setItem(
        CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG,
        JSON.stringify(message)
      );
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.MEETING_ROOM_MSG);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.SINGLE_USER_MSG, (message) => {
      localStorage.removeItem(CHIME_SOCKET_EVENTS.SINGLE_USER_MSG);
      localStorage.setItem(
        CHIME_SOCKET_EVENTS.SINGLE_USER_MSG,
        JSON.stringify(message)
      );
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.SINGLE_USER_MSG);
    };
  }, []);

  useEffect(() => {
    ChimesocketListen.on(
      CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER,
      (message) => {
        localStorage.removeItem(CHIME_SOCKET_EVENTS.ENABLE_SHARE_SCREEN_ANSWER);
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
      localStorage.removeItem(CHIME_SOCKET_EVENTS.ENABLE_AUDIO_ANSWER);
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
    ChimesocketListen.on(CHIME_SOCKET_EVENTS.ENABLE_VIDEO_ANSWER, (message) => {
      localStorage.removeItem(CHIME_SOCKET_EVENTS.ENABLE_VIDEO_ANSWER);
      localStorage.setItem(
        CHIME_SOCKET_EVENTS.ENABLE_VIDEO_ANSWER,
        JSON.stringify(message)
      );
    });
    return () => {
      ChimesocketListen.off(CHIME_SOCKET_EVENTS.ENABLE_VIDEO_ANSWER);
    };
  }, []);

  return <Outlet />;
};

export default ChimeSocketComponent;
