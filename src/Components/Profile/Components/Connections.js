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
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { useProfileContext } from "../../../Shared/Context";
import msgIcon from "../../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../../Assets/Images/svg/talkshowIcon.svg";
import InfluencerSend from "../../../Modal/InfluencerSend";
import { fetchuserInfobyToken } from "../../../Store/Redux/Action";
import { useDispatch } from "react-redux";

const ConnectionsList = ({
  title = "",
  type = "",
  isLocked = false,
  isMyProfile,
  isLoading = false,
}) => {
  const dispatch = useDispatch();
  const {
    isLoginUser,
    getFollowers,
    isInfluencerChatModalOpen,
    setisInfluencerChatModalOpen,
  } = useProfileContext();
  const params = useParams();
  const loginUserData = useAuthData();
  const [isLoadMore, setisLoadMore] = useState(false);
  const display_user_id = DecryptionString(params.user_id);
  const [isLoadingConnection, setisLoadingConnection] = useState(false);
  const [Page, setPage] = useState({
    pages: 1,
    total_pages: 1,
  });
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

  const HandleConnections = (res, page, val) => {
    let isFilterEnable = Object.keys(val).length !== 0;
    setPage({
      pages: res.data.current_page_no,
      total_pages: res.data.total_pages,
    });
    if (isFilterEnable) {
      if (page === 1) {
        setConnectionsList((pre) => {
          return {
            ...pre,
            allconnections: res.allconnections,
            filteredConnections: res.allconnections,
            filteredConnectionCount: res.allconnectionscount,
          };
        });
      } else {
        setConnectionsList((pre) => {
          return {
            ...pre,
            allconnections: [...pre.allconnections, ...res.allconnections],
            filteredConnections: [...pre.allconnections, ...res.allconnections],
            filteredConnectionCount: res.allconnectionscount,
          };
        });
      }
    } else {
      if (page === 1) {
        setConnectionsList((pre) => {
          return {
            ...res,
            allconnections: res.allconnections,
            filteredConnections: res.allconnections,
            filteredConnectionCount: res.allconnectionscount,
          };
        });
      } else {
        setConnectionsList((pre) => {
          return {
            ...pre,
            allconnections: [...pre.allconnections, ...res.allconnections],
            filteredConnections: [...pre.allconnections, ...res.allconnections],
            filteredConnectionCount: res.allconnectionscount,
          };
        });
      }
    }
  };

  const getUserList = (val = {}, page = Page.pages) => {
    let fansList = {
      ...val,
      token: loginToken ? loginToken : "RAWCAST",
      type: 1,
      page_number: page,
    };
    if (!isLoginUser) {
      fansList = {
        ...fansList,
        user_id: display_user_id,
      };
    }
    getfollowerfollowingService(fansList)
      .then((res) => {
        HandleConnections(res, page, val);
      })
      .catch((err) => {})
      .finally(() => {
        setisLoadMore(false);
        setisLoadingConnection(false);
      });
  };

  const getConnectionList = (val = {}, page = Page.pages) => {
    let validData = {
      ...val,
      token: loginToken ? loginToken : "RAWCAST",
      page_number: page,
    };
    if (!isLoginUser) {
      validData = {
        ...validData,
        user_id: display_user_id,
      };
    }
    getConnectionData(validData)
      .then((res) => {
        HandleConnections(res, page, val);
      })
      .catch((err) => {})
      .finally(() => {
        setisLoadMore(false);
        setisLoadingConnection(false);
      });
  };

  const getUnclaimedInfluencer = (val = {}, page = Page.pages) => {
    getUnclaimedInfluencerData(loginToken, val, page)
      .then((res) => {
        HandleConnections(res, page, val);
      })
      .catch((err) => {})
      .finally(() => {
        setisLoadMore(false);
        setisLoadingConnection(false);
      });
  };

  const GetList = (val = {}, page = Page.pages) => {
    if (type === "influencers") {
      getUserList(val, page);
    } else if (type === "connections") {
      getConnectionList(val, page);
    } else if (type === "fans") {
      getFollowers(val, page)
        .then((res) => {
          if (
            isLoginUser &&
            loginUserData?.followers_count !== res?.data?.follow_count
          ) {
            dispatch(fetchuserInfobyToken(loginToken));
          }
          setConnectionsList(res);
        })
        .finally(() => {
          setisLoadingConnection(false);
        });
    } else if (type === "unclaimed_influencers" && isMyProfile) {
      getUnclaimedInfluencer(val, page);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (!isLocked) {
        setisLoadingConnection(type);
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
          isLoadMore={isLoadMore}
          getConnectionList={GetList}
          setisLoadMore={setisLoadMore}
          onSuccess={() => {
            setisSeeMore(false);
          }}
          onClose={() => {
            setisSeeMore(false);
          }}
          page={Page.pages}
          total_page={Page.total_pages}
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
