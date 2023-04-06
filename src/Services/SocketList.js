import { SOCKET_EVENTS } from "./ServiceConstants";
import { sendMessage } from "./SocketService";

export const friendRequestSocket = (user_id, data) => {
  const socketMes = {
    event: SOCKET_EVENTS.FRIEND_REQUEST,
    receiverId: parseInt(user_id),
    data: data,
  };
  sendMessage(socketMes, "message");
};
