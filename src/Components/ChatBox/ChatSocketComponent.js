/**
 * A React component that handles the WebSocket connection for chat functionality.
 * It subscribes to message updates and processes incoming messages based on their type.
 * @returns A React component that renders an empty div.
 */
import { useEffect } from "react";
import { subscribeToMessageUpdate } from "../../Services/Messaging/MessageService";
import { useChatContext } from "../../Shared/Context";
import { useAuthData } from "../../Shared/Reduxfetcher";

const ChatSocketComponent = () => {
  const {
    setMessages,
    convertMessageFormat,
    GroupDetails,
    setisTyping,
    isTyping,
    listAllMessages,
  } = useChatContext();
  const userData = useAuthData();

  /**
   * Executes a side effect when the value of `isTyping` changes.
   * If `isTyping` is true, it sets a timeout to set `isTyping` to null after 3000 milliseconds.
   * @param {boolean} isTyping - The value indicating whether the user is typing or not.
   * @returns None
   */
  useEffect(() => {
    if (isTyping) {
      (async function x() {
        setTimeout(() => {
          setisTyping(null);
        }, 3000);
      })();
    }
  }, [isTyping]);

  /**
   * Checks if a given string is a valid JSON string.
   * @param {string} str - The string to check.
   * @returns {boolean} - True if the string is a valid JSON string, false otherwise.
   */
  function isJSONString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Processes a message received from a messaging system.
   * @param {object} message - The message object received.
   * @returns None
   */
  const messagesProcessor = async (message) => {
    const messageType = message?.headers["x-amz-chime-event-type"];
    const record = JSON.parse(message?.payload);
    switch (messageType) {
      case "CREATE_CHANNEL_MESSAGE":
        if (record.Sender.Arn !== userData.chime_user_id) {
          if (isJSONString(record.Content)) {
            const findSender = GroupDetails?.group_members_list.find(
              (ele) => ele.member_arn === record.Sender.Arn
            );
            const indicator = {
              SenderName: findSender
                ? findSender.display_name
                : record.Sender.Name,
              LastUpdatedTimestamp: record.LastUpdatedTimestamp,
            };
            setisTyping(indicator);
          } else {
            const getvalidFileData = () => {
              if (record.Metadata) {
                const finalData = JSON.parse(record.Metadata);
                return {
                  type: finalData.type,
                  file_path: finalData.file,
                  file: finalData?.web_file,
                };
              } else {
                return {
                  type: "text",
                };
              }
            };
            setMessages((pre) => [
              ...pre,
              {
                ...convertMessageFormat({
                  ...getvalidFileData(),
                  message: record.Content,
                  user_name: "Other",
                  user: record.Sender.Arn,
                }),
              },
            ]);
          }
        }
      case "PENDING_UPDATE_CHANNEL_MESSAGE":
        if (record.Content && record.Content.match(/Typing/)) {
          if (record.Sender.Arn !== userData.chime_user_id) {
            if (
              GroupDetails &&
              GroupDetails.channel_arn === record?.ChannelArn
            ) {
              const findSender = GroupDetails?.group_members_list.find(
                (ele) => ele.member_arn === record.Sender.Arn
              );
              const indicator = {
                SenderName: findSender
                  ? findSender.display_name
                  : record.Sender.Name,
                LastUpdatedTimestamp: record.LastUpdatedTimestamp,
              };
              setisTyping(indicator);
            }
            break;
          }
        }
    }
  };

  /**
   * useEffect hook that subscribes to message updates when userData and GroupDetails are both truthy.
   * @param {Function} messagesProcessor - The function to be called when a message update occurs.
   * @returns None
   */
  useEffect(() => {
    if (!userData || !GroupDetails) return;
    subscribeToMessageUpdate(messagesProcessor);
  }, [userData, GroupDetails]);

  /**
   * Executes the `listAllMessages` function when the `GroupDetails` variable changes.
   * @returns None
   */
  useEffect(() => {
    if (GroupDetails) {
      listAllMessages();
    }
  }, [GroupDetails]);
  return <div></div>;
};

export default ChatSocketComponent;
