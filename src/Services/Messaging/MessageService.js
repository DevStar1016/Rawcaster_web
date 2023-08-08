import { ChimeSDKMessagingClient } from "@aws-sdk/client-chime-sdk-messaging";
import {
  LogLevel,
  ConsoleLogger,
  DefaultMessagingSession,
  MessagingSessionConfiguration,
} from "amazon-chime-sdk-js";
import {
  CHIME_MESSAGING_ACCESS_KEY_ID,
  CHIME_MESSAGING_SECRET_ACCESS_KEY,
  CHIME_REGION,
} from "../APIkeyID";

let Session = null;
const logger = new ConsoleLogger("RAWCASTER MESSAGING:", LogLevel.INFO);
let messageUpdateCallbacks = [];

export const chimeClient = new ChimeSDKMessagingClient({
  region: CHIME_REGION,
  credentials: {
    accessKeyId: CHIME_MESSAGING_ACCESS_KEY_ID,
    secretAccessKey: CHIME_MESSAGING_SECRET_ACCESS_KEY,
  },
});

function generateUniqueID() {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 10000);
  const uniqueID = timestamp + randomNum.toString();

  return uniqueID;
}

export const subscribeToMessageUpdate = (callback) => {
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
