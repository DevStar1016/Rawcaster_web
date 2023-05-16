import { sendMessage } from "../../../Services/SocketService";
import { GROUP_CHAT_PROCESS_TYPE } from "./Constants";

export const groupFunctionalitySocket = ({
  group_id,
  userId,
  processType,
  groupData,
}) => {
  const socketMessage = {
    event: "groupchatmsgtransfer",
    processType: processType,
    groupId: group_id,
    userId: userId,
    groupData: groupData,
  };
  console.log(socketMessage);
  sendMessage(socketMessage, "groupchatting");
};

export const handleGroupChatMessageTransfer = (message) => {
  switch (message.processType) {
    case GROUP_CHAT_PROCESS_TYPE.createGroup:
      console.log(message.groupData);

      break;
    case GROUP_CHAT_PROCESS_TYPE.editGroup:
      console.log(message.groupData);
      break;
    case GROUP_CHAT_PROCESS_TYPE.deleteGroup:
      console.log(message.groupData);
      break;
    case GROUP_CHAT_PROCESS_TYPE.removeGroupMember:
      console.log(message.groupData);
      break;
    case GROUP_CHAT_PROCESS_TYPE.addGroupMember:
      console.log(message.groupData);
      break;
  }
};
