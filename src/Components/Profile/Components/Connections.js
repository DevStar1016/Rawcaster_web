/**
 * A React component that displays a list of connections.
 * @param {string} title - The title of the connections list.
 * @param {string} type - The type of connections list (e.g., influencers, connections, fans).
 * @param {boolean} isLocked - Indicates whether the connections list is locked or not.
 * @param {boolean} isMyProfile - Indicates whether the connections list belongs to the user's own profile.
 * @param {boolean} isLoading - Indicates whether the connections list is currently loading.
 * @returns A React component that renders the connections list.
 */
import React, { useEffect, useState } from "react";
import classes from "./ProfilerRight.module.css";
import { useParams } from "react-router";
import { DecryptionString } from "../../../Shared/Utility";
import { Skeleton } from "antd";
import EmptyImg from "../../../Assets/Images/svg/empty_connections.svg";
import userImg from "../../../Assets/Images/svg/userImg.svg";
import ConnectionModal from "../../../Modal/Connections/Connection";
import {
  UserProfile,
  getConnectionData,
  getUnclaimedInfluencerData,
  getfollowerfollowingService,
} from "./Utility";
import { useAuthToken } from "../../../Shared/Reduxfetcher";
import { useProfileContext } from "../../../Shared/Context";
import msgIcon from "../../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../../Assets/Images/svg/talkshowIcon.svg";
import InfluencerSend from "../../../Modal/InfluencerSend";

