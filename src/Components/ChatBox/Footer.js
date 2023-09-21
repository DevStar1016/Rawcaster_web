/**
 * A React functional component that represents the footer section of a chat box.
 * It provides functionality for sending and editing messages, as well as handling
 * various input events such as typing indicators and file uploads.
 * @returns The rendered JSX element representing the footer section of the chat box.
 */
import React, { useEffect, useState } from "react";
import classes from "./ChatBox.module.css";
import { Layout } from "antd";
import { ChatInput } from "../../Sharedcomponents/Chat/utility";
import { useChatContext } from "../../Shared/Context";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  SendChannelMessageService,
  UpdateChannelMessageService,
} from "../../Services/ApiService";
import { JSONtoformdata, filterValidObject } from "../../Shared/Utility";

import { debounce } from "lodash";

const Footer = () => {
  const token = useAuthToken();
  const userData = useAuthData();
  const [text, settext] = useState("");
  const {
    setMessages,
    convertMessageFormat,
    setPreviewData,
    GroupDetails,
    EditData,
    setEditData,
  } = useChatContext();

  const isOwner = () => {
    return (
      GroupDetails && parseInt(GroupDetails?.group_owner) === userData?.user_id
    );
  };

  /**
   * Sends a message to a channel using the SendChannelMessageService.
   * @param {any} val - The message to send.
   * @param {object} [params={}] - Additional parameters for sending the message.
   * @returns None
   */
  const sendMessage = (val, params = {}) => {
    const send_message_params = {
      token,
      channel_id: GroupDetails?.channel_arn,
      message: val,
      ...params,
    };
    SendChannelMessageService(
      JSONtoformdata(filterValidObject(send_message_params))
    )
      .then((res) => {})
      .catch((err) => {});
  };

  /**
   * Edits a message in a channel by updating the message content with the provided value.
   * @param {string} val - The new value for the message.
   * @returns None
   */
  const editMessage = (val) => {
    const update_message_params = {
      token,
      channel_id: GroupDetails?.channel_arn,
      message_id: EditData?.message_id,
      message: val,
    };

    UpdateChannelMessageService(JSONtoformdata(update_message_params))
      .then((res) => {
        setMessages((pre) => {
          let findIndex = pre.findIndex(
            (ele) => ele.message_id === EditData?.message_id
          );
          let tempData = [...pre];
          tempData[findIndex] = {
            ...tempData[findIndex],
            message: val,
            isEdited: true,
          };
          return tempData;
        });
        setEditData(null);
      })
      .catch((err) => {});
  };

  /**
   * Event handler function that sends a channel message with a typing indicator
   * to the specified group.
   * @returns None
   */
  const eventHandler = async () => {
    if (GroupDetails) {
      const content = JSON.stringify({ Typing: "Indicator" });

      const send_message_params = {
        token,
        channel_id: GroupDetails?.channel_arn,
        message: content,
      };
      SendChannelMessageService(JSONtoformdata(send_message_params))
        .then((res) => {})
        .catch((err) => {});
    }
  };
  const eventHandlerWithDebounce = React.useCallback(
    debounce(eventHandler, 500),
    [GroupDetails]
  );

  useEffect(() => {
    if (text) {
      eventHandlerWithDebounce();
    }
  }, [text]);

  const isChatEnabled = () => {
    if (GroupDetails && GroupDetails?.group_id) {
      if (GroupDetails && GroupDetails?.my_group === 1) {
        if (GroupDetails?.group_category === 3) {
          return GroupDetails?.chat_enabled === 1 || isOwner();
        } else if (GroupDetails?.group_category === 1) {
          return true;
        }
      }
    } else {
      return true;
    }
  };

  return (
    <Layout.Footer className={classes.footerSec}>
      {isChatEnabled() ? (
        <ChatInput
          value={EditData?.msg || ""}
          onInput={(val) => {
            settext(val);
          }}
          isEdit={EditData}
          HandleSendMessage={(val) => {
            sendMessage(val);
            setMessages((pre) => [
              {
                ...convertMessageFormat({
                  type: "text",
                  message: val,
                  user_name: "me",
                  user: userData.chime_user_id,
                }),
              },
              ...pre,
            ]);
          }}
          onEdit={(val) => {
            editMessage(val);
          }}
          cameraenabled
          fileuploadEnabled
          onCameraResult={(val) => {
            setPreviewData({
              File: val,
              type: val.type,
            });
          }}
          onEditClose={() => {
            setEditData(null);
          }}
          onFileResult={(val, isCapture = false) => {
            setPreviewData({
              File: val,
              type: isCapture ? val.type : "doc",
            });
          }}
          onAudioResult={(val) => {
            const metaData = {
              meta_data: JSON.stringify({
                file: val.message,
                type: "audio",
                web_file: val.file,
              }),
            };
            sendMessage("null", metaData);
            setMessages((pre) => [
              {
                ...convertMessageFormat({
                  type: "audio",
                  message: "",
                  user_name: "me",
                  user: userData.chime_user_id,
                  file_path: val.message,
                }),
              },
              ...pre,
            ]);
          }}
        />
      ) : (
        <div className={classes.DisabledSec}>
          {GroupDetails?.group_category === 2 ? (
            <p>Send Messages not allowed in this Group</p>
          ) : (
            <p>Chat Has Been Disabled By Owner</p>
          )}
        </div>
      )}
    </Layout.Footer>
  );
};

export default Footer;
