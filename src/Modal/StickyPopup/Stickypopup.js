import React, { useEffect, useState } from "react";
import classes from "./Stickypopup.module.css";
import { Layout } from "antd";
import Footer from "../../Components/ChatBox/Footer";
import Content from "../../Components/ChatBox/Group/Content";
import { ChatContext } from "../../Shared/Context";
import moment from "moment";
import PreviewFile from "../../Components/ChatBox/Preview/PreviewFile";
import ChatSocketComponent from "../../Components/ChatBox/ChatSocketComponent";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { uploadChatAttachmentService } from "../../Services/ApiService";
import { JSONtoformdata } from "../../Shared/Utility";
import ConfigureGroup from "../../Components/Connections/Groups/ConfigureGroup";

const { Header } = Layout;

const StickyPopup = ({ HeaderContainer, open, close }) => {
  const token = useAuthToken();
  const userData = useAuthData();
  const [isHidden, setisHidden] = useState(false);
  const [Messages, setMessages] = useState([]);
  const [GroupDetails, setGroupDetails] = useState(null);
  const [PreviewData, setPreviewData] = useState(null);
  const [isTyping, setisTyping] = useState(null);
  const [EditData, setEditData] = useState(null);
  const [SelectedContents, setSelectedContents] = useState([]);
  const [SelectAllMessages, setSelectAllMessages] = useState(false);
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
  };

  return !isHidden ? (
    <ChatContext.Provider value={values}>
      <div className={`${classes.sticky_popup} ${open ? classes.visible : ""}`}>
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
