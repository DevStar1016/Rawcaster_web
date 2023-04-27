import React from "react";
import classes from "./Referel.module.css";
import PhoneIcon from "../../Assets/Icons/svg/Phone.svg";
import FacebookIcon from "../../Assets/Icons/svg/facebook.svg";
import InstaIcon from "../../Assets/Icons/svg/Instagram.svg";
import FansIcon from "../../Assets/Icons/svg/Other_fans.svg";
import WhatsappIcon from "../../Assets/Icons/svg/whatsapp.svg";
import TelegramIcon from "../../Assets/Icons/svg/telegram.svg";
import { FacebookShareButton } from "react-share";
import { useAuthData } from "../../Shared/Reduxfetcher";

const InviteBox = () => {
  const profileData = useAuthData();
  const shareMessage =
    "Hi, I have joined Rawcaster. A one-stop platform for all social media needs. I am asking all my friends and special people to join this platform to make it easier to reach everyone with content, personalized messages, Nuggets, and invitations to participate in my special events. I expect to see you there soon.\n";
  const TwitterShareMsg =
    "Hi, I have joined Rawcaster. A one-stop platform for all social media needs. I am asking all my special people to join this platform to make it easier to reach you with personalized messages.";
  const shareUrl = profileData?.referral_link || "";

  return (
    <div className={classes.inviteSec}>
      <div className={classes.inviteContainer}>
        <div className={classes.iconSec}>
          <img src={PhoneIcon} />
          <p>Contacts</p>
        </div>
        <span class="material-symbols-outlined">chevron_right</span>
      </div>
      <FacebookShareButton quote={shareMessage + " " + shareUrl} url={shareUrl}>
        <div className={classes.inviteContainer}>
          <div className={classes.iconSec}>
            <img src={FacebookIcon} />
            <p>Facebook</p>
          </div>
          <span class="material-symbols-outlined">chevron_right</span>
        </div>
      </FacebookShareButton>
      <div className={classes.inviteContainer}>
        <div className={classes.iconSec}>
          <img src={InstaIcon} />
          <p>Instagram</p>
        </div>
        <span class="material-symbols-outlined">chevron_right</span>
      </div>
      <div className={classes.inviteContainer}>
        <div className={classes.iconSec}>
          <img src={TelegramIcon} />
          <p>Telegram</p>
        </div>
        <span class="material-symbols-outlined">chevron_right</span>
      </div>
      <div className={classes.inviteContainer}>
        <div className={classes.iconSec}>
          <img src={WhatsappIcon} />
          <p>Whatsapp</p>
        </div>
        <span class="material-symbols-outlined">chevron_right</span>
      </div>
      <div className={classes.inviteContainer}>
        <div className={classes.iconSec}>
          <img src={FansIcon} />
          <p>Invite fans</p>
        </div>
        <span class="material-symbols-outlined">chevron_right</span>
      </div>
    </div>
  );
};

export default InviteBox;