import React from "react";
import classes from "./UIComponents.module.css";
import Diamond from "../Assets/Icons/svg/Diamond.svg";
import Gold from "../Assets/Icons/svg/Gold.svg";
import Silver from "../Assets/Icons/svg/Silver.svg";
import NanoInfluencerImg from "../Assets/Icons/svg/Nano_Influencer.svg";
import MicroInfluencerImg from "../Assets/Icons/svg/Micro_influencer.svg";
import MacroInfluencerImg from "../Assets/Icons/svg/Macro_influencer.svg";
import MegaInfluencerImg from "../Assets/Icons/svg/Mega_Influencer.svg";

const ProfileImg = ({ src, Badgetype }) => {
  const getBadge = () => {
    switch (Badgetype) {
      case 1:
        return Diamond;
      case 2:
        return Gold;
      case 3:
        return Silver;
      case 4:
        return NanoInfluencerImg;
      case 5:
        return MicroInfluencerImg;
      case 6:
        return MacroInfluencerImg;
      case 7:
        return MegaInfluencerImg;
      default:
        break;
    }
  };
  return (
    <div className={classes.profileSec}>
      <img src={src} className={classes.profileImg} />
      {/* <img src={getBadge()} className={classes.badgeImg} /> */}
    </div>
  );
};

export default ProfileImg;