const ConnectionsList = ({
  title = "",
  type = "",
  isLocked = false,
  isMyProfile,
  isLoading = false,
}) => {
  const {
    isLoginUser,
    getFollowers,
    isInfluencerChatModalOpen,
    setisInfluencerChatModalOpen,
  } = useProfileContext();
  const params = useParams();
  const display_user_id = DecryptionString(params.user_id);
  const [isLoadingConnection, setisLoadingConnection] = useState(false);
  const loginToken = useAuthToken();
  const [ConnectionsList, setConnectionsList] = useState({
    connections: [],
    allconnections: [],
    connectionscount: 0,
    allconnectionscount: 0,
    filteredConnections: [],
    filteredConnectionCount: 0,
    isLoaded: true,
  });
  const [isSeeMore, setisSeeMore] = useState(false);

  const getUserList = (val = {}) => {
    let fansList = {
      ...val,
      token: loginToken,
      type: 1,
    };
    if (!isLoginUser) {
      fansList = {
        ...fansList,
        user_id: display_user_id,
      };
    }
    getfollowerfollowingService(fansList)
      .then((res) => {
        let isFilterEnable = Object.keys(val).length !== 0;
        let finalObj = {
          ...res,
        };
        if (isFilterEnable) {
          finalObj = {
            ...ConnectionsList,
            filteredConnections: res.allconnections,
            filteredConnectionCount: res.allconnectionscount,
          };
        } else {
          finalObj = {
            ...res,
            filteredConnections: res.allconnections,
            filteredConnectionCount: res.allconnectionscount,
          };
        }
        setConnectionsList(finalObj);
      })
      .catch((err) => {})
      .finally(() => {
        setisLoadingConnection(false);
      });
  };

  const getConnectionList = (val = {}) => {
    let validData = {
      ...val,
      token: loginToken,
    };
    if (!isLoginUser) {
      validData = {
        ...validData,
        user_id: display_user_id,
      };
    }
    getConnectionData(validData)
      .then((res) => {
        let isFilterEnable = Object.keys(val).length !== 0;
        let finalObj = {
          ...res,
        };
        if (isFilterEnable) {
          finalObj = {
            ...ConnectionsList,
            filteredConnections: res.allconnections,
            filteredConnectionCount: res.allconnectionscount,
          };
        } else {
          finalObj = {
            ...res,
            filteredConnections: res.allconnections,
            filteredConnectionCount: res.allconnectionscount,
          };
        }
        setConnectionsList(finalObj);
      })
      .catch((err) => {})
      .finally(() => {
        setisLoadingConnection(false);
      });
  };

  const getUnclaimedInfluencer = (val = {}) => {
    getUnclaimedInfluencerData(loginToken, val)
      .then((res) => {
        let isFilterEnable = Object.keys(val).length !== 0;
        let finalObj = {
          ...res,
        };
        if (isFilterEnable) {
          finalObj = {
            ...ConnectionsList,
            filteredConnections: res.allconnections,
            filteredConnectionCount: res.allconnectionscount,
          };
        } else {
          finalObj = {
            ...res,
            filteredConnections: res.allconnections,
            filteredConnectionCount: res.allconnectionscount,
          };
        }
        setConnectionsList(finalObj);
      })
      .catch((err) => {})
      .finally(() => {
        setisLoadingConnection(false);
      });
  };

  const GetList = (val = {}) => {
    if (type === "influencers") {
      setisLoadingConnection("influencers");
      getUserList(val);
    } else if (type === "connections") {
      setisLoadingConnection("connections");
      getConnectionList(val);
    } else if (type === "fans") {
      setisLoadingConnection("fans");
      getFollowers(val)
        .then((res) => {
          setConnectionsList(res);
        })
        .finally(() => {
          setisLoadingConnection(false);
        });
    } else if (type === "unclaimed_influencers" && isMyProfile) {
      setisLoadingConnection("unclaimed_influencers");
      getUnclaimedInfluencer(val);
    }
  };

  useEffect(() => {
    if (loginToken && !isLoading) {
      if (!isLocked) {
        GetList();
      }
    }
  }, [loginToken, isLoading]);

  const PrivacySkeleton = ({ isLoading }) => {
    return [...Array(8)].map((ele) => {
      return (
        <div className={classes.list}>
          <Skeleton.Node
            active={false}
            style={{
              height: "60px",
              width: "60px",
              borderRadius: 50,
            }}
          >
            <img src={isLoading ? "" : userImg} />
          </Skeleton.Node>
          {isLoading ? null : (
            <Skeleton.Node
              active={false}
              style={{
                height: "10px",
                width: "fit-content",
                borderRadius: 50,
                marginTop: "5px",
              }}
            >
              <p>{"Rawcaster"}</p>
            </Skeleton.Node>
          )}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        display: !isMyProfile && type === "unclaimed_influencers" ? "none" : "",
      }}
      className={`${classes.profileThumb} ${
        !isMyProfile ? classes.othersProfileThumb : ""
      } `}
    >
      <h2 className={classes.fansHeading}>
        <div className="d-flex flex-row ">
          {title} {!isLocked ? `(${ConnectionsList.allconnectionscount})` : ""}
          {!isLocked && type === "fans" && isMyProfile && (
            <div className={classes.actionSec}>
              <img
                className={classes.actionIcon}
                src={msgIcon}
                alt="message"
                onClick={() => {
                  setisInfluencerChatModalOpen({
                    show: true,
                  });
                }}
              />
              <img
                className={classes.actionIcon}
                src={talkshowIcon}
                alt="Talkshow"
              />
            </div>
          )}
        </div>
        {!isLocked &&
          !isLoadingConnection &&
          ConnectionsList.connections.length <
            ConnectionsList.allconnectionscount && (
            <span
              onClick={() => {
                setisSeeMore(true);
              }}
            >
              See All
            </span>
          )}
      </h2>
      {isLocked ? (
        <div className={classes.lockedConnections}>
          <div className={classes.lockedoverLay}>
            <div className={classes.lockBtn}>
              <i className={classes.lock_icon}></i>
            </div>
          </div>
          <div className={classes.listSec}>
            <PrivacySkeleton />
          </div>
        </div>
      ) : (
        <>
          {ConnectionsList.isLoaded && isLoadingConnection !== type ? (
            <>
              {ConnectionsList.allconnectionscount !== 0 ? (
                <div className={`${classes.listSec} `}>
                  {ConnectionsList.connections.map((ele) => (
                    <UserProfile
                      ele={ele}
                      type={type}
                      className={classes.othersIcon}
                      getConnectionList={GetList}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {ConnectionsList.allconnectionscount === 0 && (
                    <div className={classes.emptySec}>
                      <img src={EmptyImg} alt="Empty Connections" />
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className={classes.listSec}>
              <PrivacySkeleton isLoading={true} />
            </div>
          )}
        </>
      )}
      {isSeeMore && (
        <ConnectionModal
          type={title}
          userType={type}
          open={isSeeMore}
          value={ConnectionsList}
          getConnectionList={GetList}
          onSuccess={() => {
            setisSeeMore(false);
          }}
          onClose={() => {
            setisSeeMore(false);
          }}
        />
      )}
      {isInfluencerChatModalOpen.show && (
        <InfluencerSend
          open={isInfluencerChatModalOpen.show}
          close={() => {
            setisInfluencerChatModalOpen({ show: false });
          }}
        />
      )}
    </div>
  );
};

export default ConnectionsList;
