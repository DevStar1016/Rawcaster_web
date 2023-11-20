/**
 * A React component that displays a referral container with various social media sharing options.
 * @returns JSX element
 */
import React from "react";
import classes from "./Dashboard.module.css";
import { EmailReferalContainer } from "../../../Modal/Referal/utility";
import referalImg from "../../../Assets/Images/svg/refferal_img.svg";
import MobileRef from "../../../Assets/Images/svg/mob-ref.svg";
import WhatsappIcon from "../../../Assets/Icons/svg/whatsapp.svg";
import TelegramIcon from "../../../Assets/Icons/svg/telegram.svg";
import TwitterIcon from "../../../Assets/Icons/svg/twitterIcon.svg";
import linkedinIcon from "../../../Assets/Icons/svg/LinkedinIcon.svg";
import FacebookIcon from "../../../Assets/Icons/svg/facebook.svg";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { useAuthData } from "../../../Shared/Reduxfetcher";
import { useMainContext, useReferalContext } from "../../../Shared/Context";

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

const ReferContainer = () => {
  const profileData = useAuthData();
  const { AccountAccessType } = useMainContext();
  const { ReferalData } = useReferalContext();
  const shareUrl = profileData?.referral_link || "";

  const isDisplayUpgradePremium = AccountAccessType === "valued_only";
  return (
    <div className={classes.centerSec}>
      <div className={classes.centerImg}>
        <img
          className={`${classes.refImg} ${classes.onlydesktop}`}
          src={referalImg}
        />
        <img
          className={`${classes.refImg} ${classes.onlymob}`}
          src={MobileRef}
        />
      </div>

      <EmailReferalContainer />

      {/* <div className={classes.shareList}>
        <ul>
          {ShareList.map(({ Component, img, id }) => {
            return (
              <li>
                <Component
                  quote={
                    id === 4
                      ? TwitterShareMsg + " " + shareUrl
                      : shareMessage + " " + shareUrl
                  }
                  url={shareUrl}
                >
                  <img src={img} />
                </Component>
              </li>
            );
          })}
        </ul>
      </div>*/}
      {isDisplayUpgradePremium && (
        <div className={classes.cardsecParent}>
          <div
            className={classes.cardSec}
            style={{
              margin: isDisplayUpgradePremium ? "" : "0px auto",
            }}
          >
            <p className={classes.value}>{ReferalData?.referral_count || 0}</p>
            <p className={classes.text}>
              Total number of Valid Referrals Credit
            </p>
          </div>

          {isDisplayUpgradePremium && (
            <div
              className={classes.cardSec}
              style={{
                margin: isDisplayUpgradePremium ? "" : "0px auto",
              }}
            >
              <p className={classes.value}>
                {ReferalData?.referral_needed_count || 0}
              </p>
              <p className={classes.text}>
                Referrals Needed for Upgrade to Premium{" "}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferContainer;
