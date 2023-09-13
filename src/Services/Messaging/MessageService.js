/**
 * Module for connecting to and managing Chime messaging.
 * @module ChimeMessaging
 */
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

/**
 * Creates a new ChimeSDKMessagingClient instance for interacting with the Amazon Chime SDK Messaging service.
 * @returns {ChimeSDKMessagingClient} - The ChimeSDKMessagingClient instance.
 */
export const chimeClient = new ChimeSDKMessagingClient({
  region: CHIME_REGION,
  credentials: {
    accessKeyId: CHIME_MESSAGING_ACCESS_KEY_ID,
    secretAccessKey: CHIME_MESSAGING_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a unique ID by combining the current timestamp and a random number.
 * @returns {string} - A unique ID string.
 */
function generateUniqueID() {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 10000);
  const uniqueID = timestamp + randomNum.toString();

  return uniqueID;
}

/**
 * Subscribes a callback function to be called whenever a message update occurs.
 * @param {Function} callback - The callback function to be called on message update.
 * @returns None
 */
export const subscribeToMessageUpdate = (callback) => {
  messageUpdateCallbacks.push(callback);
};

/**
 * Unsubscribes a callback function from the message update event.
 * @param {Function} callback - The callback function to unsubscribe.
 * @returns None
 */
export const unsubscribeFromMessageUpdate = (callback) => {
  const index = messageUpdateCallbacks.indexOf(callback);
  if (index !== -1) {
    messageUpdateCallbacks.splice(index, 1);
  }
};

/**
 * Publishes a message update to all registered listeners.
 * @param {any} message - The message to send to the listeners.
 * @returns None
 */
export const publishMessageUpdate = (message) => {
  console.log(`Sending message update to listeners!`);
  for (let i = 0; i < messageUpdateCallbacks.length; i += 1) {
    const callback = messageUpdateCallbacks[i];
    callback(message);
  }
};

/**
 * An object that contains callback functions for various messaging session events.
 * @property {Function} messagingSessionDidStart - Callback function called when the messaging session starts.
 * @property {Function} messagingSessionDidStartConnecting - Callback function called when the messaging session starts connecting.
 * @param {boolean} reconnecting - Indicates whether the session is reconnecting.
 * @property {Function} messagingSessionDidStop - Callback function called when the messaging session stops.
 * @param {Event} event - The event object associated with the session stop event.
 * @property {Function} messagingSessionDidReceiveMessage - Callback function called when a message is received in the messaging session.
 * @param {Message} message - The received message object.
 */
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

/**
 * Connects a member to the Chime messaging service.
 * @param {Object} member - The member object containing user information.
 * @returns None
 */
export const connectChimeMessaging = (member) => {
  try {
    const sessionConfig = new MessagingSessionConfiguration(
      member.userId,
      generateUniqueID(),
      "node001.ue1.ws-messaging.chime.aws",
      chimeClient
    );

    Session = new DefaultMessagingSession(sessionConfig, logger);
    Session.addObserver(messageObserver);
    Session.start()
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log("Failed to stop Messaging Session.", error);
  }
};

/**
 * Closes the Chime messaging session.
 * @returns None
 */
export const closeChimeMessaging = () => {
  try {
    Session.stop();
  } catch (err) {
    console.error("Failed to stop Messaging Session.");
  }
};
