import React, { useEffect, useState } from "react";
import { socketListen } from "../../../Services/SocketService";
import { useAuthToken, useDashboard } from "../../../Shared/Reduxfetcher";
import classes from "../Connections.module.css";
import { listAllFriendRequestsService } from "../../../Services/ApiService";
import { useDispatch } from "react-redux";
import { handleFriendsList } from "../../../Store/Redux/Reducer/DashboardReducer";
import AddConnection from "./AddConnection";
import { toast } from "react-hot-toast";
import Request from "../Components/Request";
import Friends from "../Components/Friends";
import { SOCKET_EVENTS } from "../../../Services/ServiceConstants";
import { Skeleton } from "antd";

const Connections = () => {
  const dispatch = useDispatch();
  const Token = useAuthToken();
  const { friendsList, isFriendsLoading } = useDashboard();
  const [searchInput, setsearchInput] = useState("");
  const [isAddFriend, setisAddFriend] = useState(false);
  const [friends, setfriends] = useState([]);
  const [requests, setrequests] = useState([]);

  useEffect(() => {
    socketListen.on(
      "message",
      (message) => {
        switch (message.event) {
          case SOCKET_EVENTS.FRIEND_REQUEST:
            FriendRequest(message);
            break;
          case SOCKET_EVENTS.FRIEND_RESPONSE:
            FriendResponse(message);
            break;
          case SOCKET_EVENTS.FRIEND_STATUS:
            friendStatusHandler(message);
            break;
          default:
            break;
        }
      },
      []
    );
    return () => {
      socketListen.off("call");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getValidData = (data) => {
    if (data && data.length !== 0) {
      const filteredArr = data.reduce((acc, current) => {
        const x = acc.find((item) => item.user_id === current.user_id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      return filteredArr;
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (Token) {
      var formData = new FormData();
      formData.append("token", Token);
      listAllFriendRequestsService(formData)
        .then((res) => {
          if (res.data.status === 1) {
            setrequests(res.data.pending_requests);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  }, [Token]);

  useEffect(() => {
    if (friendsList.length !== 0) {
      setfriends(getValidData(friendsList));
    }
  }, [friendsList]);

  const FriendRequest = (message) => {
    setrequests((p) => getValidData([...p, message.data]));
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
          friendsList[index] = {
            ...friendsList[index],
            online: 0,
            last_seen: message.last_seen,
            login_from_app: login_from_app,
            login_from_web: login_from_web,
          };
        } else {
          friendsList[index] = {
            ...friendsList[index],
            online: 1,
            last_seen: message.last_seen,
            login_from_app: login_from_app,
            login_from_web: login_from_web,
          };
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
        {friends.length !== 0 && !isFriendsLoading ? (
          <i
            class="material-symbols-outlined"
            onClick={() => {
              setisAddFriend(true);
            }}
          >
            add
          </i>
        ) : null}
      </h2>

      <div
        className={
          requests.length === 0 && friends.length === 0 && !isFriendsLoading
            ? classes.connectionsEmpty
            : classes.connectionsLists
        }
      >
        {requests.length === 0 && friends.length === 0 && !isFriendsLoading ? (
          <div
            strong
            onClick={() => {
              setisAddFriend(true);
            }}
          >
            Start Inviting New Connections
          </div>
        ) : null}
        {requests.map((request) => {
          return (
            <Request
              request={request}
              setrequests={setrequests}
              onSuccess={(res) => {
                let data = [];
                setfriends((p) => {
                  data = getValidData([res, ...p]);
                  return data;
                });
                dispatch(handleFriendsList(getValidData(data)));
              }}
              onReject={() => {
                console.log("test");
              }}
            />
          );
        })}
        {friends?.map((friend, index) => {
          return <Friends friend={friend} searchInput={searchInput} />;
        })}
        {isFriendsLoading && (
          <>
            {[...Array(4)].map((ele) => (
              <Skeleton avatar paragraph={{ rows: 0 }} />
            ))}
          </>
        )}
      </div>
      <AddConnection
        open={isAddFriend}
        friends={friends}
        setfriends={setfriends}
        close={() => {
          setisAddFriend(false);
        }}
      />
    </div>
  );
};

export default Connections;
