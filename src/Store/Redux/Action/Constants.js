export const MiddlewareType = {
  SOCKET_CONNECT: { type: "socket/connect" },
  SOCKET_DISCONNECT: { type: "socket/disconnect" },
};

export const MiddlewareListenerType = {
  SOCKET_CONNECT: "connect",
  SOCKET_CONNECT_ERROR: "socket/error",
  SOCKET_DISCONNECT: "socket/disconnect",
};
