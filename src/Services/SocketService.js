/**
 * Connects to a socket server using the provided URL and options.
 * @param {object} props - The props object containing the user ID.
 * @returns None
 */
import { io } from "socket.io-client";
import { ChimesocketURL } from "./ServiceConstants";

// Chime Socket

/**
 * Creates a Chimesocket connection using the provided ChimesocketURL and options.
 * @param {string} ChimesocketURL - The URL of the Chimesocket server.
 * @param {object} options - The options for the Chimesocket connection.
 * @returns None
 */
const Chimesocket = io(ChimesocketURL, {
  reconnection: true,
  secure: true,
  transports: ["websocket"],
  rejectUnauthorized: false,
});

export const ChimesocketListen = Chimesocket;

export const ChimesendMessage = (data, type = "message") => {
  Chimesocket.emit(type, data, () => {
    console.log("Message Emitted");
  });
};
