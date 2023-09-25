/**
 * A React component that displays the user's connections.
 * @param {Object} props - The component props.
 * @param {boolean} props.referral - Indicates whether the component is being used in a referral context.
 * @param {string} props.profileClass - The CSS class to apply to the profile component.
 * @returns The Connections component.
 */
import React, { useEffect, useState } from "react";
import { useAuthToken, useDashboard } from "../../../Shared/Reduxfetcher";
import classes from "../Connections.module.css";
import { listAllFriendRequestsService } from "../../../Services/ApiService";
import { useDispatch } from "react-redux";
import { handleFriendsList } from "../../../Store/Redux/Reducer/DashboardReducer";
import AddConnection from "./AddConnection";
import Request from "../Components/Request";
import Friends from "../Components/Friends";
import { Skeleton } from "antd";
import { decodeHtml } from "../../../Shared/Utility";

const Connections = ({ referral, profileClass }) => {
  const dispatch = useDispatch();
  const Token = useAuthToken();
  const { friendsList, isFriendsLoading } = useDashboard();
  const [searchInput, setsearchInput] = useState("");
  const [isAddFriend, setisAddFriend] = useState(false);
  const [friends, setfriends] = useState([]);
  const [requests, setrequests] = useState([]);

  /**
   * Sets up a socket listener to handle incoming messages and perform actions based on the event type.
   * @returns None
   */

  /**
   * Filters out duplicate objects from an array of data based on the "user_id" property.
   * @param {Array} data - The array of data to filter.
   * @returns {Array} - The filtered array with duplicate objects removed.
   */
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

  /**
   * Executes a side effect when the value of Token changes.
   * If Token is truthy, it sends a request to the server to retrieve a list of pending friend requests.
   * If the request is successful and the response status is 1, it updates the state with the list of pending requests.
   * @param {string} Token - The token used for authentication.
   * @returns None
   */
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
        .catch((err) => {});
    }
  }, [Token]);

  /**
   * useEffect hook that updates the "friends" state variable whenever the "friendsList" state variable changes.
   * If the "friendsList" is not empty, it calls the "getValidData" function to filter out any invalid data and updates the "friends" state with the valid data.
   * @returns None
   */
  useEffect(() => {
    if (friendsList.length !== 0) {
      setfriends(getValidData(friendsList));
    }
  }, [friendsList]);

  /**
   * Handles a friend request by adding it to the list of requests.
   * @param {any} message - The friend request message.
   * @returns None
   */
  const FriendRequest = (message) => {
    setrequests((p) => getValidData([...p, message.data]));
  };

  /**
   * Handles the response from a friend message.
   * @param {any} message - The message received from a friend.
   * @returns None
   */
  const FriendResponse = (message) => {
    let data = [];
    setfriends((p) => {
      data = [message.data, ...p];
      return data;
    });
    dispatch(handleFriendsList(data));
  };

  /**
   * Updates the status of a friend based on the received message.
   * @param {object} message - The message containing the friend's status information.
   * @returns None
   */
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
  const getValidConnections = () => {
    const Friends = friends.filter((friend) =>
      decodeHtml(friend.display_name)
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
    const Requests = requests.filter((friend) =>
      decodeHtml(friend.display_name)
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );

    return {
      friends: Friends,
      requests: Requests,
    };
  };
  return (
    <div
      className={
        referral
          ? `${classes.myconnectioin} ${classes.myconnectioinReferral}`
          : classes.myconnectioin
      }
    >
      <div className={classes.inputSec}>
        <input
          className={classes.textBox}
          onChange={(e) => setsearchInput(e.target.value)}
          value={searchInput}
          placeholder="Search Connections"
          autoComplete="off"
        />
        {searchInput && searchInput !== "" && (
          <span
            class="material-symbols-outlined"
            onClick={() => {
              setsearchInput("");
            }}
          >
            cancel
          </span>
        )}
      </div>
      <h2>
        My Connections <span>({getValidConnections().friends.length})</span>
        {(getValidConnections().friends.length !== 0 || searchInput !== "") &&
        !isFriendsLoading ? (
          <i
            className="material-symbols-outlined"
            onClick={() => {
              setisAddFriend(true);
            }}
          >
            add
          </i>
        ) : null}
      </h2>
      <p className={classes.headborder}></p>

      <div
        className={
          getValidConnections().friends.length === 0 &&
          getValidConnections().requests.length === 0 &&
          !isFriendsLoading
            ? classes.connectionsEmpty
            : referral
            ? `${classes.connectionsLists} ${
                classes.connectionsListsReferral
              } ${profileClass ? classes.profileConnectlist : ""}`
            : `${classes.connectionsLists} ${
                profileClass ? classes.profileConnectlist : ""
              }`
        }
      >
        {getValidConnections().requests.length === 0 &&
        getValidConnections().friends.length === 0 &&
        !isFriendsLoading ? (
          <div
            strong
            onClick={() => {
              if (searchInput === "") {
                setisAddFriend(true);
              }
            }}
          >
            {searchInput !== ""
              ? "No Results Found"
              : "Start Inviting New Connections"}
          </div>
        ) : null}
        {getValidConnections().requests.map((request) => {
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
              onReject={() => {}}
            />
          );
        })}
        {getValidConnections()?.friends.map((friend, index) => {
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
      {isAddFriend && (
        <AddConnection
          open={isAddFriend}
          friends={friends}
          setfriends={setfriends}
          close={() => {
            setisAddFriend(false);
          }}
        />
      )}
    </div>
  );
};

export default Connections;
