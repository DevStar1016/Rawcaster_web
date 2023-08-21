import { useEffect } from "react";
import { subscribeToMessageUpdate } from "../../Services/Messaging/MessageService";
import { useChatContext } from "../../Shared/Context";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";

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

  useEffect(() => {
    if (isTyping) {
      (async function x() {
        setTimeout(() => {
          setisTyping(null);
        }, 3000);
      })();
    }
  }, [isTyping]);

  function isJSONString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }

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

  useEffect(() => {
    if (!userData || !GroupDetails) return;
    subscribeToMessageUpdate(messagesProcessor);
  }, [userData, GroupDetails]);

  useEffect(() => {
    if (GroupDetails) {
      listAllMessages();
    }
  }, [GroupDetails]);
  return <div></div>;
};

export default ChatSocketComponent;
