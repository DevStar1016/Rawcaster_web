import { sendMessage } from "../../../Services/SocketService";

export const groupFunctionalitySocket = (values) => {
  const socketMessage = {
    event: "groupchatmsgtransfer",
    ...values,
  };
  sendMessage(socketMessage, "groupchatting");
};
