import React, { useEffect } from "react";
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

const Content = () => {
  const userdata = useAuthData();
  const { Messages, isTyping, GroupDetails, EditData, setMessages } =
    useChatContext();
  const { isChatOpen } = useMainContext();
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
      <Layout.Content className={classes.mainContainer}>
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
                <div className={classes.dateSec} id={id}>
                  <p className={className}>{children}</p>
                </div>
              )}
              RenderComponent={({ ele, index }) => (
                <MessageContent
                  {...ele}
                  index={index}
                  isGroup={isChatOpen.type == "group"}
                  onDelete={() => {
                    console.log("test", ele);
                    handleDelete(ele.message_id);
                  }}
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
