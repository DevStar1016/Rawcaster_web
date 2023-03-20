import { Modal } from "antd";
import React, { useState } from "react";
import { decodeHtml } from "../../Shared/Utility";
import classes from "./Event.module.css";
import styles from "../Modal.module.css";

const SelectedUsers = ({ open, friends, close, setfriends }) => {
  const [searchInput, setsearchInput] = useState("");
  return (
    <Modal
      title="Selected Connections"
      open={open}
      footer={null}
      closable
      onCancel={close}
      closeIcon={
        <div className={styles.modalCloseIcon}>
          <span class="material-symbols-outlined">close</span>
        </div>
      }
    >
      <div className="pt-2">
        <input
          className={classes.textBox}
          onChange={(e) => setsearchInput(e.target.value)}
          value={searchInput}
          placeholder="Search Connections"
          autoComplete="off"
        />
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
                    ? "block"
                    : "none",
                }}
              >
                <div className={classes.profileSec}>
                  <img src={friend.profile_img} />
                  <p>{friend.display_name}</p>
                </div>
                <span
                  class="material-symbols-outlined"
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
      </div>
    </Modal>
  );
};

export default SelectedUsers;
