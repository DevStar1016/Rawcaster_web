import React, { useEffect, useState } from "react";
import classes from "./ChatBox.module.css";
import { Layout } from "antd";
import { ChatInput, ChatInputBox } from "../../Sharedcomponents/Chat/utility";
import { useChatContext } from "../../Shared/Context";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { SendMessageService } from "../../Services/ApiService";
import { JSONtoformdata, filterValidObject } from "../../Shared/Utility";
import {
  sendChannelMessage,
  updateChannelMessage,
} from "../../Services/Messaging/MessageAPIList";
import { debounce } from "lodash";
import moment from "moment";

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

  const sendMessage = (val, params = {}) => {
    let data = {
      ...params,
      Type: "STANDARD",
      Persistence: "PERSISTENT",
      ChannelArn: GroupDetails?.channel_arn,
      ChimeBearer: userData.chime_user_id,
      Content: val,
    };
    sendChannelMessage(filterValidObject(data))
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const editMessage = (val) => {
    const params = {
      ChannelArn: GroupDetails?.channel_arn,
      MessageId: EditData?.message_id,
      Content: val,
      ChimeBearer: userData.chime_user_id,
    };
    updateChannelMessage(params)
      .then((res) => {
        console.log(res);
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
      .catch((err) => {
        console.log(err);
      });
  };

  const eventHandler = async () => {
    const content = JSON.stringify({ Typing: "Indicator" });

    const params = {
      ChannelArn: GroupDetails?.channel_arn,
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
        value={EditData?.msg || ""}
        onInput={(val) => {
          settext(val);
        }}
        isEdit={EditData}
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
        onEdit={(val) => {
          editMessage(val);
        }}
        cameraenabled
        fileuploadEnabled
        onCameraResult={(val) => {
          setPreviewData({
            File: val,
            display_type: val.type,
          });
        }}
        onEditClose={() => {
          setEditData(null);
        }}
        onFileResult={(val, isCapture = false) => {
          setPreviewData({
            File: val,
            display_type: isCapture ? val.type : "doc",
          });
        }}
        onAudioResult={(val) => {
          const metaData = {
            Metadata: JSON.stringify({
              file: val.message,
              type: "audio",
              web_file: val.file,
            }),
          };
          sendMessage("null", metaData);
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
