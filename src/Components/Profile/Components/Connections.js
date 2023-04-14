import React, { useEffect, useState } from "react";
import classes from "./ProfilerRight.module.css";
import { useNavigate, useParams } from "react-router";
import {
  DecryptionString,
  handleProfileNavigate,
} from "../../../Shared/Utility";
import { Skeleton } from "antd";
import EmptyImg from "../../../Assets/Images/svg/empty_connections.svg";
import ConnectionModal from "../../../Modal/Connections/Connection";
import { getConnectionData, getfollowerfollowingService } from "./Utility";
import { toast } from "react-hot-toast";
import { useAuthToken, useNuggets } from "../../../Shared/Reduxfetcher";
import { useProfileContext } from "../../../Shared/Context";
import msgIcon from "../../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../../Assets/Images/svg/talkshowIcon.svg";
import { useDispatch } from "react-redux";
import InfluencerSend from "../../../Modal/InfluencerSend";

const ConnectionsList = ({ title = "", type = "" }) => {
  const { isLoginUser, FansList } = useProfileContext();
  const params = useParams();
  const dispatch = useDispatch();
  const display_user_id = DecryptionString(params.user_id);
  const [isInfluencerChatModalOpen, setisInfluencerChatModalOpen] = useState({
    user: "",
    show: false,
  });
  const loginToken = useAuthToken();
  const { nuggetFormData } = useNuggets();
  const [ConnectionsList, setConnectionsList] = useState({
    connections: [],
    allconnections: [],
    connectionscount: 0,
    allconnectionscount: 0,
    isLoaded: true,
  });
  const [isSeeMore, setisSeeMore] = useState(false);
  const navigate = useNavigate();

  const getUserList = () => {
    let fansList = {
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
        setConnectionsList(res);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const getConnectionList = () => {
    getConnectionData(loginToken)
      .then((res) => {
        setConnectionsList(res);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (type === "influencers") {
      getUserList();
    } else if (type === "connections") {
      getConnectionList();
    } else if (type === "fans") {
      setConnectionsList(FansList);
    }
  }, [FansList]);

  return (
    <div className={classes.profileThumb}>
      <h2>
        {title} ({ConnectionsList.allconnectionscount})
        {type === "fans" && (
          <>
            <img className={classes.actionIcon} src={msgIcon} />
            <img className={classes.actionIcon} src={talkshowIcon} />
          </>
        )}
        {ConnectionsList.connections.length <
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

      {ConnectionsList.isLoaded ? (
        <>
          {ConnectionsList.allconnectionscount !== 0 ? (
            <div className={classes.listSec}>
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
                            onClick={() => {
                              setisInfluencerChatModalOpen({
                                user: ele,
                                show: true,
                              });
                            }}
                          />
                        ) : null}
                      </div>
                      <img
                        src={ele.profile_img}
                        onClick={() => {
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
          {[...Array(8)].map((ele) => {
            return (
              <div className={classes.list}>
                <Skeleton.Node
                  active={true}
                  style={{ height: "70px", width: "70px", borderRadius: 50 }}
                >
                  <img src={""} />
                </Skeleton.Node>
              </div>
            );
          })}
        </div>
      )}
      <ConnectionModal
        type={title}
        open={isSeeMore}
        value={ConnectionsList}
        setisInfluencerChatModalOpen={setisInfluencerChatModalOpen}
        onSuccess={() => {
          setisSeeMore(false);
        }}
        onClose={() => {
          setisSeeMore(false);
        }}
      />
      <InfluencerSend
        open={isInfluencerChatModalOpen.show}
        user={isInfluencerChatModalOpen.user}
        close={() => {
          setisInfluencerChatModalOpen({ user: "", show: false });
        }}
      />
    </div>
  );
};

export default ConnectionsList;
