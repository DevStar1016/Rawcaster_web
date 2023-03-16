import { io } from "socket.io-client";
import { socketURL } from "./ServiceConstants";

const socket = io(socketURL, {
  autoConnect: true,
  reconnection: false,
  transports: ["websocket"],
});

const ConnectSocket = (props) => {
  if (props.user_id !== "") {
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
  console.log(data, type);

  socket.emit("hello", "world", (val) => {
    console.log(val);
  });
};
