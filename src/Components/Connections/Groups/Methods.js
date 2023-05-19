import { sendMessage } from "../../../Services/SocketService";
import { GROUP_CHAT_PROCESS_TYPE } from "./Constants";

export const groupFunctionalitySocket = (values) => {
  const socketMessage = {
    event: "groupchatmsgtransfer",
    ...values,
  };
  sendMessage(socketMessage, "groupchatting");
};
