import React, { useState } from "react";
import classes from "./Referel.module.css";
import PhoneIcon from "../../Assets/Icons/svg/Phone.svg";
import FacebookIcon from "../../Assets/Icons/svg/facebook.svg";
// import InstaIcon from "../../Assets/Icons/svg/Instagram.svg";
import FansIcon from "../../Assets/Icons/svg/Other_fans.svg";
import WhatsappIcon from "../../Assets/Icons/svg/whatsapp.svg";
import TelegramIcon from "../../Assets/Icons/svg/telegram.svg";
import TwitterIcon from "../../Assets/Icons/svg/twitterIcon.svg";
import linkedinIcon from "../../Assets/Icons/svg/LinkedinIcon.svg";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { message } from "antd";
import GoogleContacts from "react-google-contacts";
import GmailListModal from "../../Modal/Referal/GmailListModal";
import InviteFansModal from "../../Modal/Referal/InviteFansModal";

const shareMessage =
  "Hi, I have joined Rawcaster. A one-stop platform for all social media needs. I am asking all my friends and special people to join this platform to make it easier to reach everyone with content, personalized messages, Nuggets, and invitations to participate in my special events. I expect to see you there soon.\n";
const TwitterShareMsg =
  "Hi, I have joined Rawcaster. A one-stop platform for all social media needs. I am asking all my special people to join this platform to make it easier to reach you with personalized messages.";

const ShareList = [
  {
    id: 1,
    title: "Facebook",
    img: FacebookIcon,
    Component: FacebookShareButton,
  },
  {
    id: 2,
    title: "Telegram",
    img: TelegramIcon,
    Component: TelegramShareButton,
  },
  {
    id: 3,
    title: "Whatsapp",
    img: WhatsappIcon,
    Component: WhatsappShareButton,
  },
  {
    id: 4,
    title: "Twitter",
    img: TwitterIcon,
    Component: TwitterShareButton,
  },
  {
    id: 5,
    title: "Linkedin",
    img: linkedinIcon,
    Component: LinkedinShareButton,
  },
];

const InviteBox = () => {
  const [contactList, setContactList] = useState(null);
  const [isGmailOpen, setisGmailOpen] = useState(false);
  const [isInviteFansOpen, setisInviteFansOpen] = useState(false);
  const profileData = useAuthData();

  const shareUrl = profileData?.referral_link || "";

  const responseSuccessCallback = (response) => {
    setisGmailOpen(true);
    setContactList(response);
  };

  return (
    <div className={classes.inviteSec}>
      <GoogleContacts
        clientId="749429188201-u1e40oco3dejrfcnr7algubh0k0sf01e.apps.googleusercontent.com"
        render={(renderProps) => (
          <div
            className={classes.inviteContainer}
            onClick={renderProps.onClick}
          >
            <div className={classes.iconSec}>
              <img src={PhoneIcon} />
              <p>Contacts</p>
            </div>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        )}
        onSuccess={responseSuccessCallback}
        onFailure={() => {
          message.warning("Try again after some time!!", 3);
        }}
      />
      {ShareList.map(({ title, img, Component, id }) => (
        <Component
          quote={
            id === 4
              ? TwitterShareMsg + " " + shareUrl
              : shareMessage + " " + shareUrl
          }
          url={shareUrl}
        >
          <div className={classes.inviteContainer}>
            <div className={classes.iconSec}>
              <img src={img} />
              <p>{title}</p>
            </div>
            <span class="material-symbols-outlined">chevron_right</span>
          </div>
        </Component>
      ))}

      <div
        className={classes.inviteContainer}
        onClick={() => {
          setisInviteFansOpen(true);
        }}
      >
        <div className={classes.iconSec}>
          <img src={FansIcon} />
          <p>Invite fans</p>
        </div>
        <span class="material-symbols-outlined">chevron_right</span>
      </div>

      <GmailListModal
        open={isGmailOpen}
        Contacts={contactList}
        close={() => {
          setisGmailOpen(false);
          setContactList([]);
        }}
      />
      <InviteFansModal
        open={isInviteFansOpen}
        close={() => {
          setisInviteFansOpen(false);
        }}
      />
    </div>
  );
};

export default InviteBox;