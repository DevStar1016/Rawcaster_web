import {
  DeleteChannelMessageCommand,
  SendChannelMessageCommand,
} from "@aws-sdk/client-chime-sdk-messaging";
import { chimeClient } from "./MessageService";

// Chat

/**
 * Sends a channel message using the provided parameters.
 * @param {Object} params - The parameters for sending the channel message.
 * @returns {Promise<Object>} - A promise that resolves to the response of the channel message.
 */
export async function sendChannelMessage(params) {
  const command = new SendChannelMessageCommand(params);
  const response = await chimeClient.send(command);
  return response;
}

/**
 * Deletes a message from a channel.
 * @param {Object} params - The parameters for deleting the message.
 * @returns {Promise<Object>} - A promise that resolves to the response from the server.
 */
export async function deleteChannelMessage(params) {
  const command = new DeleteChannelMessageCommand(params);
  const response = await chimeClient.send(command);
  return response;
}
