import React, { useEffect, useState } from "react";
import { socketListen } from "../../Services/SocketService";
import { useAuthToken } from "../../Shared/Reduxfetcher";
import { decodeHtml } from "../../Shared/Utility";
import classes from "./Connections.module.css";
import { listAllFriendsService } from "../../Services/ApiService";
import { useDispatch } from "react-redux";
import { handleFriendsList } from "../../Store/Redux/Reducer/DashboardReducer";

const Connections = () => {
  const dispatch = useDispatch();
  const Token = useAuthToken();
  const [searchInput, setsearchInput] = useState("");
  const [friends, setfriends] = useState([]);
  const [requests, setrequests] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    socketListen.on(
      "message",
      (message) => {
        switch (message.event) {
          case "friendrequest":
            FriendRequest(message);
            break;
          case "friendresponse":
            FriendResponse(message);
            break;
          case "friendstatus":
            friendStatusHandler(message);
            break;
        }
      },
      []
    );
    return () => {
      socketListen.off("call");
    };
  }, []);

  useEffect(() => {
    var formData = new FormData();
    formData.append("token", Token);
    formData.append("allfriends", 1);
    setloading(true);
    listAllFriendsService(formData)
      .then((response) => {
        if (response.data.status === 1) {
          let contactlist = response.data.friends_list;
          contactlist.sort((a, b) => {
            return b.online - a.online;
          });

          contactlist.sort((a, b) => {
            return (
              new Date(b.last_msg_datetime).getTime() -
              new Date(a.last_msg_datetime).getTime()
            );
          });
          setfriends(contactlist);
          dispatch(handleFriendsList(contactlist));
        }
      })
      .catch((error) => {})
      .finally(() => {
        setloading(false);
      });
  }, []);

  const FriendRequest = (message) => {
    setrequests((p) => [...p, message.data]);
  };

  const FriendResponse = (message) => {
    let data = [];
    setfriends((p) => {
      data = [message.data, ...p];
      return data;
    });
    dispatch(handleFriendsList(data));
  };

  const friendStatusHandler = (message) => {
    setfriends((p) => {
      let friendsList = [...p];
      const index = friendsList.findIndex(
        (f) => f.user_id === parseInt(message.friendid)
      );
      if (
        index > -1 &&
        (friendsList[index].online === 0 || friendsList[index].online === 1)
      ) {
        let login_from_web = friendsList[index].login_from_web;
        let login_from_app = friendsList[index].login_from_app;

        if (message.login_in === 2 && message.status === 1) {
          login_from_app = 1;
        } else if (message.login_in === 2 && message.status === 0) {
          login_from_app = 0;
        }

        if (message.login_in === 1 && message.status === 1) {
          login_from_web = 1;
        } else if (message.login_in === 1 && message.status === 0) {
          login_from_web = 0;
        }

        if (login_from_app === 0 && login_from_web === 0) {
          friendsList[index].online = 0;
          friendsList[index].last_seen = message.last_seen;
          friendsList[index].login_from_app = login_from_app;
          friendsList[index].login_from_web = login_from_web;
        } else {
          friendsList[index].online = 1;
          friendsList[index].last_seen = message.last_seen;
          friendsList[index].login_from_app = login_from_app;
          friendsList[index].login_from_web = login_from_web;
        }
      }
      return friendsList;
    });
  };

  return (
    <div className={classes.myconnectioin}>
      <input
        className={classes.textBox}
        onChange={(e) => setsearchInput(e.target.value)}
        value={searchInput}
        placeholder="Search Connections"
        autoComplete="off"
      />

      <h2>
        My Connections <span>({friends.length})</span>
        {friends.length !== 0 && !loading ? (
          <i class="material-symbols-outlined">add</i>
        ) : null}
      </h2>

      <div
        className={
          requests.length === 0 && friends.length === 0 && !loading
            ? classes.connectionsEmpty
            : classes.connectionsLists
        }
      >
        {requests.length === 0 && friends.length === 0 && !loading ? (
          <div strong>Start Inviting New Connections</div>
        ) : null}
        {requests.map((request) => {
          return (
            <div key={"request" + request.friend_request_id}>
              <div className={classes.list}>
                <img src={request.profile_img}></img>
                <span className={classes.disName}>
                  {" "}
                  {request.display_name.length > 18
                    ? decodeHtml(request.display_name.substring(0, 15)) + "..."
                    : decodeHtml(request.display_name)}
                </span>

                <div className={classes.redicon}>
                  <i className="material-icons">cancel</i>
                </div>
                <div className={classes.greenicon}>
                  <i className="material-icons">check_circle</i>
                </div>
              </div>
            </div>
          );
        })}

        {friends?.map((friend, index) => {
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
                      className={
                        friend.online === 1 ? classes.online : classes.offline
                      }
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
                            friend.login_from_app === 1
                              ? "inline-block"
                              : "none",
                          fontSize: "16px",
                        }}
                      >
                        phone_iphone
                      </i>
                      <i
                        class="material-icons"
                        style={{
                          display:
                            friend.login_from_web === 1
                              ? "inline-block"
                              : "none",
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
        })}
      </div>
    </div>
  );
};

export default Connections;
