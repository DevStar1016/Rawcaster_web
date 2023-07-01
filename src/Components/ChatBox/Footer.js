import React, { useEffect, useState } from "react";
import classes from "./ChatBox.module.css";
import { Layout } from "antd";
import { ChatInput } from "../../Sharedcomponents/Chat/utility";
import { useChatContext } from "../../Shared/Context";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { SendMessageService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import { sendChannelMessage } from "../../Services/Messaging/MessageAPIList";
import { debounce } from "lodash";

const Footer = () => {
  const token = useAuthToken();
  const userData = useAuthData();
  const [text, settext] = useState("");
  const { setMessages, convertMessageFormat, setPreviewData, GroupDetails } =
    useChatContext();

  const sendMessage = (val, params = {}) => {
    let data = {
      ...params,
      Type: "STANDARD",
      Persistence: "PERSISTENT",
      ChannelArn: GroupDetails?.group_arn,
      ChimeBearer: userData.chime_user_id,
      Content: val,
    };
    sendChannelMessage(data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const eventHandler = async () => {
    const content = JSON.stringify({ Typing: "Indicator" });

    const params = {
      ChannelArn: GroupDetails?.group_arn,
      Content: content,
      Type: "CONTROL",
      Persistence: "NON_PERSISTENT",
      ChimeBearer: userData.chime_user_id,
    };
    sendChannelMessage(params)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const eventHandlerWithDebounce = React.useCallback(
    debounce(eventHandler, 500),
    []
  );

  useEffect(() => {
    if (text) {
      eventHandlerWithDebounce();
    }
  }, [text]);

  return (
    <Layout.Footer className={classes.footerSec}>
      <ChatInput
        onInput={(val) => {
          settext(val);
        }}
        HandleSendMessage={(val) => {
          sendMessage(val);
          setMessages((pre) => [
            ...pre,
            {
              ...convertMessageFormat({
                type: "text",
                message: val,
                user_name: "me",
                user: userData.chime_user_id,
              }),
            },
          ]);
        }}
        cameraenabled
        fileuploadEnabled
        onFileResult={(val, isCapture = false) => {
          setPreviewData({
            File: val,
            display_type: isCapture ? val.type : "doc",
          });
        }}
        onAudioResult={(val) => {
          const metaData = {
            Metadata: { file: val.message, type: "audio" },
          };
          sendMessage(val, metaData);
          setMessages((pre) => [
            ...pre,
            {
              ...convertMessageFormat({
                type: "audio",
                message: "",
                user_name: "me",
                user: userData.chime_user_id,
                file_path: val.message,
              }),
            },
          ]);
        }}
      />
    </Layout.Footer>
  );
};

export default Footer;
