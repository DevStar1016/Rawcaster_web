import React, { useEffect } from "react";
import classes from "./ChatBox.module.css";
import {
  defaultGroupImg,
  defaultprofileImg,
} from "../../Shared/CommonConstants";
import { useChatContext, useMainContext } from "../../Shared/Context";
import { Layout } from "antd";
import { useAuthData, useFriends, useGroups } from "../../Shared/Reduxfetcher";

const Header = () => {
  const { isChatOpen, setisChatOpen } = useMainContext();
  const { setGroupDetails, GroupDetails } = useChatContext();
  const loginuserData = useAuthData();
  const friends = useFriends();
  const groups = useGroups();

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

  // const getGroupDisplayData = () => {
  //   const displayedData = getData()?.group_members_list.slice(0, 2); // Get the first 2 objects
  //   const remainingData = getData()?.group_members_list.slice(2); // Get the remaining objects
  //   const displayName = displayedData?.map((ele) => {
  //     if (parseInt(loginuserData.user_id) !== ele.user_id) {
  //       return ele.display_name.split(" ")[0] || "";
  //     }
  //     return "";
  //   });
  //   let displayData;

  //   if (remainingData.length > 0) {
  //     if (remainingData.length === 1) {
  //       displayData = [
  //         "You",
  //         ...displayName,
  //         remainingData[0].display_name,
  //       ].toString();
  //     } else {
  //       displayData =
  //         "You ," + displayName.toString() + ` +${remainingData.length} Others`;
  //     }
  //   } else {
  //     displayData = "You ," + displayName.toString();
  //   }
  //   return displayData;
  // };

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

  return (
    <>
      <Layout.Header className={classes.chatboxHeader}>
        <div className={classes.groupintroSec}>
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
        <div>
          <span class="material-symbols-outlined">more_vert</span>
          <span
            class="material-symbols-outlined"
            onClick={() => {
              setisChatOpen(false);
            }}
          >
            close
          </span>
        </div>
      </Layout.Header>
    </>
  );
};

export default Header;
