import React from "react";
import { MessageContent } from "../../../Sharedcomponents/Chat/utility";
import { Layout } from "antd";
import classes from "../ChatBox.module.css";
import { useChatContext, useMainContext } from "../../../Shared/Context";
import { MessageList, TypingIndicator } from "@chatscope/chat-ui-kit-react";

const Content = () => {
  const { Messages, isTyping } = useChatContext();
  const { isChatOpen } = useMainContext();

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
          {Messages.map((ele, index) => {
            return (
              <MessageContent
                {...ele}
                index={index}
                isGroup={isChatOpen.type == "group"}
              />
            );
          })}
        </div>
      </Layout.Content>
    </MessageList>
  );
};

export default Content;
