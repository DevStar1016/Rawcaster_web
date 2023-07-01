import React from "react";
import { decodeHtml, handleProfileNavigate } from "../../../Shared/Utility";
import classes from "../Connections.module.css";
import videocall from "../../../Assets/Icons/svg/videocall.svg";
import audiocall from "../../../Assets/Icons/svg/audiocall.svg";
import chatIcon from "../../../Assets/Icons/svg/Chats/chat_icon.svg";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useNuggets } from "../../../Shared/Reduxfetcher";
import { useMainContext } from "../../../Shared/Context";

const Friends = ({ friend, searchInput }) => {
  const { setisChatOpen } = useMainContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nuggetFormData } = useNuggets();
  return (
    <>
      <div
        className={classes.friendslist}
        onClick={() => {
          let finalData = {
            dispatch,
            navigate,
            nuggetFormData,
            user_id: friend.user_id,
          };
          handleProfileNavigate(finalData);
        }}
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
          <img
            src={friend?.profile_img ? friend?.profile_img : ""}
            alt={decodeHtml(friend.display_name)}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = defaultprofileImg;
            }}
          />
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
            <img src={audiocall} alt={"audio call"} />
            <img src={videocall} alt={"video call"} />
            <img
              src={chatIcon}
              alt={"Chat"}
              // onClick={(event) => {
              //   event.stopPropagation();
              //   setisChatOpen({
              //     show: true,
              //     type: "friend",
              //     id: friend.user_id,
              //   });
              // }}
            />
          </div>
        }
      </div>
    </>
  );
};

export default Friends;
