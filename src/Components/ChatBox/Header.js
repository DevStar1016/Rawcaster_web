/**
 * The Header component displays the header section of the chat box. It includes the profile picture, display name, and additional options for the selected chat.
 * @returns The rendered Header component.
 */
import { useEffect, useState } from "react";
import classes from "./ChatBox.module.css";
import {
  defaultGroupImg,
  defaultprofileImg,
} from "../../Shared/CommonConstants";
import { useChatContext, useMainContext } from "../../Shared/Context";
import { Layout } from "antd";
import {
  useAuthData,
  useFriends,
  useGroups,
  useNuggets,
} from "../../Shared/Reduxfetcher";
import ConfigureGroup from "../Connections/Groups/ConfigureGroup";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { handleProfileNavigate } from "../../Shared/Utility";

const Header = () => {
  const { isChatOpen, setisChatOpen } = useMainContext();
  const {
    setGroupDetails,
    GroupDetails,
    SelectedContents,
    setSelectAllMessages,
    receiverMessage,
  } = useChatContext();
  const loginuserData = useAuthData();
  const friends = useFriends();
  const groups = useGroups();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nuggetFormData } = useNuggets();
  const [isConfigureGroup, setisConfigureGroup] = useState({
    show: false,
    group_id: null,
  });

  /**
   * Retrieves data based on the type of chat open.
   * @returns {Object | undefined} - The data object containing the relevant information for the chat.
   * If the chat type is "friend", the object will contain the friend's account information.
   * If the chat type is "group", the object will contain the group's information.
   * If the chat type is neither "friend" nor "group", undefined is returned.
   */
  const getData = () => {
    if (isChatOpen.type === "friend") {
      const findAccount = friends.find(
        (ele) => parseInt(ele.user_id) === parseInt(isChatOpen.id)
      );
      if (findAccount) {
        return { ...findAccount, icon: findAccount.profile_img };
      }
      return;
    } else if (isChatOpen.type === "group") {
      const findAccount = groups.find(
        (ele) => parseInt(ele.group_id) === parseInt(isChatOpen.id)
      );
      if (findAccount) {
        return {
          ...findAccount,
          display_name: findAccount.group_name,
          icon: findAccount.group_icon,
        };
      }
      return;
    }
    return;
  };

  /**
   * Retrieves the display data for a group, excluding the current user.
   * @returns {string} The display data for the group.
   */
  const getGroupDisplayData = () => {
    const GroupMembers = getData()?.group_members_list;
    const withoutCurrentUser = GroupMembers?.filter(
      (ele) =>
        parseInt(ele?.user_id, 10) !== parseInt(loginuserData.user_id, 10)
    );
    let displayData = "";

    if (withoutCurrentUser.length > 0) {
      const lengthyText =
        withoutCurrentUser[0].display_name?.toString()?.length > 25;
      if (withoutCurrentUser.length === 1) {
        displayData = lengthyText
          ? `You , ${withoutCurrentUser[0].display_name
              ?.toString()
              ?.slice(20)} ...`
          : `You , ${withoutCurrentUser[0].display_name?.toString()}`;
      } else {
        displayData = lengthyText
          ? "You ," +
            withoutCurrentUser[0].display_name?.toString()?.slice(0, 20) +
            `...`
          : "You ," +
            withoutCurrentUser[0].display_name?.toString() +
            ` +${withoutCurrentUser.length - 1} Others`;
      }
    } else {
      displayData = "You";
    }
    return displayData;
  };

  useEffect(() => {
    if (!GroupDetails) {
      setGroupDetails(getData());
    }
  }, [GroupDetails]);

  /**
   * Copies the selected contents to the clipboard and displays a success toast message.
   * @returns None
   */
  function copy() {
    const el = document.createElement("input");
    el.value = SelectedContents.join(" ");
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    toast.success("Text copied to clipboard");
    setSelectAllMessages(false);
  }

  return (
    <>
      <Layout.Header className={classes.chatboxHeader}>
        <div
          onClick={() => {
            if (isChatOpen?.type === "friend") {
              let finalData = {
                dispatch,
                navigate,
                nuggetFormData,
                user_id: isChatOpen?.id,
              };
              handleProfileNavigate(finalData);
            } else {
              setisConfigureGroup({ show: true, group_id: isChatOpen?.id });
            }
          }}
          className={classes.groupintroSec}
        >
          <img
            src={getData()?.icon || ""}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              if (isChatOpen.type === "group") {
                currentTarget.src = defaultGroupImg;
              } else {
                currentTarget.src = defaultprofileImg;
              }
            }}
          />
          <div className={classes.describeSec}>
            <h2
              style={{
                overflow: getData().group_members_list ? "" : "hidden",
                lineHeight: getData().group_members_list ? "" : 25,
              }}
            >
              {getData().display_name}
            </h2>
            {getData().group_members_list && <p>{getGroupDisplayData()}</p>}
          </div>
        </div>
        {SelectedContents?.length === 0 ? (
          <div>
            <span className="material-symbols-outlined">more_vert</span>
            <span
              className="material-symbols-outlined"
              onClick={() => {
                setisChatOpen(false);
              }}
            >
              close
            </span>
          </div>
        ) : (
          <div>
            <span className={classes.copyBtn}>
              <span onClick={copy} className="material-symbols-outlined">
                content_copy
              </span>
            </span>
            {receiverMessage?.length === 0 && (
              <span className="material-symbols-outlined">delete</span>
            )}
            <span
              className="material-symbols-outlined"
              onClick={() => {
                setSelectAllMessages(false);
              }}
            >
              close
            </span>
          </div>
        )}
        {isConfigureGroup.show && (
          <ConfigureGroup
            open={isConfigureGroup.show}
            groupId={isConfigureGroup.group_id}
            close={() => {
              setisConfigureGroup({ show: false, group_id: null });
            }}
          />
        )}
      </Layout.Header>
    </>
  );
};

export default Header;
