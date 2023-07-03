import {
  ListChannelMessagesCommand,
  SendChannelMessageCommand,
  UpdateChannelMessageCommand,
} from "@aws-sdk/client-chime-sdk-messaging";
import { chimeClient } from "./MessageService";

export async function listChannelMessages(
  channelArn,
  userId,
  subChannelId = null,
  nextToken = null
) {
  const params = {
    ChannelArn: channelArn,
    NextToken: nextToken,
    ChimeBearer: userId,
    SubChannelId: subChannelId,
  };
  const command = new ListChannelMessagesCommand(params);
  const response = await chimeClient.send(command);

  const messageList = response.ChannelMessages;
  return messageList.sort(function (a, b) {
    return a.CreatedTimestamp < b.CreatedTimestamp
      ? -1
      : a.CreatedTimestamp > b.CreatedTimestamp
      ? 1
      : 0;
  });
}

export async function sendChannelMessage(params) {
  const command = new SendChannelMessageCommand(params);
  const response = await chimeClient.send(command);
  return response;
}

export async function updateChannelMessage(params) {
  const command = new UpdateChannelMessageCommand(params);
  const response = await chimeClient.send(command);
  return response;
}
