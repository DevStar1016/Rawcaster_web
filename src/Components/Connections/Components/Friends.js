import React from "react";
import { decodeHtml } from "../../../Shared/Utility";
import classes from "../Connections.module.css";

const Friends = ({ friend, searchInput }) => {
  return (
    <>
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
        id={"friends_" + friend.user_id}
      >
        <div className={classes.list}>
          <img src={friend.profile_img} />
          {friend.online !== "" ? (
            <i
              className={friend.online === 1 ? classes.online : classes.offline}
            ></i>
          ) : null}

          <span className={classes.disName}>
            {decodeHtml(friend.display_name)}
          </span>
          {friend.online == 1 ? (
            <div className={classes.userlogedin_icon}>
              <i
                class="material-icons"
                style={{
                  display:
                    friend.login_from_app === 1 ? "inline-block" : "none",
                  fontSize: "16px",
                }}
              >
                phone_iphone
              </i>
              <i
                class="material-icons"
                style={{
                  display:
                    friend.login_from_web === 1 ? "inline-block" : "none",
                  fontSize: "16px",
                }}
              >
                desktop_mac
              </i>
            </div>
          ) : null}
        </div>

        {
          <div
            id={"menu_" + friend.user_id}
            className={`${classes.friendsmenu}`}
          >
            <>
              <i
                className={`material-icons ${classes.audio_icon}`}
                title="Audio call"
              >
                phone
              </i>

              <i
                className={`material-icons ${classes.video_icon}`}
                title="Video call"
              >
                videocam
              </i>
            </>
          </div>
        }
      </div>
    </>
  );
};

export default Friends;
