import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { listAllFriendGroupsService } from "../../Services/ApiService";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { handleGroupsList } from "../../Store/Redux/Reducer/DashboardReducer";
import { getAuthToken } from "../../Shared/Utility";

const Groups = () => {
  const dispatch = useDispatch();
  const profileData = useAuthData();
  const userToken = useAuthToken();

  useEffect(() => {
    if (profileData) {
      var formData = new FormData();
      formData.append("token", userToken);
      formData.append("auth_code", getAuthToken(userToken));
      listAllFriendGroupsService(formData)
        .then((response) => {
          if (response.data.status === 1) {
            dispatch(handleGroupsList(response.data.friend_group_list));
          }
        })
        .catch((error) => {});
    }
  }, [userToken, dispatch, profileData]);
  return <div></div>;
};

export default Groups;
