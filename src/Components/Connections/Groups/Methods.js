/**
 * Sends a socket message for group chat functionality.
 * @param {object} values - The values to include in the socket message.
 * @returns None
 */
import { sendMessage } from "../../../Services/SocketService";

export const groupFunctionalitySocket = (values) => {
  const socketMessage = {
    event: "groupchatmsgtransfer",
    ...values,
  };
  sendMessage(socketMessage, "groupchatting");
};
