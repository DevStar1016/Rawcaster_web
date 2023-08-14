import {
  CreateChannelMembershipCommand,
  DeleteChannelMessageCommand,
  ListChannelMessagesCommand,
  SendChannelMessageCommand,
  UpdateChannelMessageCommand,
} from "@aws-sdk/client-chime-sdk-messaging";
import { chimeClient } from "./MessageService";
import {
  CreateAttendeeCommand,
  CreateMeetingCommand,
  GetMeetingCommand,
} from "@aws-sdk/client-chime-sdk-meetings";

// Chat

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
  console.log(params, "params");

  const command = new ListChannelMessagesCommand(params);
  const response = await chimeClient.send(command);

  const messageList = response.ChannelMessages;
  console.log(messageList);
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

export async function deleteChannelMessage(params) {
  const command = new DeleteChannelMessageCommand(params);
  const response = await chimeClient.send(command);
  return response;
}

// Testing

export async function AddmemberToChannel(params) {
  const command = new CreateChannelMembershipCommand(params);
  const response = await chimeClient.send(command);
  return response;
}
