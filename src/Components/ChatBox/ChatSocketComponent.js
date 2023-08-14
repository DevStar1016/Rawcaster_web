import React, { useEffect } from "react";
import {
  closeChimeMessaging,
  subscribeToMessageUpdate,
  unsubscribeFromMessageUpdate,
} from "../../Services/Messaging/MessageService";
import { useChatContext } from "../../Shared/Context";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { listChannelMessages } from "../../Services/Messaging/MessageAPIList";
import moment from "moment";

const ChatSocketComponent = () => {
  const {
    setMessages,
    convertMessageFormat,
    GroupDetails,
    setisTyping,
    isTyping,
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

  const listAllMessages = () => {
    listChannelMessages(GroupDetails?.channel_arn, userData.chime_user_id)
      .then((res) => {
        const finalResult = res.map((ele) => {
          const timestamp = ele.LastEditedTimestamp
            ? ele.LastEditedTimestamp
            : ele.CreatedTimestamp;

          const getvalidFileData = () => {
            if (ele.Metadata) {
              const finalData = JSON.parse(ele.Metadata);
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
          return {
            ...convertMessageFormat({
              ...getvalidFileData(),
              isEdited: ele.LastEditedTimestamp !== undefined,
              message_id: ele.MessageId,

              message: ele.Content,

              user_name: "me",
              user: ele.Sender.Arn,
              created_at: moment(ele.CreatedTimestamp).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
            }),
          };
        });
        setMessages(finalResult.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const messagesProcessor = async (message) => {
    const messageType = message?.headers["x-amz-chime-event-type"];
    const record = JSON.parse(message?.payload);
    console.log(record, messageType);
    switch (messageType) {
      case "CREATE_CHANNEL_MESSAGE":
        if (record.Sender.Arn !== userData.chime_user_id) {
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
      case "PENDING_UPDATE_CHANNEL_MESSAGE":
        if (record.Content && record.Content.match(/Typing/)) {
          if (record.Sender.Arn !== userData.chime_user_id) {
            if (GroupDetails.channel_arn === record?.ChannelArn) {
              const indicator = {
                SenderName: record.Sender.Name,
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
    if (!userData) return;
    subscribeToMessageUpdate(messagesProcessor);

    // return () => {
    //   closeChimeMessaging();
    //   unsubscribeFromMessageUpdate(messagesProcessor);
    // };
  }, [userData]);

  useEffect(() => {
    if (GroupDetails) {
      listAllMessages();
    }
  }, [GroupDetails]);
  return <div></div>;
};

export default ChatSocketComponent;
