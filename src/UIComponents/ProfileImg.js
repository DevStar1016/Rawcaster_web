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

const ProfileImg = ({
  isLoggedIn = true,
  src,
  Badgetype,
  BadgeTitle = "",
  imgClassName,
  badgeClassName,
}) => {
  const getBadge = () => {
    switch (Badgetype) {
      case 1:
        return { img: Silver, title: "Valued Member" };
      case 2:
        return { img: Gold, title: "Gold Member" };
      case 3:
        return { img: Diamond, title: "Premium Member" };
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
        break;
    }
  };
  return (
    <>
      <img className={imgClassName} src={isLoggedIn ? src : userImg} />
      <Tooltip title={BadgeTitle} color={"#e26386"} placement="bottom">
        {isLoggedIn && getBadge() && (
          <img
            className={badgeClassName}
            style={{ cursor: "pointer" }}
            src={getBadge().img}
          />
        )}
      </Tooltip>
    </>
  );
};

export default ProfileImg;
