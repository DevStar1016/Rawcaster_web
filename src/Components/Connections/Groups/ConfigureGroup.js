import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { EditGroupMembers, GroupHeader, SelectConnections } from "./Utility";
import classes from "./Groups.module.css";

import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import * as yup from "yup";
import { JSONtoformdata, filterValidObject } from "../../../Shared/Utility";
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
import ReportGroup from "../../../Modal/Report/ReportGroup";
import { CreateGroupSocket, groupFunctionalitySocket } from "./Methods";
import { GROUP_CHAT_PROCESS_TYPE } from "./Constants";

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
        .test(
          "Group Names test",
          "Group name does not include My Fans",
          function (value) {
            let invalidString = "My Fans";
            const lowerCaseStr =
              invalidString.toLowerCase() === value.toLowerCase();
            // const withoutSpaces =
            //   invalidString.replace(/\s+(?=\S+\s)/g, "") ===
            //   value.replace(/\s+(?=\S+\s)/g, "");
            if (lowerCaseStr) {
              return false;
            }
            return true;
          }
        )
        .required(`Please input your Group Name!`),
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
      if (typeof value.group_icon === "string") {
        delete finalCreateObject["group_icon"];
      }
    }
    getModifyType(finalCreateObject)
      .then((res) => {
        if (res.data.status === 1) {
          let message = {
            group_id: res.data.group_details.group_id,
            userId: userData.user_id,
            processType: GROUP_CHAT_PROCESS_TYPE.createGroup,
            groupData: res.data.group_details,
          };
          groupFunctionalitySocket(message);
          if (groupId) {
            const findIndex = groupsList.findIndex(
              (ele) => ele.group_id === parseInt(groupId)
            );
            groupFunctionalitySocket(message);
            dispatch(
              handleUpdateGroupData({
                Group: res.data.group_details,
                index: findIndex,
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
      let members = [...findData?.group_members_list];
      let findUser = members.findIndex(
        (ele) => parseInt(ele.user_id) === parseInt(userData?.user_id)
      );

      let removedObj = members.splice(findUser, 1)[0];
      members.splice(0, 0, removedObj);
      setGroupMembers(members);
      setisOwner(
        parseInt(findData?.group_owner) === parseInt(userData?.user_id)
      );
      setValues((pre) => ({
        group_name: findData?.group_name,
        group_icon: findData?.group_icon,
        group_members: JSON.stringify(findData?.group_member_ids),
      }));
    }
  };

  useEffect(() => {
    if (groupId) {
      GetGroupDetail();
    }
  }, [groupId]);

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
            group_id: groupId,
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
    console.log(members, GroupMembers);
    addFriendsToGroupService(JSONtoformdata(addUser))
      .then((res) => {
        if (res.data.status === 1) {
          const findIndex = groupsList.findIndex(
            (ele) => ele.group_id === parseInt(groupId)
          );

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
            group_id: GroupDetails.group_id,
            userId: userData.user_id,
            processType: GROUP_CHAT_PROCESS_TYPE.addGroupMember,
            groupData: updatedGroup,
          };
          groupFunctionalitySocket(message);
          dispatch(
            handleUpdateGroupData({
              Group: updatedGroup,
              index: findIndex,
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
          const findIndex = groupsList.findIndex(
            (ele) => ele.group_id === parseInt(groupId)
          );

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
            group_id: GroupDetails.group_id,
            userId: userData.user_id,
            processType: GROUP_CHAT_PROCESS_TYPE.removeGroupMember,
            groupData: GroupDetails,
          };
          groupFunctionalitySocket(message);
          dispatch(
            handleUpdateGroupData({
              Group: updatedGroup,
              index: findIndex,
            })
          );
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
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
          toast.success(res.data.msg);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch(() => {});
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
