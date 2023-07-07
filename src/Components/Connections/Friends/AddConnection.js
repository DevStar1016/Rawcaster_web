import { Modal, Spin } from "antd";
import React, { useState } from "react";
import { sendFriendRequestsService } from "../../../Services/ApiService";
import { friendRequestSocket } from "../../../Services/SocketList";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import {
  decodeHtml,
  getAuthToken,
  getisAddFriend,
  JSONtoformdata,
} from "../../../Shared/Utility";
import classes from "../Connections.module.css";
import SearchFriends from "../Components/SearchFriends";
import { defaultprofileImg } from "../../../Shared/CommonConstants";
import { HandleBecameaFan } from "../../../Shared/SharedAPIs";

const AddConnection = ({ open, close }) => {
  const token = useAuthToken();
  const profileData = useAuthData();
  const [isLoading, setisLoading] = useState(false);
  const [ProfileList, setProfileList] = useState([]);
  const [SearchData, setSearchData] = useState("");
  const [Pages, setPages] = useState({
    page: "",
    totalpage: "",
  });

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

  return (
    <Modal
      title="Add Connection"
      open={open}
      className="modalSec"
      footer={[null]}
      closable
      onCancel={() => {
        close();
        setSearchData("");
        setProfileList([]);
      }}
    >
      <div className={classes.profileListSec}>
        <SearchFriends
          setPages={setPages}
          Pages={Pages}
          SearchData={SearchData}
          setSearchData={setSearchData}
          loadingStatus={(status) => {
            setisLoading(status);
          }}
          onResult={(val) => {
            setProfileList(val);
          }}
        />
        <div className={classes.profileSec}>
          {isLoading ? <Spin /> : null}
          {ProfileList.map((ele) => (
            <div className={classes.profileData}>
              <div className={classes.leftSec}>
                <img
                  src={ele.profile_img}
                  alt={decodeHtml(ele.display_name)}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = defaultprofileImg;
                  }}
                />
                <div className={classes.nameSec}>
                  <p>{decodeHtml(ele.display_name)}</p>
                  {/* <span>@TheTweetOfGod</span> */}
                </div>
              </div>
              <div className={classes.rightSec}>
                {ele.follow === false && (
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
                )}
                {getisAddFriend(ele.friend_request_status) ? (
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
        </div>
      </div>
    </Modal>
  );
};

export default AddConnection;
