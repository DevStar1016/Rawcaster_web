import React from "react";
import { decodeHtml } from "../../../Shared/Utility";
import classes from "../Connections.module.css";
import GroupImg from "../../../Assets/Icons/svg/default_group.svg";

const Group = ({ group, searchInput }) => {
  return (
    <>
      <div
        className={classes.friendslist}
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
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = GroupImg;
            }}
          />
          <span className={classes.disName}>
            {decodeHtml(group.group_name)}
          </span>
        </div>
      </div>
    </>
  );
};

export default Group;
