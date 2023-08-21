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

const { Header } = Layout;

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
          // setMessages((pre) => [
          //   ...pre,
          //   {
          //     ...convertMessageFormat({
          //       type: validType,
          //       message: val,
          //       file: PreviewData,
          //       file_path: res.data.filepath,
          //       user_name: "me",
          //       user: userData?.chime_user_id,
          //     }),
          //   },
          // ]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  function isJSONString(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  }
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

            const getvalidFileData = () => {
              if (ele.Metadata && isJSONString(ele.Metadata)) {
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
          setMessages((pre) => [...pre, ...finalResult]);
          resolve();
        })
        .catch((err) => {
          console.log(err, "err");
          reject();
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
