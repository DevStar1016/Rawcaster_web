/**
 * Connects to a socket server using the provided URL and options.
 * @param {object} props - The props object containing the user ID.
 * @returns None
 */
import { io } from "socket.io-client";

// Chime Socket

/**
 * Creates a Chimesocket connection using the provided REACT_APP_SOCKET_URL and options.
 * @param {string} process.env.REACT_APP_SOCKET_URL - The URL of the Chimesocket server.
 * @param {object} options - The options for the Chimesocket connection.
 * @returns None
 */
const Chimesocket = io(process.env.REACT_APP_SOCKET_URL, {
  reconnection: true,
  secure: true,
  // transports: ["websocket"],
  rejectUnauthorized: false,
});

export const ChimesocketListen = Chimesocket;

export const ChimesendMessage = (data, type = "message") => {
  Chimesocket.emit(type, data, () => {
    console.log("Message Emitted");
  });
};
