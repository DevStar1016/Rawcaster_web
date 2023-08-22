import { io } from "socket.io-client";
import { ChimesocketURL, socketURL } from "./ServiceConstants";

// Default Socket Service

const socket = io(socketURL, {
  transports: ["websocket"],
  secure: false,
  reconnection: true,
  rejectUnauthorized: false,
});

const ConnectSocket = (props) => {
  if (props && props.user_id !== "") {
    sendMessage({
      event: "userdata",
      userid: props.user_id,
      status: 1,
      login_in: 1,
    });
  }
};

export default ConnectSocket;

export const socketListen = socket;

export const sendMessage = (data, type = "message") => {
  socket.emit(type, data);
};

// Amazon Chime Socket

const Chimesocket = io(ChimesocketURL, {
  reconnection: true,
  secure: false,
  transports: ["websocket"],
  rejectUnauthorized: false,
});

export const ChimesocketListen = Chimesocket;

export const ChimesendMessage = (data, type = "message") => {
  console.log(type, data, "chime_send_message");
  Chimesocket.emit(type, data, () => {
    console.log("Message Emitted");
  });
};
