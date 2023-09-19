/**
 * A React component that represents a sticky popup for a chat box.
 * @param {Object} HeaderContainer - The component to render as the header of the popup.
 * @param {boolean} open - Determines whether the popup is open or closed.
 * @param {function} close - A function to close the popup.
 * @returns The StickyPopup component.
 */
import React, { useEffect, useState } from "react";
import classes from "./Stickypopup.module.css";
import { Drawer, Layout } from "antd";
import Footer from "../../Components/ChatBox/Footer";
import Content from "../../Components/ChatBox/Group/Content";
import { ChatContext } from "../../Shared/Context";
import moment from "moment";
import PreviewFile from "../../Components/ChatBox/Preview/PreviewFile";
import ChatSocketComponent from "../../Components/ChatBox/ChatSocketComponent";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  ListChannelMsgService,
  uploadChatAttachmentService,
} from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import ConfigureGroup from "../../Components/Connections/Groups/ConfigureGroup";
import { isDesktop, isMobile } from "react-device-detect";

const StickyPopup = ({ HeaderContainer, open, close }) => {
  const token = useAuthToken();
  const userData = useAuthData();
  const [isHidden, setisHidden] = useState(false);
  const [Messages, setMessages] = useState([]);
  const [messageNextToken, setmessageNextToken] = useState(null);
  const [GroupDetails, setGroupDetails] = useState(null);
  const [PreviewData, setPreviewData] = useState(null);
  const [isTyping, setisTyping] = useState(null);
  const [EditData, setEditData] = useState(null);
  const [SelectedContents, setSelectedContents] = useState([]);
  const [SelectAllMessages, setSelectAllMessages] = useState(false);
  const [receiverMessage, setreceiverMessage] = useState([]);
  const [isConfigureGroup, setisConfigureGroup] = useState({
    show: false,
    group_id: null,
  });

  useEffect(() => {
    setTimeout(() => {
      setisHidden(!open);
    }, 500);
  }, [open]);

  /**
   * Converts a message format object to a standardized format.
   * @param {Object} messageFormat - The message format object to convert.
   * @param {string} messageFormat.type - The type of the message.
   * @param {string} messageFormat.message - The content of the message.
   * @param {string} messageFormat.user_name - The name of the user who sent the message.
   * @param {string} messageFormat.user - The ID of the user who sent the message.
   * @param {string | null} [messageFormat.file_path=null] - The file path associated with the message.
   * @param {string | null} [messageFormat.created_at=null] - The timestamp of when the message was created.
   */
  const convertMessageFormat = ({
    type,
    message,
    user_name,
    user,
    file_path = null,
    created_at = null,
    isEdited = false,
    ...rest
  }) => {
    return {
      type,
      message,
      created_at: created_at
        ? created_at
        : moment().format("YYYY-MM-DD HH:mm:ss"),
      isEdited,
      file_path,
      user_name,
      user,
      ...rest,
    };
  };

  /**
   * Converts a file to a URL and uploads it as a chat attachment.
   * @param {File} file - The file to convert and upload.
   * @returns {Promise<Object>} A promise that resolves to an object containing the original file and the file path of the uploaded file.
   * @throws {Error} If there is an error uploading the file.
   */
  const convertUrlToFile = (file) => {
    return new Promise((resolve, reject) => {
      const uniqueId =
        userData.user_id +
        "" +
        moment.utc().format("x") +
        "" +
        Math.floor(Math.random() * 10000 + 1);
      let chatattachmentData = {
        token: token,
        refid: uniqueId,
        chatattachment: file,
      };
      uploadChatAttachmentService(JSONtoformdata(chatattachmentData))
        .then((res) => {
          setPreviewData();
          resolve({
            file,
            file_path: res.data.filepath,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

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
   * Retrieves all messages from a channel and formats them into a consistent structure.
   * @returns {Promise} A promise that resolves when all messages have been retrieved and formatted.
   * @throws {Error} If there is an error retrieving the messages.
   */
  const listAllMessages = () => {
    return new Promise((resolve, reject) => {
      let messageData = {
        token,
        channel_id: GroupDetails?.channel_arn,
      };
      if (messageNextToken) {
        messageData = {
          ...messageData,
          next_page_token: messageNextToken,
        };
      }
      ListChannelMsgService(JSONtoformdata(messageData))
        .then((res) => {
          setmessageNextToken(res.data.data.next_page_token);
          const messages = res.data.data.messages;
          const finalResult = messages.map((ele) => {
            const timestamp = ele.LastEditedTimestamp
              ? ele.LastEditedTimestamp
              : ele.CreatedTimestamp;
            if (!ele.Content.match(/Typing/)) {
              const getvalidFileData = () => {
                if (ele.Metadata && isJSONString(ele.Metadata)) {
                  const finalData = JSON.parse(ele.Metadata);
                  return {
                    type: finalData.type,
                    file_path: finalData.file_path,
                    file: finalData?.file,
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
            } else {
              return null;
            }
          });
          let filterData = finalResult.filter((ele) => ele);
          setMessages((pre) => [...pre, ...filterData]);
          resolve();
        })
        .catch((err) => {
          // reject();
        });
    });
  };

  const values = {
    Messages,
    setMessages,
    convertMessageFormat,
    convertUrlToFile,
    setPreviewData,
    setGroupDetails,
    GroupDetails,
    PreviewData,
    setisTyping,
    isTyping,
    setEditData,
    EditData,
    SelectedContents,
    SelectAllMessages,
    setSelectAllMessages,
    setisConfigureGroup,
    receiverMessage,
    setreceiverMessage,
    messageNextToken,
    setmessageNextToken,
    listAllMessages,
  };

  return !isHidden ? (
    <ChatContext.Provider value={values}>
      {isDesktop && (
        <div
          className={`${classes.sticky_popup} ${open ? classes.visible : ""}`}
        >
          <Layout className={classes.content}>
            <ChatSocketComponent />
            <HeaderContainer
              onClose={() => {
                close();
              }}
            />
            {PreviewData ? (
              <PreviewFile />
            ) : (
              <>
                <Content
                  getContents={(contents, close) => {
                    setSelectedContents(contents);
                  }}
                />
                <Footer />
              </>
            )}
          </Layout>
        </div>
      )}
      {isMobile && (
        <Drawer
          placement="bottom"
          onClose={close}
          open={open}
          closable={false}
          maskClassName={classes.drawerMenu}
          className={"chat_drawer"}
        >
          <Layout className={classes.content}>
            <ChatSocketComponent />
            <HeaderContainer
              onClose={() => {
                close();
              }}
            />
            {PreviewData ? (
              <PreviewFile />
            ) : (
              <>
                <Content
                  getContents={(contents, close) => {
                    setSelectedContents(contents);
                  }}
                />
                <Footer />
              </>
            )}
          </Layout>
        </Drawer>
      )}
      {isConfigureGroup.show && (
        <ConfigureGroup
          open={isConfigureGroup.show}
          groupId={isConfigureGroup.group_id}
          close={() => {
            setisConfigureGroup({ show: false, group_id: null });
          }}
        />
      )}
    </ChatContext.Provider>
  ) : (
    <></>
  );
};

export default StickyPopup;
