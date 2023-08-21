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

  const sendMessage = (val, params = {}) => {
    const send_message_params = {
      token,
      channel_id: GroupDetails?.channel_arn,
      message: val,
    };
    SendChannelMessageService(
      JSONtoformdata(filterValidObject(send_message_params))
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      .catch((err) => {
        console.log(err);
      });
  };

  const eventHandler = async () => {
    if (GroupDetails) {
      const content = JSON.stringify({ Typing: "Indicator" });

      const send_message_params = {
        token,
        channel_id: GroupDetails?.channel_arn,
        message: content,
      };
      SendChannelMessageService(JSONtoformdata(send_message_params))
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
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
            meta_data: JSON.stringify({
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
