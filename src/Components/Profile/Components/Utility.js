import { Skeleton } from "antd";
import {
  getFollowListService,
  listAllFriendsService,
  listClaimAccountService,
} from "../../../Services/ApiService";
import {
  EncryptionString,
  JSONtoformdata,
  getisAddFriend,
  handleProfileNavigate,
} from "../../../Shared/Utility";
import { useAuthData, useNuggets } from "../../../Shared/Reduxfetcher";
import { useProfileContext } from "../../../Shared/Context";
import classes from "./ProfilerRight.module.css";
import { useNavigate } from "react-router";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import { useDispatch } from "react-redux";
import AddFriendIcon from "../../../Assets/Icons/svg/add_friend_1.svg";

export const getfollowerfollowingService = (fansList) => {
  let promise = new Promise((resolve, reject) => {
    getFollowListService(JSONtoformdata(fansList))
      .then((res) => {
        if (res.data.status === 1) {
          const getFansCount = () => {
            if (parseInt(res.data.follow_count) > 8) {
              return parseInt(res.data.follow_count) - 8;
            } else {
              return 0;
            }
          };
          resolve({
            connections: res.data.follow_list.slice(0, 8),
            allconnections: res.data.follow_list,
            allconnectionscount: parseInt(res.data.follow_count),
            connectionscount: getFansCount(),
            isLoaded: true,
          });
        } else {
          resolve({
            connections: [],
            allconnections: [],
            allconnectionscount: 0,
            connectionscount: 0,
            isLoaded: true,
          });
        }
      })
      .catch((err) => {
        resolve({
          connections: [],
          allconnections: [],
          allconnectionscount: 0,
          connectionscount: 0,
          isLoaded: true,
        });
      });
  });
  return promise;
};

export const getUnclaimedInfluencerData = (token) => {
  let promise = new Promise((resolve, reject) => {
    let listData = {
      token: token,
    };
    listClaimAccountService(JSONtoformdata(listData))
      .then(({ data }) => {
        if (data.status === 1) {
          let contactlist = data.unclaim_accounts;

          const getCount = () => {
            if (parseInt(contactlist) > 8) {
              return parseInt(contactlist) - 8;
            } else {
              return 0;
            }
          };
          resolve({
            connections: contactlist.slice(0, 8),
            allconnections: contactlist,
            allconnectionscount: contactlist.length,
            connectionscount: getCount(),
            isLoaded: true,
          });
        } else {
          resolve({
            connections: [],
            allconnections: [],
            allconnectionscount: 0,
            connectionscount: 0,
            isLoaded: true,
          });
        }
      })
      .catch((err) => {
        resolve({
          connections: [],
          allconnections: [],
          allconnectionscount: 0,
          connectionscount: 0,
          isLoaded: true,
        });
      });
  });
  return promise;
};

export const getConnectionData = (values) => {
  let promise = new Promise((resolve, reject) => {
    let listData = {
      ...values,
      allfriends: 1,
    };

    listAllFriendsService(JSONtoformdata(listData))
      .then(({ data }) => {
        if (data.status === 1) {
          let contactlist = data.friends_list;
          contactlist.sort((a, b) => {
            return b.online - a.online;
          });

          contactlist.sort((a, b) => {
            return (
              new Date(b.last_msg_datetime).getTime() -
              new Date(a.last_msg_datetime).getTime()
            );
          });
          const getCount = () => {
            if (parseInt(contactlist) > 8) {
              return parseInt(contactlist) - 8;
            } else {
              return 0;
            }
          };
          resolve({
            connections: contactlist.slice(0, 8),
            allconnections: data.friends_list,
            allconnectionscount: data.friends_count,
            connectionscount: getCount(),
            isLoaded: true,
          });
        } else {
          resolve({
            connections: [],
            allconnections: [],
            allconnectionscount: 0,
            connectionscount: 0,
            isLoaded: true,
          });
        }
      })
      .catch((err) => {
        resolve({
          connections: [],
          allconnections: [],
          allconnectionscount: 0,
          connectionscount: 0,
          isLoaded: true,
        });
      });
  });
  return promise;
};

export const UserProfile = ({ ele, type, getConnectionList, className }) => {
  const dispatch = useDispatch();
  const { nuggetFormData } = useNuggets();
  const {
    isLoginUser,
    setFansList,
    handleBecameFan,
    handleAddUser,
    setprofileData,
  } = useProfileContext();
  const navigate = useNavigate();
  const loginuserData = useAuthData();
  const isUser = parseInt(loginuserData?.user_id) === parseInt(ele?.user_id);
  const isAddFriend = () => {
    if (isUser) {
      return false;
    } else if (
      ele?.unclaimed_status === 0 &&
      type === "unclaimed_influencers"
    ) {
      return false;
    } else if (ele?.friend_status === 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className={classes.list}>
      <Skeleton.Node
        active={false}
        style={{
          height: "60px",
          width: "60px",
          overflow: "hidden",
          borderRadius: 50,
        }}
      >
        <div className={`${classes.iconSec} ${!isLoginUser ? className : ""}`}>
          {isLoginUser ? (
            <>
              {type === "unclaimed_influencers" && isLoginUser ? (
                <i
                  className={classes.sheildIcon}
                  style={{
                    display: ele.unclaimed_status ? "none" : "",
                  }}
                  onClick={() => {
                    navigate(`/claim/${EncryptionString(ele.user_id)}`);
                  }}
                />
              ) : null}
            </>
          ) : (
            <>
              {type === "influencers" ? (
                <span
                  className={`material-symbols-outlined ${classes.plusIcon}`}
                  style={{ display: ele.follow ? "none" : "" }}
                  onClick={() => {
                    handleBecameFan(ele.user_ref_id).then((res) => {
                      getConnectionList({});
                    });
                  }}
                >
                  add
                </span>
              ) : null}
              {type === "connections" ? (
                <img
                  src={AddFriendIcon}
                  className={classes.addIcon}
                  style={{
                    display: isAddFriend() ? "" : "none",
                  }}
                  alt="Add Friend"
                  onClick={() => {
                    handleAddUser(ele).then((res) => {
                      getConnectionList({});
                    });
                  }}
                />
              ) : // <i
              //   className={classes.addIcon}

              //
              // />
              null}
            </>
          )}
        </div>
        <img
          src={ele?.profile_img || ""}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = defaultprofileImg;
          }}
          alt="User_img"
          onClick={() => {
            setprofileData();
            setFansList({
              connections: [],
              allconnections: [],
              connectionscount: 0,
              allconnectionscount: 0,
              isLoaded: true,
            });
            let finalData = {
              dispatch,
              navigate,
              nuggetFormData,
              user_id: ele.user_id,
            };
            handleProfileNavigate(finalData);
          }}
        />
      </Skeleton.Node>
      <p
        onClick={() => {
          setprofileData();
          setFansList({
            connections: [],
            allconnections: [],
            connectionscount: 0,
            allconnectionscount: 0,
            isLoaded: true,
          });
          let finalData = {
            dispatch,
            navigate,
            nuggetFormData,
            user_id: ele.user_id,
          };
          handleProfileNavigate(finalData);
        }}
      >
        {ele?.display_name}
      </p>
    </div>
  );
};
