/**
 * A React component that displays a modal with a list of selected users or groups.
 * @param {boolean} open - Determines whether the modal is open or closed.
 * @param {number} [type=1] - The type of selection (1 for connections, 2 for groups).
 * @param {Array} Groups - An array of groups to display.
 * @param {Array} friends - An array of friends to display.
 * @param {function} close - A function to close the modal.
 * @param {function} setfriends - A function to set the selected friends.
 * @param {function} setGroups - A function to set the selected groups.
 * @returns A React component that renders a modal
 */
import { Empty, Modal } from "antd";
import React, { useState } from "react";
import { decodeHtml } from "../../Shared/Utility";
import classes from "./Event.module.css";
import styles from "../Modal.module.css";
import {
  defaultGroupImg,
  defaultprofileImg,
} from "../../Shared/CommonConstants";

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
      className={classes.modalWrapper}
      style={
        friends?.length > 4 || Groups?.length > 4
          ? { height: "calc(100vh - 200px)" }
          : { height: "auto" }
      }
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
          <div className={`mt-3 ${classes.connectionsContainer}`}>
            {Groups?.length > 0 &&
              Groups?.map((group, index) => {
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
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null;
                          currentTarget.src =
                            type === 1 ? defaultprofileImg : defaultGroupImg;
                        }}
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
            {Groups.length === 0 && <Empty />}
          </div>
        ) : (
          <div className={`mt-3 ${classes.connectionsContainer}`}>
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
