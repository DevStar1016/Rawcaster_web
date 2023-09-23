/**
 * A React component that renders the content of a chat box.
 * @param {Function} getContents - A function that handles getting the contents of the chat box.
 * @returns The rendered content of the chat box.
 */
import { useEffect, useState } from "react";
import { MessageContent } from "../../../Sharedcomponents/Chat/utility";
import { Layout, Modal } from "antd";
import classes from "../ChatBox.module.css";
import { useChatContext, useMainContext } from "../../../Shared/Context";
import { MessageList, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import moment from "moment";
import SectionList from "../../../Sharedcomponents/SectionList";

const Content = ({ getContents }) => {
  const userdata = useAuthData();
  const [headerScrolling, setheaderScrolling] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const {
    Messages,
    isTyping,
    GroupDetails,
    setMessages,
    setSelectAllMessages,
    SelectAllMessages,
    messageNextToken,
    listAllMessages,
  } = useChatContext();
  const { isChatOpen } = useMainContext();

  const [selectedMessages, setSelectedMessages] = useState([]);

  /**
   * Handles the deletion of a message with the given ID.
   * @param {string} id - The ID of the message to delete.
   * @returns None
   */
  const handleDelete = (id) => {
    const params = {
      ChannelArn: GroupDetails?.channel_arn,
      MessageId: id,
      ChimeBearer: userdata.chime_user_id,
    };
  };

  /**
   * Groups messages into sections based on their creation date and returns an array of sectioned messages.
   * @returns {Array} An array of sectioned messages, where each section contains messages with the same creation date.
   */
  const getValidSectionComponent = () => {
    const sectionedMessages = [];
    let currentSectionDate = null;
    Messages.forEach((message) => {
      const gettimeData = () => {
        const today = moment().startOf("day");
        const givenDate = moment(
          message.created_at,
          "YYYY-MM-DD HH:mm:ss"
        ).startOf("day");

        if (givenDate.isSame(today, "day")) {
          return "Today";
        } else if (givenDate.isSame(today.clone().subtract(1, "day"), "day")) {
          return "Yesterday";
        } else {
          return moment(message.created_at, "YYYY-MM-DD HH:mm:ss").format(
            "MMM DD,YYYY"
          );
        }
      };
      const messageDate = gettimeData();
      if (messageDate !== currentSectionDate) {
        currentSectionDate = messageDate;
        sectionedMessages.push({
          title: currentSectionDate,
          items: [message],
        });
      } else {
        const lastSection = sectionedMessages[sectionedMessages.length - 1];
        lastSection.items.push(message);
      }
    });
    return sectionedMessages.reverse();
  };

  /**
   * Executes the getContents function whenever the selectedMessages array changes.
   * @returns None
   */
  useEffect(() => {
    getContents(selectedMessages);
  }, [selectedMessages]);

  useEffect(() => {
    setSelectedMessages([]);
  }, [SelectAllMessages]);

  return (
    <MessageList
      typingIndicator={
        isTyping ? (
          <TypingIndicator
            style={{
              width: "100%",
              paddingLeft: 20,
            }}
            color="red"
            content={
              isChatOpen.type == "group"
                ? `${isTyping?.SenderName} is typing`
                : "typing"
            }
          />
        ) : null
      }
      className={classes.MessagesList}
    >
      <Layout.Content id="scrollContainer" className={classes.mainContainer}>
        <div className={`${classes.endToEndSec} mb-1`}>
          <i className={classes.rawcaster_icon} />
          Messages and calls are end-to-end encrypted. No one outside of this
          chat, not even Rawcaster, can read or listen to them.
        </div>
        <div className="p-1">
          {getValidSectionComponent() && (
            <SectionList
              Data={getValidSectionComponent()}
              hasNextPage={messageNextToken}
              loading={isLoading}
              loadMore={() => {
                setisLoading(true);
                listAllMessages()
                  .then((res) => {})
                  .finally(() => {
                    setisLoading(false);
                  });
              }}
              HeaderComponent={({ children, id, className }) => (
                <div
                  className={
                    headerScrolling
                      ? `${classes.dateSec} ${classes.dateSecSticky}`
                      : classes.dateSec
                  }
                  id={id}
                >
                  <p className={className}>{children}</p>
                </div>
              )}
              RenderComponent={({ ele, index }) => (
                <MessageContent
                  {...ele}
                  index={index}
                  isGroup={isChatOpen?.type == "group"}
                  onDelete={() => {
                    Modal.confirm({
                      title: "Confirmation",
                      okText: "Yes",
                      cancelText: "No",
                      okButtonProps: {
                        danger: true,
                      },
                      content: (
                        <div>
                          Are you sure Do you Want to Delete This Message ?
                        </div>
                      ),
                      onOk: () => {
                        handleDelete(ele?.message_id);
                      },
                    });
                  }}
                  onSelectedMessage={(value) => {
                    setSelectedMessages((pre) => {
                      const temp = [...pre];
                      if (temp?.includes(value)) {
                        return temp?.filter((item) => item !== value);
                      }
                      return [...temp, value];
                    });
                  }}
                  selectedMessages={selectedMessages}
                  SelectAllMessages={SelectAllMessages}
                  setSelectAllMessages={setSelectAllMessages}
                />
              )}
            />
          )}
        </div>
      </Layout.Content>
    </MessageList>
  );
};

export default Content;
