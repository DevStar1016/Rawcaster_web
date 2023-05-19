import React, { useEffect } from "react";
import { socketListen } from "../../Services/SocketService";
import { GROUP_CHAT_PROCESS_TYPE } from "../Connections/Groups/Constants";
import { useDispatch } from "react-redux";
import {
  handleAddGroupData,
  handleDeleteGroupData,
  handleUpdateGroupData,
} from "../../Store/Redux/Reducer/DashboardReducer";
import store from "../../Store/Redux/Config/Store";

const SocketComponent = () => {
  const dispatch = useDispatch();
  const handleGroupChatMessageTransfer = (message) => {
    const userData = store.getState().auth.loginUserData;
    switch (message.processType) {
      case GROUP_CHAT_PROCESS_TYPE.createGroup:
        dispatch(handleAddGroupData(message.groupData));
        break;
      case GROUP_CHAT_PROCESS_TYPE.editGroup:
        dispatch(
          handleUpdateGroupData({
            Group: message.groupData,
            id: message.groupId,
          })
        );
        break;
      case GROUP_CHAT_PROCESS_TYPE.deleteGroup:
        dispatch(handleDeleteGroupData(message.groupId));
        break;
      case GROUP_CHAT_PROCESS_TYPE.removeGroupMember:
        if (message.removed_user_id === userData.user_id) {
          dispatch(handleDeleteGroupData(message.groupId));
        } else {
          dispatch(
            handleUpdateGroupData({
              Group: message.groupData,
              id: message.groupId,
            })
          );
        }
        break;
      case GROUP_CHAT_PROCESS_TYPE.addGroupMember:
        if (message.added_user_ids.includes(userData.user_id)) {
          dispatch(handleAddGroupData(message.groupData));
        } else {
          dispatch(
            handleUpdateGroupData({
              Group: message.groupData,
              id: message.groupId,
            })
          );
        }
        break;
      case GROUP_CHAT_PROCESS_TYPE.exitGroup:
        const groupList = store.getState().dashboard.groupsList;
        const findData = groupList.find(
          (ele) => ele.group_id === message.groupId
        );
        const updatedData = {
          ...findData,
          group_members_list: findData.group_members_list.filter(
            (ele) => ele.user_id !== message.userId
          ),
        };
        dispatch(
          handleUpdateGroupData({
            Group: updatedData,
            id: message.groupId,
          })
        );
        break;
    }
  };

  useEffect(() => {
    socketListen.on("connect", () => {
      console.log("Socket connected");
    });
    socketListen.on("disconnect", (reason) => {
      console.log("Socket disconnected");
    });

    socketListen.on(
      "groupchatting",
      (message) => {
        switch (message.event) {
          case "groupchatmsgtransfer":
            handleGroupChatMessageTransfer(message);
            break;
          case "groupchatenable":
            const groupList = store.getState().dashboard.groupsList;
            const findData = groupList.find(
              (ele) => ele.group_id === message.groupId
            );
            if (findData) {
              dispatch(
                handleUpdateGroupData({
                  Group: {
                    ...findData,
                    status: message.status,
                  },
                  id: message.groupId,
                })
              );
            }
            break;
        }
      },
      []
    );
    return () => {
      socketListen.off("call");
    };
  }, []);
  return <></>;
};

export default SocketComponent;
