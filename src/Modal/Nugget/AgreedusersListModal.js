import { Modal, Skeleton, Spin } from "antd";
import React, { useEffect, useState } from "react";
import classes from "./Agreedusers.module.css";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  getNuggetandCommentLikedUserListService,
  sendFriendRequestsService,
} from "../../Services/ApiService";
import {
  JSONtoformdata,
  decodeHtml,
  getAuthToken,
  getisAddFriend,
} from "../../Shared/Utility";
import { toast } from "react-hot-toast";
import { friendRequestSocket } from "../../Services/SocketList";
import { defaultprofileImg } from "../../Shared/CommonConstants";

const AgreedusersListModal = ({ open, close, formData }) => {
  const token = useAuthToken();
  const profileData = useAuthData();
  const [isLoading, setisLoading] = useState(false);
  const [ProfileList, setProfileList] = useState([]);

  const getComments = () => {
    const commentData = {
      token,
      ...formData,
    };
    getNuggetandCommentLikedUserListService(JSONtoformdata(commentData))
      .then(({ data }) => {
        if (data.status === 1) {
          setProfileList(data.userlist);
        } else {
          toast.error(data.msg);
        }
      })
      .finally(() => {
        setisLoading(false);
      });
  };

  useEffect(() => {
    if (token) {
      setisLoading(true);
      getComments();
    }
  }, [token]);

  const HandleSendRequest = (user_ref_id, user_id) => {
    let requestData = {
      token: token,
      user_ids: JSON.stringify([user_ref_id]),
      auth_code: getAuthToken(token),
    };
    sendFriendRequestsService(JSONtoformdata(requestData))
      .then((res) => {
        if (res.data.status === 1) {
          let data = {
            friend_request_id: res.data.friend_request_ids[0],
            display_name: profileData.name,
            profile_img: profileData.profile_image,
            user_id: profileData.user_id,
          };

          friendRequestSocket(user_id, data);
          let find = ProfileList.findIndex((ele) => ele.user_id === user_id);
          let tempData = [...ProfileList];
          tempData[find] = { ...tempData[find], friend_request_status: 0 };
          setProfileList(tempData);
        }
      })
      .catch((err) => {});
  };

  const isOwner = (user_id) => {
    return parseInt(profileData.user_id) === parseInt(user_id);
  };
  return (
    <Modal
      title={`Agreed Users (${ProfileList.length})`}
      open={open}
      footer={null}
      onCancel={close}
    >
      <div className={classes.profileListSec}>
        <div className={classes.profileSec}>
          {isLoading ? (
            <>
              {[...Array(6)].map(() => {
                return <Skeleton avatar paragraph={{ rows: 0 }} />;
              })}
            </>
          ) : (
            <>
              {ProfileList.map((ele) => (
                <div className={classes.profileData}>
                  <div className={classes.leftSec}>
                    <img
                      src={ele.profile_image}
                      alt={decodeHtml(ele.name)}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.src = defaultprofileImg;
                      }}
                    />
                    <div className={classes.nameSec}>
                      <p>{decodeHtml(ele.name)}</p>
                      {isOwner(ele.user_id) && <p>{`  (You)`}</p>}
                    </div>
                  </div>
                  <div className={classes.rightSec}>
                    {/* {ele.follow === false && (
                  <div
                    className={classes.becameFanBtn}
                    onClick={() => {
                      HandleBecameaFan(token, ele.user_ref_id).then(() => {
                        let find = ProfileList.findIndex(
                          (elem) => elem.user_id === ele.user_id
                        );
                        let tempData = [...ProfileList];
                        tempData[find] = { ...tempData[find], follow: true };
                        setProfileList(tempData);
                      });
                    }}
                  >
                    +
                  </div>
                )} */}
                    {getisAddFriend(ele.friend_request_status) &&
                    !isOwner(ele.user_id) ? (
                      <div
                        className={classes.addFriendSec}
                        onClick={() => {
                          HandleSendRequest(ele.user_ref_id, ele.user_id);
                        }}
                      >
                        <span className="material-symbols-outlined">
                          person_add
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AgreedusersListModal;
