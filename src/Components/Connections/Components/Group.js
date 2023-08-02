import React from "react";
import { decodeHtml } from "../../../Shared/Utility";
import classes from "../Connections.module.css";
import GroupImg from "../../../Assets/Icons/svg/default_group.svg";
import videocall from "../../../Assets/Icons/svg/videocall.svg";
import audiocall from "../../../Assets/Icons/svg/audiocall.svg";
import chatIcon from "../../../Assets/Icons/svg/Chats/chat_icon.svg";
import { useMainContext } from "../../../Shared/Context";

const Group = ({ group, searchInput, onClick }) => {
  const { setisChatOpen } = useMainContext();
  return (
    <>
      <div
        className={classes.friendslist}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
        style={{
          position: "relative",
          display: decodeHtml(group.group_name)
            .toLowerCase()
            .includes(searchInput.toLowerCase())
            ? "block"
            : "none",
        }}
        id={"groups_" + group.group_id}
      >
        <div className={classes.list}>
          <img
            src={group.group_icon}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = GroupImg;
            }}
            alt={decodeHtml(group.group_name)}
          />
          <div>
            <p className={classes.groupdisName}>
              {decodeHtml(group.group_name)}
            </p>
            <span className={classes.groupdisName}>
              {group?.group_member_count + " Members"}
            </span>
          </div>
        </div>
        <div className={`${classes.friendsmenu}`}>
          <img src={audiocall} alt={"audio call"} />
          <img src={videocall} alt={"video call"} />
          <img
            src={chatIcon}
            alt={"Group Chat"}
            onClick={(event) => {
              event.stopPropagation();
              setisChatOpen({
                show: true,
                type: "group",
                id: group.group_id,
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Group;
