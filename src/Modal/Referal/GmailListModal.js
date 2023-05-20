import { Button, Checkbox, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import classes from "./Referal.module.css";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { handleSendEmail } from "./utility";

const GmailListModal = ({ open, close, Contacts }) => {
  const token = useAuthToken();
  const [isViewMore, setisViewMore] = useState(false);
  const [selectAllStatus, setselectAllStatus] = useState(false);
  const [selectedEmails, setselectedEmails] = useState([]);
  const [FilterContacts, setFilterContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const profileData = useAuthData();

  const handleInviteFriends = (contacts) => {
    handleSendEmail(token, contacts).then(() => {
      close();
      setselectedEmails([]);
      setSearchInput("");
    });
  };

  const handleContactselector = (val) => {
    if (selectedEmails.includes(val)) {
      let tempSelected = selectedEmails.filter((ele) => !(ele === val));
      setselectedEmails(tempSelected);
    } else {
      setselectedEmails([...selectedEmails, val]);
    }
  };

  const handleSearchConnections = (val) => {
    if (val === "") {
      setFilterContacts(Contacts);
      setSearchInput(val);
      return;
    }
    const tempFilter = Contacts.filter((ele) => {
      return (
        ele.email.toLowerCase().includes(val.toLowerCase()) ||
        ele.title.toLowerCase().includes(val.toLowerCase())
      );
    });
    setFilterContacts(tempFilter);
    setSearchInput(val);
    if (isViewMore) {
      setisViewMore(false);
    }
  };

  useEffect(() => {
    if (FilterContacts.length === 0 && Contacts) {
      setFilterContacts(Contacts);
    }
  }, [Contacts]);

  return (
    <Modal
      open={open}
      destroyOnClose={() => {
        close();
      }}
      onCancel={() => {
        close();
      }}
      footer={null}
      width={600}
    >
      <div id="centerSec" className={classes.centerSec}>
        <div className={classes.gmailReferalBox}>
          <img
            src={require("../../Assets/Icons/png/mailimg.png")}
            className={classes.gmailImg}
            alt="Email_img"
          />
          <p className={classes.userName}>{profileData?.name || ""}</p>
          <p className={classes.userEmail}>{profileData?.email_id || ""}</p>

          <div className={classes.contactlistContainer}>
            <p className={classes.heading}>
              Contact list ({Contacts !== null && Contacts.length})
            </p>
            <p
              className={classes.multiOption}
              onClick={() => {
                if (!selectAllStatus) {
                  setselectedEmails(FilterContacts.map((ele) => ele.email));
                  setselectAllStatus(true);
                } else {
                  setselectedEmails([]);
                  setselectAllStatus(false);
                }
              }}
            >
              {!selectAllStatus ? "Select All" : "Unselect All"}
            </p>
            <div className={classes.contactList}>
              <input
                className={classes.searchBox}
                value={searchInput}
                onChange={(e) => handleSearchConnections(e.target.value)}
                placeholder="Search emails..."
                autoComplete="off"
              />
              {FilterContacts !== null && FilterContacts.length === 0 && (
                <p>No result found!!</p>
              )}
              {FilterContacts !== null &&
                FilterContacts.slice(
                  0,
                  isViewMore ? FilterContacts.length : 3
                ).map((ele, ind) => (
                  <div key={ind} className={classes.contacts}>
                    <div className={classes.profileSec}>
                      <img
                        width="45px"
                        height={"45px"}
                        alt="User_img"
                        src={require("../../Assets/Icons/png/user_vector.png")}
                      ></img>
                      <div className={classes.NameSec}>
                        <p className={classes.name}>{ele.title}</p>
                        <p className={classes.email}>{ele.email}</p>
                      </div>
                    </div>
                    <Checkbox
                      checked={selectedEmails.includes(ele.email)}
                      onChange={() => handleContactselector(ele.email)}
                    />
                  </div>
                ))}
              {FilterContacts !== null &&
                FilterContacts.length > 10 &&
                !isViewMore && (
                  <p
                    className={classes.viewMoreTxt}
                    onClick={() => setisViewMore(!isViewMore)}
                  >
                    View All
                  </p>
                )}
            </div>
          </div>
        </div>
        <div className={classes.gmailAction}>
          <Button
            block
            htmlType="submit"
            style={{ marginBottom: "20px", marginRight: "10px" }}
            onClick={() => {
              if (selectedEmails.length !== 0) {
                handleInviteFriends(selectedEmails);
              } else {
                message.warning("Please select atleast one contact", 3);
              }
            }}
            className={classes.invibtn}
          >
            Send Invitation
          </Button>
          <Button
            block
            onClick={() => {
              close();
            }}
            className={classes.cancelBtn}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GmailListModal;
