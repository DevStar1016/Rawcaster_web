import {
  DeleteChannelMessageCommand,
  SendChannelMessageCommand,
} from "@aws-sdk/client-chime-sdk-messaging";
import { chimeClient } from "./MessageService";

// Chat

export async function sendChannelMessage(params) {
  const command = new SendChannelMessageCommand(params);
  const response = await chimeClient.send(command);
  return response;
}

export async function deleteChannelMessage(params) {
  const command = new DeleteChannelMessageCommand(params);
  const response = await chimeClient.send(command);
  return response;
}
