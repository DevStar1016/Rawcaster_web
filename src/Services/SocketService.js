import { io } from "socket.io-client";
import { socketURL } from "./ServiceConstants";

const socket = io(socketURL);

const ConnectSocket = (props) => {
  if (props.user_id !== "") {
    console.log(props);
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
