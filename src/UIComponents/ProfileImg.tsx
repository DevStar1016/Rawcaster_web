import React from "react";
import Diamond from "../Assets/Icons/svg/Diamond.svg";
import Gold from "../Assets/Icons/svg/Gold.svg";
import userImg from "../Assets/Images/svg/userImg.svg";
import Silver from "../Assets/Icons/svg/Silver.svg";
import NanoInfluencerImg from "../Assets/Icons/svg/Nano_Influencer.svg";
import MicroInfluencerImg from "../Assets/Icons/svg/Micro_influencer.svg";
import MacroInfluencerImg from "../Assets/Icons/svg/Macro_influencer.svg";
import MegaInfluencerImg from "../Assets/Icons/svg/Mega_Influencer.svg";
import { Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { useNuggets } from "../Shared/Reduxfetcher";
import { useNavigate } from "react-router";
import { handleProfileNavigate } from "../Shared/Utility";

type Props = {
  isLoggedIn?: boolean;
  src: string;
  Badgetype: number;
  BadgeTitle?: string;
  imgClassName: string;
  badgeClassName: string;
  user: any;
};

type BadgeProp = {
  img: string;
  title: string;
};

const ProfileImg = ({
  isLoggedIn = true,
  src,
  Badgetype,
  BadgeTitle = "",
  imgClassName,
  badgeClassName,
  user,
}: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nuggetFormData } = useNuggets();

  const getBadge = (): BadgeProp | undefined => {
    switch (Badgetype) {
      case 1:
        return { img: Silver, title: "Valued Member" };
      case 2:
        return { img: Gold, title: "Gold Member" };
      case 3:
        return { img: Gold, title: "Gold Member" };
      case 4:
        return { img: Diamond, title: "Diamond Elite Member" };
      case 5:
        return { img: NanoInfluencerImg, title: "Nano influencer" };
      case 6:
        return { img: MicroInfluencerImg, title: "Micro influencer" };
      case 7:
        return { img: MacroInfluencerImg, title: "Macro influencer" };
      case 8:
        return { img: MegaInfluencerImg, title: "Mega/Celebrity Influencer" };
      default:
        return undefined;
    }
  };
  return (
    <>
      <img
        className={imgClassName}
        src={isLoggedIn ? (src ? src : userImg) : userImg}
        alt={isLoggedIn ? (src ? src : userImg) : userImg}
        onError={({ currentTarget }: { currentTarget: any }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = userImg;
        }}
        style={{ cursor: "pointer" }}
        onClick={() => {
          let finalData = {
            dispatch,
            navigate,
            nuggetFormData,
            user_id: user?.user_id,
          };
          if (user) {
            handleProfileNavigate(finalData);
          }
        }}
      />
      <Tooltip
        title={BadgeTitle}
        color={"#e26386"}
        placement="bottomRight"
        trigger={["click"]}
      >
        {isLoggedIn && getBadge() && (
          <img
            className={badgeClassName}
            id="badgeImage"
            style={{ cursor: "pointer" }}
            alt={BadgeTitle}
            src={getBadge()?.img}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
      </Tooltip>
    </>
  );
};

export default ProfileImg;
