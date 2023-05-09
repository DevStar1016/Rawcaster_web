import React, { useEffect, useState } from "react";
import classes from "./ProfilerRight.module.css";
import { useNavigate, useParams } from "react-router";
import {
  DecryptionString,
  EncryptionString,
  handleProfileNavigate,
} from "../../../Shared/Utility";
import { Skeleton } from "antd";
import EmptyImg from "../../../Assets/Images/svg/empty_connections.svg";
import ConnectionModal from "../../../Modal/Connections/Connection";
import {
  getConnectionData,
  getUnclaimedInfluencerData,
  getfollowerfollowingService,
} from "./Utility";
import { useAuthToken, useNuggets } from "../../../Shared/Reduxfetcher";
import { useProfileContext } from "../../../Shared/Context";
import msgIcon from "../../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../../Assets/Images/svg/talkshowIcon.svg";
import { useDispatch } from "react-redux";
import InfluencerSend from "../../../Modal/InfluencerSend";
import ClaimAccount from "../../../Modal/Connections/ClaimAccount";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import { socketListen } from "../../../Services/SocketService";

const ConnectionsList = ({
  title = "",
  type = "",
  isLocked = false,
  isMyProfile,
}) => {
  const { isLoginUser, setFansList, getFollowers } = useProfileContext();
  const params = useParams();
  const dispatch = useDispatch();
  const display_user_id = DecryptionString(params.user_id);
  const [isInfluencerChatModalOpen, setisInfluencerChatModalOpen] = useState({
    show: false,
  });
  const [ClaimAccountModal, setClaimAccountModal] = useState({
    id: "",
    show: false,
  });
  const loginToken = useAuthToken();
  const { nuggetFormData } = useNuggets();
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
  const navigate = useNavigate();

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
      .catch((err) => {});
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
      .catch((err) => {});
  };

  const getUnclaimedInfluencer = () => {
    getUnclaimedInfluencerData(loginToken)
      .then((res) => {
        setConnectionsList(res);
      })
      .catch((err) => {});
  };

  const GetList = (val = {}) => {
    if (type === "influencers") {
      getUserList(val);
    } else if (type === "connections") {
      getConnectionList(val);
    } else if (type === "fans") {
      getFollowers(val).then((res) => {
        setConnectionsList(res);
      });
    } else if (type === "unclaimed_influencers") {
      getUnclaimedInfluencer(val);
    }
  };

  useEffect(() => {
    if (loginToken) {
      GetList();
    }
  }, [loginToken]);

  useEffect(() => {
    socketListen.on("connect", (message) => {
      console.log(message);
    });
    socketListen.on("groupchatting", (message) => {
      switch (message.event) {
        case "groupchatmessage":
          console.log(message);
          break;
      }
    });
  }, []);

  const PrivacySkeleton = () => {
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
            <img src={""} />
          </Skeleton.Node>
          <Skeleton.Node
            active={false}
            style={{
              height: "10px",
              width: "fit-content",
              borderRadius: 50,
              marginTop: "5px",
            }}
          >
            <p>{"User1234"}</p>
          </Skeleton.Node>
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
      }`}
    >
      <h2>
        {title} {!isLocked ? `(${ConnectionsList.allconnectionscount})` : ""}
        {!isLocked && type === "fans" && (
          <div style={{ display: isLoginUser ? "" : "none" }}>
            <img
              className={classes.actionIcon}
              src={msgIcon}
              onClick={() => {
                setisInfluencerChatModalOpen({
                  show: true,
                });
              }}
            />
            <img className={classes.actionIcon} src={talkshowIcon} />
          </div>
        )}
        {!isLocked &&
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
          {ConnectionsList.isLoaded ? (
            <>
              {ConnectionsList.allconnectionscount !== 0 ? (
                <div className={`${classes.listSec} `}>
                  {ConnectionsList.connections.map((ele) => {
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
                          <div className={classes.iconSec}>
                            {type === "influencers" && isLoginUser ? (
                              <i
                                className={classes.messageIcon}
                                onClick={() => {}}
                              />
                            ) : type === "unclaimed_influencers" &&
                              isLoginUser ? (
                              <i
                                className={classes.sheildIcon}
                                onClick={() => {
                                  navigate(
                                    `/claim/${EncryptionString(ele.user_id)}`
                                  );
                                }}
                              />
                            ) : null}
                          </div>
                          <img
                            src={ele?.profile_img || ""}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = defaultprofileImg;
                            }}
                            onClick={() => {
                              let finalData = {
                                dispatch,
                                navigate,
                                nuggetFormData,
                                user_id: ele.user_id,
                              };
                              handleProfileNavigate(finalData);
                              setFansList({
                                connections: [],
                                allconnections: [],
                                connectionscount: 0,
                                allconnectionscount: 0,
                                isLoaded: true,
                              });
                            }}
                          />
                        </Skeleton.Node>
                        <p
                          onClick={() => {
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
                  })}
                </div>
              ) : (
                <>
                  {ConnectionsList.allconnectionscount === 0 && (
                    <div className={classes.emptySec}>
                      <img src={EmptyImg} />
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className={classes.listSec}>
              <PrivacySkeleton isActive={true} />
            </div>
          )}
        </>
      )}
      {isSeeMore && (
        <ConnectionModal
          type={title}
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
      <ClaimAccount
        visible={ClaimAccountModal.show}
        id={ClaimAccountModal.id}
        onSuccess={() => {
          getUnclaimedInfluencer();
          setClaimAccountModal({
            id: "",
            show: false,
          });
        }}
        onClose={() => {
          setClaimAccountModal({
            id: "",
            show: false,
          });
        }}
      />
    </div>
  );
};

export default ConnectionsList;
