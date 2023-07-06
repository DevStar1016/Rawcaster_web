import React, { useEffect, useState } from "react";
import { MessageContent } from "../../../Sharedcomponents/Chat/utility";
import { Layout } from "antd";
import classes from "../ChatBox.module.css";
import { useChatContext, useMainContext } from "../../../Shared/Context";
import { MessageList, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { deleteChannelMessage } from "../../../Services/Messaging/MessageAPIList";
import { useAuth, useAuthData } from "../../../Shared/Reduxfetcher";
import { toast } from "react-hot-toast";
import moment from "moment";
import SectionList from "../../../Sharedcomponents/SectionList";

const Content = ({ getContents }) => {
  const userdata = useAuthData();
  const [headerScrolling, setheaderScrolling] = useState(false);
  const [scroll, setscroll] = useState(0);
  const {
    Messages,
    isTyping,
    GroupDetails,
    EditData,
    setMessages,
    setSelectAllMessages,
    SelectAllMessages,
  } = useChatContext();
  const { isChatOpen } = useMainContext();

  const [selectedMessages, setSelectedMessages] = useState([]);

  console.log(Messages);

  const handleDelete = (id) => {
    const params = {
      ChannelArn: GroupDetails?.group_arn,
      MessageId: id,
      ChimeBearer: userdata.chime_user_id,
    };
    deleteChannelMessage(params)
      .then((res) => {
        toast.success("Message Deleted Successfully");
        setMessages((pre) => pre.filter((ele) => ele.message_id !== id));
      })
      .catch((err) => {
        toast.error("Unable to delete this message");
      });
  };

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

  useEffect(() => {
    setheaderScrolling(true);
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      if (scroll === document.getElementById("scrollContainer").scrollTop) {
        setheaderScrolling(false);
      }
    }, 500);
  }, [scroll]);

  useEffect(() => {
    console.log(selectedMessages, "selectedMessages");
    getContents(selectedMessages);
  }, [selectedMessages]);

  useEffect(() => {
    setSelectedMessages([]);
  }, [SelectAllMessages]);

  const closeSelection = () => setSelectAllMessages(false);

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
      <Layout.Content
        onScroll={(event) => {
          const listboxNode = event.currentTarget;
          const { scrollTop, scrollHeight, clientHeight } = listboxNode;
          console.log(scrollTop, "eventevent scroll");
          if (scrollTop + clientHeight < scrollHeight - 5) setscroll(scrollTop);
        }}
        id="scrollContainer"
        className={classes.mainContainer}
      >
        <div className={`${classes.endToEndSec} mb-1`}>
          <i className={classes.rawcaster_icon} />
          Messages and calls are end-to-end encrypted. No one outside of this
          chat, not even Rawcaster, can read or listen to them.
        </div>
        <div className="p-1">
          {getValidSectionComponent() && (
            <SectionList
              Data={getValidSectionComponent()}
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
                    console.log("test", ele);
                    handleDelete(ele?.message_id);
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
                // <div>hello user</div>
              )}
            />
          )}
        </div>
      </Layout.Content>
    </MessageList>
  );
};

export default Content;
