import { sendMessage } from "./SocketService";

export const friendRequestSocket = (user_id, data) => {
  const socketMes = {
    event: "friendrequest",
    receiverId: parseInt(user_id),
    data: data,
  };
  sendMessage(socketMes, "message");
};
