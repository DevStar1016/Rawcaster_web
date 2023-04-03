import { Modal, Spin } from "antd";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { sendFriendRequestsService } from "../../../Services/ApiService";
import { friendRequestSocket } from "../../../Services/SocketList";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import {
  decodeHtml,
  getAuthToken,
  JSONtoformdata,
} from "../../../Shared/Utility";
import classes from "../Connections.module.css";
import SearchFriends from "../Components/SearchFriends";

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
          tempData[find] = { ...tempData[find], friend_request_status: "0" };
          setProfileList(tempData);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <Modal
      title="Add Connection"
      open={open}
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
                <img src={ele.profile_img} />
                <div className={classes.nameSec}>
                  <p>{decodeHtml(ele.display_name)}</p>
                  {/* <span>@TheTweetOfGod</span> */}
                </div>
              </div>
              <div className={classes.rightSec}>
                {ele.friend_request_status === "" ? (
                  <span
                    class="material-symbols-outlined"
                    onClick={() => {
                      HandleSendRequest(ele.user_ref_id, ele.user_id);
                    }}
                  >
                    person_add
                  </span>
                ) : parseInt(ele.friend_request_status) === 0 ? (
                  <span class="material-symbols-outlined">done</span>
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
