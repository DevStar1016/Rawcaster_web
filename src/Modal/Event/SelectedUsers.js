import { Modal } from "antd";
import React, { useState } from "react";
import { decodeHtml } from "../../Shared/Utility";
import classes from "./Event.module.css";
import styles from "../Modal.module.css";

const SelectedUsers = ({
  open,
  type = 1,
  Groups,
  friends,
  close,
  setfriends,
  setGroups,
}) => {
  const [searchInput, setsearchInput] = useState("");
  return (
    <Modal
      title={`Selected ${type === 1 ? "Connections" : "Groups"}`}
      open={open}
      footer={null}
      closable
      onCancel={close}
      closeIcon={
        <div className={styles.modalCloseIcon}>
          <span className="material-symbols-outlined">close</span>
        </div>
      }
    >
      <div className="pt-2">
        <input
          className={classes.textBox}
          onChange={(e) => setsearchInput(e.target.value)}
          value={searchInput}
          placeholder={`Search ${type === 1 ? "Connections" : "Groups"}`}
          autoComplete="off"
        />
        {type === 2 ? (
          <div className="mt-3">
            {Groups?.map((group, index) => {
              return (
                <div
                  className={classes.friendslist}
                  style={{
                    position: "relative",
                    display: decodeHtml(group.group_name)
                      .toLowerCase()
                      .includes(searchInput.toLowerCase())
                      ? "flex"
                      : "none",
                  }}
                >
                  <div className={classes.profileSec}>
                    <img
                      src={group.group_icon}
                      alt={decodeHtml(group.group_name)}
                    />
                    <p>{decodeHtml(group.group_name)}</p>
                  </div>
                  <span
                    className="material-symbols-outlined"
                    onClick={() => {
                      setGroups(group.group_id);
                    }}
                  >
                    close
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-3">
            {friends?.map((friend, index) => {
              return (
                <div
                  className={classes.friendslist}
                  style={{
                    position: "relative",
                    display: decodeHtml(friend.display_name)
                      .toLowerCase()
                      .includes(searchInput.toLowerCase())
                      ? "flex"
                      : "none",
                  }}
                >
                  <div className={classes.profileSec}>
                    <img
                      src={friend.profile_img}
                      alt={decodeHtml(friend.display_name)}
                    />
                    <p>{decodeHtml(friend.display_name)}</p>
                  </div>
                  <span
                    className="material-symbols-outlined"
                    onClick={() => {
                      setfriends(friend.user_id);
                    }}
                  >
                    close
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SelectedUsers;
