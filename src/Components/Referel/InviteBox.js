/**
 * A React component that displays an invite box with various sharing options and contact list.
 * @returns {JSX.Element} - The rendered InviteBox component.
 */
import React, { useState } from "react";
import classes from "./Referel.module.css";
import PhoneIcon from "../../Assets/Icons/svg/Phone.svg";
import FacebookIcon from "../../Assets/Icons/svg/facebook.svg";
// import InstaIcon from "../../Assets/Icons/svg/Instagram.svg";
import ReferalIcon from "../../Assets/Icons/svg/Referal.svg";
import FansIcon from "../../Assets/Icons/svg/Other_fans.svg";
import WhatsappIcon from "../../Assets/Icons/svg/whatsapp.svg";
import TelegramIcon from "../../Assets/Icons/svg/telegram.svg";
import TwitterIcon from "../../Assets/Icons/svg/twitter_x_logo.svg";
import linkedinIcon from "../../Assets/Icons/svg/LinkedinIcon.svg";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { message } from "antd";
import InviteFansModal from "../../Modal/Referal/InviteFansModal";
import { handleSendEmail } from "../../Modal/Referal/utility";
import {
  decodeHtml,
  fetchGoogleContacts,
  handleCopyText,
} from "../../Shared/Utility";
import { useNavigate } from "react-router";
import { defaultprofileImg } from "../../Shared/CommonConstants";

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
    title: "X",
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
  const token = useAuthToken();
  const navigate = useNavigate();
  const [contactList, setContactList] = useState(null);
  const [isGmailOpen, setisGmailOpen] = useState(false);
  const [isInviteFansOpen, setisInviteFansOpen] = useState(false);
  const [SentedEmails, setSentedEmails] = useState([]);
  const [searchInput, setsearchInput] = useState("");

  const profileData = useAuthData();

  const shareUrl = profileData?.referral_link || "";

  // const responseSuccessCallback = (response) => {
  //   setisGmailOpen(true);
  //   setContactList(response);
  // };

  const handleInviteFriends = (contacts) => {
    handleSendEmail(token, contacts).then(() => {
      setSentedEmails((pre) => [...pre, contacts]);
    });
  };

  function compareByName(a, b) {
    const nameA = a.title.toUpperCase();
    const nameB = b.title.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  const FetchGoogleContacts = () => {
    fetchGoogleContacts()
      .then((res) => {
        if (res) {
          let contactDetails = res.map((ele) => {
            return {
              title: ele.names?.[0].displayName ?? ele.emailAddresses[0].value,
              email: ele.emailAddresses[0].value,
              profile_img: ele.photos[0].url ?? defaultprofileImg,
            };
          });
          contactDetails.sort(compareByName);
          setContactList(contactDetails);
          setisGmailOpen(true);
        } else {
          setContactList([]);
          setisGmailOpen(true);
        }
      })
      .catch(() => {
        message.warning("Try again after some time!!", 3);
      });
  };

  const getValidContacts = () => {
    return contactList.filter(
      (contact) =>
        decodeHtml(contact.title)
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        decodeHtml(contact.email)
          .toLowerCase()
          .includes(searchInput.toLowerCase())
    );
  };

  const encodedURL = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareMessage + " " + shareUrl);

  return (
    <div className={classes.inviteSec}>
      <div className={classes.inviteBox}>
        <div
          className={classes.inviteContainer}
          onClick={() => {
            navigate("/referel/dashboard");
          }}
        >
          <div className={classes.iconSec}>
            <img src={ReferalIcon} alt={"Referrals Dashboard"} />
            <p>Referrals Dashboard</p>
          </div>
          <span className="material-symbols-outlined">chevron_right</span>
        </div>

        <div
          className={classes.inviteContainer}
          onClick={
            isGmailOpen
              ? () => {
                  setisGmailOpen(false);
                  setContactList([]);
                }
              : () => FetchGoogleContacts()
          }
        >
          <div className={classes.iconSec}>
            <img src={PhoneIcon} alt={"Call"} />
            <p>Contacts</p>
          </div>

          {isGmailOpen ? (
            <span className="material-symbols-outlined">expand_more</span>
          ) : (
            <span className="material-symbols-outlined">chevron_right</span>
          )}
        </div>

        {isGmailOpen && contactList && (
          <div className={classes.resultSec}>
            <div className={classes.inputSec}>
              <input
                className={classes.textBox}
                onChange={(e) => setsearchInput(e.target.value)}
                value={searchInput}
                placeholder="Search Contacts"
                autoComplete="off"
              />
              {searchInput && searchInput !== "" && (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    setsearchInput("");
                  }}
                >
                  cancel
                </span>
              )}
            </div>
            {getValidContacts().length !== 0 ? (
              <>
                {getValidContacts()
                  .sort()
                  .map((ele, ind) => (
                    <div key={ind} className={classes.contacts}>
                      <div className={classes.profileSec}>
                        <img
                          width="25px"
                          height={"25px"}
                          alt={"User_Img"}
                          src={ele?.profile_img}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = defaultprofileImg;
                          }}
                        ></img>
                        <div className={classes.NameSec}>
                          <p
                            className={classes.name}
                            style={{
                              width: 180,
                            }}
                          >
                            {ele.title}
                          </p>
                          <p className={classes.email}>{ele.email}</p>
                        </div>
                      </div>
                      {SentedEmails.includes(ele.email) ? (
                        <span className="material-symbols-outlined">done</span>
                      ) : (
                        <div
                          className={classes.inviteBtn}
                          onClick={() => {
                            handleInviteFriends(ele.email);
                          }}
                        >
                          invite
                        </div>
                      )}
                    </div>
                  ))}
              </>
            ) : (
              <div className={classes.EmptyResultSec}>
                <p>We didn't find any results!</p>
              </div>
            )}
          </div>
        )}
      </div>
      {ShareList.map(({ title, img, Component, id }) => (
        <Component
          quote={
            id === 2
              ? encodedText
              : id === 4
              ? TwitterShareMsg + " " + shareUrl
              : shareMessage + " " + shareUrl
          }
          onClick={() => {
            if (id === 2) {
              const userAgent = navigator.userAgent;
              if (userAgent.toLowerCase().includes("telegram")) {
              } else {
                handleCopyText(shareUrl, "Link copied to clipboard");
              }
            }
          }}
          url={id === 2 ? encodedURL : shareUrl}
        >
          <div className={classes.inviteContainer}>
            <div className={classes.iconSec}>
              <img src={img} alt={title} />
              <p>{title}</p>
            </div>
            <span className="material-symbols-outlined">chevron_right</span>
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
          <img src={FansIcon} alt={"Invite fans"} />
          <p>Invite friends</p>
        </div>
        <span className="material-symbols-outlined">chevron_right</span>
      </div>

      {/* <GmailListModal
        open={isGmailOpen}
        Contacts={contactList}
        close={() => {
          setisGmailOpen(false);
          setContactList([]);
        }}
      /> */}
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
