import React from "react";
import { ChimeSDKMessagingClient } from "@aws-sdk/client-chime-sdk-messaging";
import {
  LogLevel,
  ConsoleLogger,
  DefaultMessagingSession,
  MessagingSessionConfiguration,
} from "amazon-chime-sdk-js";
import { ChimeSDKMeetingsClient } from "@aws-sdk/client-chime-sdk-meetings";

let Session = null;
const logger = new ConsoleLogger("SDK Chat Demo", LogLevel.INFO);
let messageUpdateCallbacks = [];

export const chimeClient = new ChimeSDKMessagingClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: "AKIAYFYE6EFYG6RJOPMF",
    secretAccessKey: "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",
  },
});

export const chimemeetingClient = new ChimeSDKMeetingsClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: "AKIAYFYE6EFYG6RJOPMF",
    secretAccessKey: "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",
  },
});

function generateUniqueID() {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 10000);
  const uniqueID = timestamp + randomNum.toString();

  return uniqueID;
}

export const subscribeToMessageUpdate = (callback) => {
  console.log("Message listener subscribed!");
  messageUpdateCallbacks.push(callback);
};

export const unsubscribeFromMessageUpdate = (callback) => {
  const index = messageUpdateCallbacks.indexOf(callback);
  if (index !== -1) {
    messageUpdateCallbacks.splice(index, 1);
  }
};

export const publishMessageUpdate = (message) => {
  console.log(`Sending message update to listeners!`);
  for (let i = 0; i < messageUpdateCallbacks.length; i += 1) {
    const callback = messageUpdateCallbacks[i];
    callback(message);
  }
};

const messageObserver = {
  messagingSessionDidStart: () => {
    console.log("Messaging Connection started!");
  },
  messagingSessionDidStartConnecting: (reconnecting) => {
    console.log("Messaging Connection connecting");
  },
  messagingSessionDidStop: (event) => {
    console.log("Messaging Connection received DidStop event");
  },
  messagingSessionDidReceiveMessage: (message) => {
    console.log("Messaging Connection received message");
    publishMessageUpdate(message);
  },
};

export const connectChimeMessaging = (member) => {
  const sessionConfig = new MessagingSessionConfiguration(
    member.userId,
    generateUniqueID(),
    "node001.ue1.ws-messaging.chime.aws",
    chimeClient
  );
  Session = new DefaultMessagingSession(sessionConfig, logger);
  Session.addObserver(messageObserver);
  Session.start();
};

export const closeChimeMessaging = () => {
  try {
    Session.stop();
  } catch (err) {
    console.error("Failed to stop Messaging Session.");
  }
};
