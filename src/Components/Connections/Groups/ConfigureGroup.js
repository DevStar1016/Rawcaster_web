import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { EditGroupMembers, GroupHeader, SelectConnections } from "./Utility";
import classes from "./Groups.module.css";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import {
  JSONtoformdata,
  filterValidObject,
  getusetId,
} from "../../../Shared/Utility";
import {
  useAuthData,
  useAuthToken,
  useDashboard,
  useFriends,
} from "../../../Shared/Reduxfetcher";
import {
  addFriendGroupService,
  addFriendsToGroupService,
  editFriendGroupService,
  exitFromGroupService,
  groupAbuseReportService,
  removeFriendsfFromGroupService,
} from "../../../Services/ApiService";
import { ConfigureGroupContext } from "../../../Shared/Context";
import { deleteFriendGroupService } from "../../../Services/ApiService";
import { useDispatch } from "react-redux";
import {
  handleAddGroupData,
  handleDeleteGroupData,
  handleUpdateGroupData,
} from "../../../Store/Redux/Reducer/DashboardReducer";
import { groupFunctionalitySocket } from "./Methods";
import { GROUP_CHAT_PROCESS_TYPE } from "./Constants";
import { sendMessage } from "../../../Services/SocketService";

const ConfigureGroup = ({ groupId, close, open }) => {
  const { groupsList } = useDashboard();
  const friends = useFriends();
  const dispatch = useDispatch();
  const [GroupMembers, setGroupMembers] = useState([]);
  const [GroupData, setGroupData] = useState();
  const token = useAuthToken();
  const userData = useAuthData();
  const [isOwner, setisOwner] = useState(false);
  const [isAddMember, setisAddMember] = useState(false);

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
    setValues,
  } = useFormik({
    initialValues: {
      group_name: "",
      group_members: "",
      group_icon: "",
    },
    validationSchema: yup.object().shape({
      group_name: yup
        .string()
        .required(`Please input your Group Name!`)
        .test(
          "Group Names test",
          "Group name does not include My Fans",
          function (value) {
            let invalidString = "My Fans";
            const lowerCaseStr =
              invalidString?.toLowerCase() === value?.toLowerCase();
            // const withoutSpaces =
            //   invalidString.replace(/\s+(?=\S+\s)/g, "") ===
            //   value.replace(/\s+(?=\S+\s)/g, "");
            if (lowerCaseStr) {
              return false;
            }
            return true;
          }
        ),
      group_members: yup.string().required(`Please select Atleast One Member!`),
    }),
    onSubmit: (values) => {
      if (isAddMember) {
        HandleAddFriendstoGroup(values.group_members);
      } else {
        HandleModifyGroup(filterValidObject(values));
      }
    },
  });

  const handleClose = () => {
    if (isAddMember) {
      setisAddMember(false);
    } else {
      close();
    }
  };

  const getModifyType = (values) => {
    if (groupId) {
      return editFriendGroupService(JSONtoformdata(values));
    } else {
      return addFriendGroupService(JSONtoformdata(values));
    }
  };

  // Create or Edit Group

  const HandleModifyGroup = (value, closable = true) => {
    if (closable) {
      close();
    }
    let finalCreateObject = {
      ...value,
      token,
    };
    if (groupId) {
      finalCreateObject = {
        ...finalCreateObject,
        group_id: groupId,
      };
      delete finalCreateObject["group_members"];
      if (typeof value.group_icon === "string") {
        delete finalCreateObject["group_icon"];
      }
    }
    getModifyType(finalCreateObject)
      .then((res) => {
        if (res.data.status === 1) {
          let message = {
            groupId: res.data.group_details.group_id,
            userId: userData.user_id,
            processType: GROUP_CHAT_PROCESS_TYPE.createGroup,
            groupData: res.data.group_details,
          };
          groupFunctionalitySocket(message);
          if (groupId) {
            dispatch(
              handleUpdateGroupData({
                Group: res.data.group_details,
                id: groupId,
              })
            );
          } else {
            dispatch(handleAddGroupData(res.data.group_details));
          }
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const GetGroupDetail = () => {
    let findData = groupsList.find(
      (ele) => parseInt(ele.group_id) === parseInt(groupId)
    );
    if (findData) {
      setGroupData(findData);
      if (findData?.locked !== 1) {
        let members = [...findData?.group_members_list];
        let findUser = members.findIndex(
          (ele) =>
            getusetId(parseInt(ele.user_id)) === parseInt(userData?.user_id)
        );
        console.log(members, "setGroupMemberssetGroupMembers");
        if (findUser !== -1) {
          let removedObj = members.splice(findUser, 1)[0];
          members.splice(0, 0, removedObj);
          setGroupMembers(members);
          setisOwner(
            getusetId(parseInt(findData?.group_owner)) ===
              parseInt(userData?.user_id)
          );
        }
        setValues((pre) => ({
          group_name: findData?.group_name,
          group_icon: findData?.group_icon,
          group_members: findUser
            ? JSON.stringify(findData?.group_member_ids)
            : [],
        }));
      } else {
        setValues((pre) => ({
          ...pre,
          group_name: findData?.group_name,
          group_icon: findData?.group_icon,
        }));
      }
    } else {
      if (!isOwner) {
        toast.error(
          "Either you've been removed from the group or the group has been deleted by the owner"
        );
      }

      close();
    }
  };

  useEffect(() => {
    if (groupId) {
      GetGroupDetail();
    }
  }, [groupsList]);

  const HandleDeleteGroup = () => {
    const deleteData = {
      token,
      group_id: groupId,
    };
    deleteFriendGroupService(JSONtoformdata(deleteData))
      .then((res) => {
        if (res.data.status === 1) {
          dispatch(handleDeleteGroupData(groupId));
          let message = {
            groupId: groupId,
            userId: userData.user_id,
            processType: GROUP_CHAT_PROCESS_TYPE.deleteGroup,
            groupData: null,
          };
          groupFunctionalitySocket(message);
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        close();
      });
  };
  const HandleAddFriendstoGroup = (members) => {
    const addUser = {
      token,
      group_id: groupId,
      group_members: members,
    };

    addFriendsToGroupService(JSONtoformdata(addUser))
      .then((res) => {
        if (res.data.status === 1) {
          const GroupDetails = groupsList.find(
            (ele) => ele.group_id === parseInt(groupId)
          );

          let updatedGroup = {
            ...GroupDetails,
            group_member_count: GroupDetails.group_member_count + 1,
            group_members_list: [
              ...GroupDetails.group_members_list,
              ...res.data.memberdetails,
            ],
          };
          let message = {
            groupId: GroupDetails.group_id,
            userId: userData.user_id,
            processType: GROUP_CHAT_PROCESS_TYPE.addGroupMember,
            createdBy: userData.name,
            added_user_ids: JSON.parse(members),
            groupData: updatedGroup,
          };
          groupFunctionalitySocket(message);
          dispatch(
            handleUpdateGroupData({
              Group: updatedGroup,
              id: groupId,
            })
          );
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        handleClose();
      });
  };

  const HandleDeleteFriendstoGroup = (user_id) => {
    const GroupDetails = groupsList.find(
      (ele) => ele.group_id === parseInt(groupId)
    );
    let updatedGroup = {
      ...GroupDetails,
      group_member_count: GroupDetails.group_member_count - 1,
      group_members_list: GroupDetails.group_members_list.filter(
        (elem) => elem.user_id !== parseInt(user_id)
      ),
    };
    let message = {
      groupId: groupId,
      userId: userData.user_id,
      processType: GROUP_CHAT_PROCESS_TYPE.removeGroupMember,
      createdBy: userData.name,
      removed_user_id: user_id,
      groupData: updatedGroup,
    };
    groupFunctionalitySocket(message);
    const deleteUser = {
      token,
      group_id: groupId,
      group_members: JSON.stringify([user_id]),
    };
    removeFriendsfFromGroupService(JSONtoformdata(deleteUser))
      .then((res) => {
        if (res.data.status === 1) {
          setGroupMembers((pre) =>
            pre.filter((ele) => ele.user_id !== user_id)
          );

          dispatch(
            handleUpdateGroupData({
              Group: updatedGroup,
              id: groupId,
            })
          );
          toast.success(res.data.msg);
        } else {
          if (typeof res?.data?.msg === "string") {
            toast.error(res.data.msg);
          } else {
            toast.error("Something went wrong");
          }
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const getValidConnections = () => {
    if (groupId) {
      const TempMemberArray = GroupMembers.map((ele) => ele.user_id);
      return friends.filter((ele) => !TempMemberArray.includes(ele.user_id));
    }
    return friends;
  };

  const handleReportGroup = (value) => {
    const reportData = {
      ...value,
      group_id: groupId,
      token,
    };
    groupAbuseReportService(JSONtoformdata(reportData))
      .then((res) => {
        if (res.data.status === 1) {
          dispatch(handleDeleteGroupData(groupId));
          let message = {
            groupId: groupId,
            userId: userData.user_id,
            processType: GROUP_CHAT_PROCESS_TYPE.exitGroup,
          };
          groupFunctionalitySocket(message);
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch(() => {});
  };

  const handleExitGroup = () => {
    const exitData = {
      group_id: groupId,
      token,
    };
    exitFromGroupService(JSONtoformdata(exitData))
      .then((res) => {
        if (res.data.status === 1) {
          dispatch(handleDeleteGroupData(groupId));
          let message = {
            groupId: groupId,
            userId: userData.user_id,
            processType: GROUP_CHAT_PROCESS_TYPE.exitGroup,
          };
          groupFunctionalitySocket(message);
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch(() => {});
  };

  const handleMemberChat = (status) => {
    setGroupData((pre) => ({
      ...pre,
      chat_enabled: status ? 1 : 0,
    }));
    let message = {
      event: "groupchatenable",
      groupId: groupId,
      userId: userData.user_id,
      status: status ? 1 : 0,
    };
    sendMessage(message, "groupchatting");
  };
  return (
    <Modal
      title={groupId ? "Edit Group" : "Add Group"}
      open={open}
      footer={[null]}
      closable
      onCancel={() => {
        handleClose();
      }}
    >
      <ConfigureGroupContext.Provider
        value={{
          isOwner,
          GroupMembers,
          GroupData,
          groupId,
          values,
          handleChange,
          handleSubmit,
          setFieldValue,
          errors,
          touched,
          setisAddMember,
          isAddMember,
          HandleDeleteGroup,
          HandleAddFriendstoGroup,
          HandleDeleteFriendstoGroup,
          GetGroupDetail,
          HandleModifyGroup,
          getValidConnections,
          handleReportGroup,
          handleExitGroup,
          close,
          handleMemberChat,
        }}
      >
        <div className={classes.AddGroupContainer}>
          <GroupHeader />
          {groupId && !isAddMember ? (
            <EditGroupMembers />
          ) : (
            <SelectConnections />
          )}
        </div>
      </ConfigureGroupContext.Provider>
    </Modal>
  );
};

export default ConfigureGroup;
