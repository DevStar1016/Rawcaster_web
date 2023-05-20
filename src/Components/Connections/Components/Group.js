import React from "react";
import { decodeHtml } from "../../../Shared/Utility";
import classes from "../Connections.module.css";
import GroupImg from "../../../Assets/Icons/svg/default_group.svg";

const Group = ({ group, searchInput, onClick }) => {
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
              {group?.group_members_list.length + " Members"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Group;
