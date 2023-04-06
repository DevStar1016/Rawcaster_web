import React, { useEffect, useState } from "react";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import classes from "../Connections.module.css";
import { listAllFriendGroupsService } from "../../../Services/ApiService";
import { useDispatch } from "react-redux";
import { handleGroupsList } from "../../../Store/Redux/Reducer/DashboardReducer";
import Group from "../Components/Group";
import { getAuthToken } from "../../../Shared/Utility";

const Groups = () => {
  const dispatch = useDispatch();
  const profileData = useAuthData();
  const userToken = useAuthToken();
  const [searchInput, setsearchInput] = useState("");
  //   const [isAddFriend, setisAddFriend] = useState(false);
  const [loading, setloading] = useState(false);
  const [groups, setgroups] = useState([]);

  const getValidData = (data) => {
    if (data && data.length !== 0) {
      const filteredArr = data.reduce((acc, current) => {
        const x = acc.find((item) => item.group_id === current.group_id);
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
    if (profileData) {
      setloading(true);
      var formData = new FormData();
      formData.append("token", userToken);
      formData.append("auth_code", getAuthToken(userToken));
      listAllFriendGroupsService(formData)
        .then((response) => {
          if (response.data.status === 1) {
            let user_group_list = response.data.friend_group_list.filter(
              (ele) => {
                return ele.group_owner === profileData.user_id;
              }
            );
            setgroups(user_group_list);
            dispatch(handleGroupsList(user_group_list));
          }
        })
        .catch((error) => {})
        .finally(() => {
          setloading(false);
        });
    }
  }, [userToken, dispatch, profileData]);

  return (
    <div className={classes.myconnectioin}>
      <h2>
        My Groups <span>({groups.length})</span>
        {getValidData(groups)?.length !== 0 && !loading ? (
          <i
            class="material-symbols-outlined"
            // onClick={() => {
            //   setisAddFriend(true);
            // }}
          >
            add
          </i>
        ) : null}
      </h2>
      <input
        className={classes.textBox}
        onChange={(e) => setsearchInput(e.target.value)}
        value={searchInput}
        placeholder="Search Groups"
        autoComplete="off"
      />

      <div
        className={
          getValidData(groups)?.length === 0 && !loading
            ? classes.connectionsEmpty
            : classes.connectionsLists
        }
      >
        {getValidData(groups)?.map((group) => {
          return <Group group={group} searchInput={searchInput} />;
        })}
      </div>
      {/* <AddConnection
        open={isAddFriend}
        friends={friends}
        setfriends={setfriends}
        close={() => {
          setisAddFriend(false);
        }}
      /> */}
    </div>
  );
};

export default Groups;
