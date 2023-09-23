/**
 * A modal component that displays a list of contacts from Gmail and allows the user to select
 * contacts to send invitations to. The component also provides search functionality and the ability
 * to select/unselect all contacts.
 * @param {boolean} open - Determines whether the modal is open or closed.
 * @param {function} close - Callback function to close the modal.
 * @param {Array} Contacts - An array of contact objects from Gmail.
 * @returns A modal component with a list of contacts and invitation sending functionality.
 */
import { Button, Checkbox, Modal, message } from "antd";
import { useEffect, useState } from "react";
import classes from "./Referal.module.css";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { handleSendEmail } from "./utility";
import { defaultprofileImg } from "../../Shared/CommonConstants";

const GmailListModal = ({ open, close, Contacts }) => {
  const token = useAuthToken();
  const [isViewMore, setisViewMore] = useState(false);
  const [selectAllStatus, setselectAllStatus] = useState(false);
  const [selectedEmails, setselectedEmails] = useState([]);
  const [FilterContacts, setFilterContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const profileData = useAuthData();

  const handleInviteFriends = (contacts) => {
    /**
     * Handles the action of inviting friends by sending an email to the specified contacts.
     * @param {Array} contacts - The list of contacts to send the invitation to.
     * @returns None
     */
    handleSendEmail(token, contacts).then(() => {
      close();
      setselectedEmails([]);
      setSearchInput("");
    });
  };

  /**
   * Handles the selection or deselection of a contact in the contact selector.
   * If the contact is already selected, it will be deselected. If the contact is not
   * selected, it will be added to the selectedEmails array.
   * @param {any} val - The value of the selected contact.
   * @returns None
   */
  const handleContactselector = (val) => {
    if (selectedEmails.includes(val)) {
      let tempSelected = selectedEmails.filter((ele) => !(ele === val));
      setselectedEmails(tempSelected);
    } else {
      setselectedEmails([...selectedEmails, val]);
    }
  };

  /**
   * Handles the search functionality for filtering contacts based on a given value.
   * If the value is empty, it resets the filter and displays all contacts.
   * If the value is not empty, it filters the contacts based on the email or title that
   * includes the given value (case-insensitive).
   * It updates the filtered contacts state, search input state, and resets the view more state if necessary.
   * @param {string} val - The value to search for.
   * @returns None
   */
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

  /**
   * useEffect hook that updates the filter contacts state when the Contacts prop changes.
   * If the FilterContacts array is empty and the Contacts prop is not null or undefined,
   * it sets the FilterContacts state to the value of the Contacts prop.
   * @param {Array} FilterContacts - The current filter contacts state.
   * @param {Array} Contacts - The contacts prop.
   * @returns None
   */
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
                        src={defaultprofileImg}
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
