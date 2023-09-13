import { Empty, Form, Select, Switch, TimePicker } from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import SelectedUsers from "../../../Modal/Event/SelectedUsers";
import ImageCropModal from "../../../Modal/ImageCropModal";
import { useAuthToken, useDashboard } from "../../../Shared/Reduxfetcher";
import { decodeHtml, getAspectRatio } from "../../../Shared/Utility";
import classes from "../Events.module.css";
import {
  getEventType,
  getLayoutData,
  getMelodyData,
} from "../../../Shared/DropdownApis";
import { useAddEventContext } from "../../../Shared/Context";

/**
 * A component that renders a dropdown select input for selecting an event type.
 * @param {Object} props - The component props.
 * @param {Function} props.onResult - A callback function to handle the selected event type.
 * @param {number} props.value - The currently selected event type value.
 * @param {boolean} props.disabled - Whether the select input is disabled or not.
 * @param {boolean} props.isLoading - Whether the select input is in a loading state or not.
 * @param {boolean} [props.isEnabledLabel=true] - Whether to display the label for the select input or not.
 * @returns The rendered EventTypeComponent.
 */
export const EventTypeComponent = ({
  onResult,
  value,
  disabled,
  isLoading,
  isEnabledLabel = true,
}) => {
  const { setisFetching } = useAddEventContext();
  const token = useAuthToken();
  const [EventData, setEventData] = useState([]);

  /**
   * Executes a side effect when the component mounts.
   * Fetches the event type data using the provided token and updates the state with the response.
   * Calls the onResult function with the first event type from the response.
   * Updates the isFetching state to indicate that the "event_type" data is being fetched.
   * @param {string} token - The token used for authentication.
   * @param {function} onResult - The function to call with the first event type from the response.
   * @returns None
   */
  useEffect(() => {
    setisFetching((pre) => [...pre, "event_type"]);
    getEventType(token)
      .then((res) => {
        setEventData(res);
        // onResult(res[0]);
      })
      .finally(() => {
        setisFetching((pre) => pre.filter((ele) => ele !== "event_type"));
      });
  }, []);

  /**
   * Retrieves the display name of an event based on its ID.
   * @returns {EventData} The event object with the matching ID, or the first event object if no match is found.
   */
  const getDisplayName = () => {
    let findEvent = EventData.find((ele) => ele.id === parseInt(value));
    if (findEvent) {
      return findEvent;
    } else {
      return EventData[0];
    }
  };
  return (
    <Form.Item
      label={isEnabledLabel ? "Event Type" : ""}
      colon={false}
      className={classes.textBoxSec}
    >
      <Select
        className={classes.textbox}
        options={EventData}
        value={getDisplayName()}
        disabled={disabled}
        loading={isLoading}
        onSelect={(val, value) => {
          onResult(value);
        }}
      />
    </Form.Item>
  );
};

/**
 * A component that renders an event layout selection form item.
 * @param {Object} props - The component props.
 * @param {Function} props.onResult - The callback function to be called when a layout is selected.
 * @param {string} props.value - The currently selected layout value.
 * @param {boolean} props.disabled - Whether the component is disabled or not.
 * @param {boolean} props.isLoading - Whether the component is in a loading state or not.
 * @param {boolean} [props.isEnabledLabel=true] - Whether to display the label for the layout selection form item.
 * @returns The rendered EventLayoutComponent.
 */
export const EventLayoutComponent = ({
  onResult,
  value,
  disabled,
  isLoading,
  isEnabledLabel = true,
}) => {
  const { setisFetching } = useAddEventContext();
  const token = useAuthToken();
  const [EventData, setEventData] = useState([]);

  useEffect(() => {
    setisFetching((pre) => [...pre, "event_layout"]);
    getLayoutData(token)
      .then((res) => {
        setEventData(res);
        onResult(res[0]);
      })
      .finally(() => {
        setisFetching((pre) => pre.filter((ele) => ele !== "event_layout"));
      });
  }, []);

  const getDisplayName = () => {
    let findEvent = EventData.find((ele) => ele.id === parseInt(value));
    if (findEvent) {
      return findEvent;
    } else {
      return EventData[0];
    }
  };
  return (
    <Form.Item
      label={isEnabledLabel ? "Layout" : ""}
      colon={false}
      className={classes.textBoxSec}
    >
      <Select
        className={classes.textbox}
        options={EventData}
        value={getDisplayName()}
        disabled={disabled}
        loading={isLoading}
        onSelect={(val, value) => {
          onResult(value);
        }}
      />
    </Form.Item>
  );
};

/**
 * A component that displays a select dropdown for event melodies.
 * @param {Object} props - The component props.
 * @param {Function} props.onResult - The callback function to be called when a melody is selected.
 * @param {string} props.value - The currently selected melody value.
 * @param {boolean} props.disabled - Whether the select dropdown is disabled.
 * @param {boolean} props.isLoading - Whether the select dropdown is in a loading state.
 * @param {boolean} [props.isEnabledLabel=true] - Whether to display the label for the select dropdown.
 * @param {boolean} [props.isCustomize=false] - Whether to include a "Customize" option in the select dropdown.
 * @
 */
export const EventMelodyComponent = ({
  onResult,
  value,
  disabled,
  isLoading,
  isEnabledLabel = true,
  isCustomize = false,
}) => {
  const { setisFetching } = useAddEventContext();
  const token = useAuthToken();
  const [EventData, setEventData] = useState([]);

  useEffect(() => {
    setisFetching((pre) => [...pre, "event_melody"]);
    getMelodyData(token)
      .then((res) => {
        let finalData = [...res];
        if (isCustomize) {
          finalData = [
            ...finalData,
            { id: 0, value: "Customize", label: "Customize" },
          ];
        }
        setEventData(finalData);
        onResult(finalData[0]);
      })
      .finally(() => {
        setisFetching((pre) => pre.filter((ele) => ele !== "event_melody"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDisplayName = () => {
    let findEvent = EventData.find((ele) => ele.id === parseInt(value));
    if (findEvent) {
      return findEvent;
    } else {
      return EventData[0];
    }
  };

  return (
    <Form.Item
      label={isEnabledLabel ? "Media" : ""}
      colon={false}
      className={classes.textBoxSec}
    >
      <Select
        className={classes.textbox}
        options={EventData}
        value={getDisplayName()}
        disabled={disabled}
        loading={isLoading}
        onSelect={(val, value) => {
          onResult(value);
        }}
      />
    </Form.Item>
  );
};

/**
 * A banner component that allows users to upload and display a banner image.
 * @param {function} onResult - Callback function to handle the result of the component.
 * @param {string} value - The current value of the banner image.
 * @param {number} [size=null] - The maximum size of the image in MB.
 * @returns The banner component.
 */
export const BannerComponent = ({ onResult, value, size = null }) => {
  const bannerRef = useRef();
  const [cropImage, setcropImage] = useState("");
  const [bannerImage, setbannerImage] = useState("");

  const validateImage = (image) => {
    if (typeof image.type !== "undefined" && image.type.includes("image/")) {
      setcropImage(image);
    } else {
      toast.remove("rawcaster");
      toast.error("upload only image", { id: "rawcaster" });
    }
  };

  useEffect(() => {
    if (value) {
      setbannerImage(value);
    } else {
      setbannerImage("");
    }
  }, [value]);

  return (
    <>
      <div
        className={`${classes.uploadbanner}  pointer`}
        style={{ cursor: "pointer" }}
        onClick={() => {
          bannerRef.current.click();
        }}
      >
        {bannerImage ? (
          <img
            src={
              typeof bannerImage === "string"
                ? bannerImage
                : URL.createObjectURL(bannerImage)
            }
            alt="Banner_img"
            // alt={URL.createObjectURL(bannerImage)}
            width="100%"
            height="100%"
            style={{
              zIndex: 0,
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
            }}
          ></img>
        ) : (
          <div>
            <div
              style={{
                color: "#1d1d1d",
                opacity: "0.5",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Upload Banner Photo
            </div>
            <div
              style={{
                color: "#1d1d1d",
                fontSize: "12px",
                opacity: "0.5",
                textAlign: "center",
              }}
            >
              Recommended size 500x300
            </div>
          </div>
        )}
        <input
          type="file"
          ref={bannerRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={(e) => {
            validateImage(e.target.files[0]);
          }}
        ></input>
      </div>
      {cropImage !== "" && (
        <ImageCropModal
          open={cropImage !== ""}
          src={URL.createObjectURL(cropImage)}
          ratio={getAspectRatio(500, 300)}
          onSuccess={(image) => {
            if (size) {
              if (image.size > size * 1024 * 1024) {
                toast.remove("rawcaster");
                toast.error("Image size is too big (max 10MB)", {
                  id: "rawcaster",
                });
              } else if (image.type.match("image")) {
                setbannerImage(image);
                onResult(image);
                setcropImage("");
              } else {
                toast.remove("rawcaster");
                toast.error("Upload only image", { id: "rawcaster" });
              }
            } else {
              setbannerImage(image);
              onResult(image);
              setcropImage("");
            }
          }}
          onFailure={() => {
            setcropImage("");
            setbannerImage("");
          }}
        />
      )}
    </>
  );
};

/**
 * A component for inviting users via email.
 * @param {Object} props - The component props.
 * @param {Function} props.onResult - Callback function to handle the result of the invitation.
 * @param {string} props.value - The initial value of the component.
 * @param {Function} props.setuserMailList - Function to set the user mail list.
 * @param {Array} props.userMailList - The list of user mail addresses.
 * @param {Function} props.onDeleteData - Callback function to handle deletion of mail data.
 * @returns The InviteEmailComponent JSX element.
 */
export const InviteEmailComponent = ({
  onResult,
  value,
  setuserMailList,
  userMailList,
  onDeleteData,
}) => {
  const [externalMailId, setExternalMailId] = useState([]);
  const [DeleteMailId, setDeleteMailId] = useState([]);

  const addExtMailHandler = (data) => {
    let maildata = data.trim();
    let mailArr;
    if ((maildata.match(/,/g) || []).length) {
      mailArr = maildata.split(",");
    } else {
      mailArr = maildata.split(" ");
    }

    let newMail = [];
    // var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    mailArr.forEach((val) => {
      if (
        val.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ) {
        newMail.push(val);
      }
    });
    if (newMail.length > 0) {
      document.getElementById("extmail").value = "";

      setExternalMailId((prev) => {
        onResult([...prev, ...newMail]);
        return [...prev, ...newMail];
      });
    }
  };

  const removeExtMailHandler = (index, v1, v2, mail) => {
    if (userMailList?.includes(mail)) {
      setuserMailList(mail);
    }
    setDeleteMailId((pre) => {
      if (pre.length === 0) {
        onDeleteData([mail]);
        return [mail];
      } else {
        onDeleteData([...pre, mail]);
        return [...pre, mail];
      }
    });
    let mailList = [...externalMailId];
    if (mailList.length > index) {
      mailList.splice(index, 1);
    }
    setExternalMailId(mailList);
    onResult(mailList);
  };

  useEffect(() => {
    if (value && externalMailId.length === 0) {
      try {
        let finalValue = JSON.parse(value);
        if (finalValue.length !== 0) {
          setExternalMailId(finalValue);
        } else {
          setExternalMailId([]);
        }
      } catch (err) {
        if (value.length !== 0) {
          setExternalMailId(value);
        } else {
          setExternalMailId([]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <div className={classes.lableTxt}> Invite Users</div>
      <div
        className={classes.extMail}
        onClick={() => {
          document.getElementById("extmail").focus();
        }}
      >
        {externalMailId.map((m, index) => {
          return (
            <span
              key={index}
              className={classes.displayuser + " pointer"}
              style={{ cursor: "pointer" }}
              onClick={() =>
                removeExtMailHandler(
                  index,
                  setExternalMailId,
                  externalMailId,
                  m
                )
              }
            >
              {m}
            </span>
          );
        })}

        <input
          type="text"
          id="extmail"
          name="extMail"
          placeholder={
            externalMailId.length === 0
              ? "Enter email address to send event invitation"
              : ""
          }
          className={classes.ExtUser}
          onKeyDown={(e) => {
            const x = e.keyCode || e.which;
            // alert(x);
            if ((!e.shiftKey && x === 13) || x === 44 || x === 32) {
              e.preventDefault();
              addExtMailHandler(e.target.value);
            }
          }}
          onBlur={(e) => {
            addExtMailHandler(e.target.value);
          }}
        ></input>
      </div>
    </>
  );
};

/**
 * A component that allows the user to select a time value.
 * @param {Object} props - The component props.
 * @param {Function} props.onResult - A callback function that is called when a time value is selected.
 * @param {string} props.value - The initial value of the time component.
 * @returns A React component that renders a time picker and a dropdown for selecting AM/PM.
 */
export const TimeValueComponent = ({ onResult, value }) => {
  const [showTimePicker, setshowTimePicker] = useState(false);
  const [TimeValue, setTimeValue] = useState({ time: "", session: "AM" });
  const [displayTimeValue, setdisplayTimeValue] = useState("");
  useEffect(() => {
    if (TimeValue.time !== "" && TimeValue.session !== "") {
      onResult(TimeValue.time + " " + TimeValue.session);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TimeValue]);

  useEffect(() => {
    if (value) {
      setTimeValue({
        time: moment(value, "HH:mm").format("hh:mm"),
        session: moment(value, "HH:mm").format("A"),
      });
      setdisplayTimeValue(value);
    }
  }, [value]);
  return (
    <div className={classes.timeSec}>
      <Form.Item
        required={false}
        colon={false}
        className={`${classes.timepicker} timepicker`}
      >
        <TimePicker
          className={`${classes.onlytime} ${classes.textbox}`}
          suffixIcon={null}
          format={"hh:mm"}
          allowClear={false}
          open={showTimePicker}
          value={displayTimeValue ? moment(displayTimeValue, "HH:mm") : null}
          use12Hours={true}
          onBlur={() => {
            setshowTimePicker(false);
          }}
          onSelect={(time) => {
            setdisplayTimeValue(moment(time).format("HH:mm"));
            setTimeValue((pre) => ({
              ...pre,
              time: moment(time).format("hh:mm"),
            }));
          }}
          onOpenChange={(val) => {
            setshowTimePicker(val);
          }}
          minuteStep={5}
          showNow={false}
        />
      </Form.Item>
      <Form.Item
        // initialValue={moment(selectedTime).format("A") == "AM" ? 1 : 2}
        className={classes.timedropdown}
      >
        <Select
          className={`${classes.onlytime2} ${classes.textbox}`}
          value={TimeValue.session === "PM" ? 2 : 1}
          onSelect={(val, value) => {
            setTimeValue((pre) => ({ ...pre, session: value.children }));
          }}
        >
          <Select.Option key={1} value={1}>
            AM
          </Select.Option>
          <Select.Option key={2} value={2}>
            PM
          </Select.Option>
        </Select>
      </Form.Item>
    </div>
  );
};

/**
 * A component that displays a list of connections/friends and allows the user to select and filter them.
 * @param {Function} onResult - A callback function that is called when the user selects a friend.
 * @param {Array} values - An array of user IDs representing the initially selected friends.
 * @param {Function} onDeleteData - A callback function that is called when a friend is deleted.
 * @returns The Connections component.
 */
export const Connections = ({ onResult, values, onDeleteData }) => {
  const { friendsList } = useDashboard();
  const [filterFriendList, setFilterFriendList] = useState([...friendsList]);
  const [selectedFriendList, setSelectedFriendList] = useState([]);
  const [selectedListVisible, setSelectedListVisible] = useState(false);
  const [friendSearchInput, setFriendSearchInput] = useState(false);
  const [DeleteMailId, setDeleteMailId] = useState([]);

  const selectFriendHandler = (data) => {
    setSelectedFriendList((prev) => [...prev, data]);
    const search = document.getElementById("friendsearch").value;
    var filterData = friendsList.filter((f) => {
      return (
        decodeHtml(f.display_name)
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        !selectedFriendList.includes(f) &&
        f.user_id !== data.user_id
      );
    });
    setFilterFriendList([...filterData]);
  };

  const selectedListOpenHandler = (type) => {
    setSelectedListVisible(true);
  };

  const selectAllFriendsHandler = () => {
    if (selectedFriendList.length === friendsList.length) {
      setSelectedFriendList([]);
      const search = document.getElementById("friendsearch").value;
      var filterData = friendsList.filter((f) => {
        return decodeHtml(f.display_name)
          .toLowerCase()
          .includes(search.toLowerCase());
      });
      setFilterFriendList([...filterData]);
    } else {
      setSelectedFriendList(friendsList);
      setFilterFriendList([]);
    }
  };

  const friendFilterHandler = (search) => {
    var filterData = friendsList.filter((f) => {
      return (
        decodeHtml(f.display_name)
          .toLowerCase()
          .includes(search.toLowerCase()) && !selectedFriendList.includes(f)
      );
    });
    setFilterFriendList([...filterData]);
  };

  useEffect(() => {
    onResult(selectedFriendList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFriendList]);

  useEffect(() => {
    if (values && selectedFriendList.length === 0) {
      let finResult = friendsList.filter((ele) => values.includes(ele.user_id));
      setSelectedFriendList(finResult);
      let otherData = friendsList.filter(
        (ele) => !values.includes(ele.user_id)
      );
      setFilterFriendList([...otherData]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <div className={classes.friendsdiv}>
      <div style={{ margin: 2 }} className={classes.headerSec}>
        <div className="d-flex flex-row">
          <div className={classes.lableTxt}> Connections</div>
          {selectedFriendList.length > 0 ? (
            <span
              style={{ color: "rgb(35, 71, 135)", cursor: "pointer" }}
              onClick={() => {
                selectedListOpenHandler(4);
              }}
            >
              ({selectedFriendList.length})
            </span>
          ) : null}
        </div>

        <div style={{ float: "right" }} className={classes.searchSec}>
          <input
            id="friendsearch"
            type="text"
            style={{
              display: friendSearchInput ? "inline" : "none",
              height: "17px",
            }}
            className={classes.search}
            onChange={(e) => friendFilterHandler(e.target.value)}
          ></input>
          <i
            style={{ cursor: "pointer" }}
            className="material-symbols-outlined"
            onClick={() => {
              setFriendSearchInput((p) => !p);
            }}
          >
            search
          </i>

          <span
            className={
              friendsList?.length === 0
                ? `${classes.disabled} ${classes.invite_txt}`
                : classes.invite_txt
            }
            onClick={selectAllFriendsHandler}
          >
            {friendsList.length === selectedFriendList.length &&
            selectedFriendList.length > 0
              ? "Remove all"
              : "Invite All"}
          </span>
        </div>
      </div>
      {friendsList?.length === 0 && <Empty />}
      <div style={{ marginTop: "6px", clear: "both" }}>
        {filterFriendList.slice(0, 10).map((f) => {
          return (
            <span
              style={{ cursor: "pointer" }}
              className={classes.displayuser}
              onClick={() => selectFriendHandler(f)}
            >
              {decodeHtml(f.display_name)}
            </span>
          );
        })}
      </div>
      <SelectedUsers
        open={selectedListVisible}
        friends={selectedFriendList}
        setfriends={(id) => {
          setDeleteMailId((pre) => {
            if (pre.length === 0) {
              onDeleteData([id]);
              return [id];
            } else {
              onDeleteData([...pre, id]);
              return [...pre, id];
            }
          });
          const findData = selectedFriendList.find((ele) => ele.user_id === id);
          if (findData) {
            setFilterFriendList((pre) => [...pre, findData]);
          }
          setSelectedFriendList((pre) =>
            pre.filter((ele) => ele.user_id !== id)
          );
        }}
        close={() => {
          setSelectedListVisible(false);
        }}
      />
    </div>
  );
};

/**
 * A component that displays a list of groups and allows the user to select and manage them.
 * @param {function} onResult - A callback function that is called when the selected group list changes.
 * @param {Array} values - An array of group IDs that should be pre-selected.
 * @param {function} onDeleteData - A callback function that is called when a group is deleted.
 * @returns The Groups component.
 */
export const Groups = ({ onResult, values, onDeleteData }) => {
  const { groupsList } = useDashboard();
  const [filterGroupList, setFilterGroupList] = useState([
    ...groupsList.filter((ele) => ele.my_group === 1),
  ]);
  const [selectedGroupList, setSelectedGroupList] = useState([]);
  const [selectedListVisible, setSelectedListVisible] = useState(false);
  const [GroupSearchInput, setGroupSearchInput] = useState(false);
  const [DeleteMailId, setDeleteMailId] = useState([]);

  const selectGroupHandler = (data) => {
    setSelectedGroupList((prev) => [...prev, data]);
    const search = document.getElementById("Groupsearch").value;
    var filterData = groupsList.filter((f) => {
      return (
        decodeHtml(f.group_name).toLowerCase().includes(search.toLowerCase()) &&
        !selectedGroupList.includes(f) &&
        f.group_id !== data.group_id &&
        f.my_group === 1
      );
    });
    setFilterGroupList([...filterData]);
  };

  const selectedListOpenHandler = (type) => {
    setSelectedListVisible(true);
  };

  const selectAllGroupsHandler = () => {
    if (selectedGroupList.length === groupsList.length) {
      setSelectedGroupList([]);
      const search = document.getElementById("Groupsearch").value;
      var filterData = groupsList.filter((f) => {
        return (
          decodeHtml(f.group_name)
            .toLowerCase()
            .includes(search.toLowerCase()) && f.my_group === 1
        );
      });
      setFilterGroupList([...filterData]);
    } else {
      setSelectedGroupList(groupsList.filter((ele) => ele.my_group === 1));
      setFilterGroupList([]);
    }
  };

  const GroupFilterHandler = (search) => {
    var filterData = groupsList.filter((f) => {
      return (
        decodeHtml(f.group_name).toLowerCase().includes(search.toLowerCase()) &&
        !selectedGroupList.includes(f) &&
        f.my_group === 1
      );
    });
    setFilterGroupList([...filterData]);
  };

  useEffect(() => {
    onResult(selectedGroupList);
  }, [selectedGroupList]);

  useEffect(() => {
    if (values && selectedGroupList.length === 0) {
      let finResult = groupsList.filter((ele) => values.includes(ele.group_id));
      setSelectedGroupList(finResult);
      let otherData = groupsList.filter(
        (ele) => !values.includes(ele.group_id) && ele.my_group === 1
      );
      console.log(otherData, "otherData");
      setFilterGroupList([...otherData]);
    }
  }, [values]);

  return (
    <div className={classes.Groupsdiv}>
      <div style={{ margin: 2 }} className={classes.headerSec}>
        <div className="d-flex flex-row">
          <div className={classes.lableTxt}> Groups</div>
          {selectedGroupList.length > 0 ? (
            <span
              style={{ color: "rgb(35, 71, 135)", cursor: "pointer" }}
              onClick={() => {
                selectedListOpenHandler(4);
              }}
            >
              ({selectedGroupList.length})
            </span>
          ) : null}
        </div>

        <div style={{ float: "right" }} className={classes.searchSec}>
          <input
            id="Groupsearch"
            type="text"
            style={{
              display: GroupSearchInput ? "inline" : "none",
              height: "17px",
            }}
            className={classes.search}
            onChange={(e) => GroupFilterHandler(e.target.value)}
          ></input>
          <i
            style={{ cursor: "pointer" }}
            className="material-symbols-outlined"
            onClick={() => {
              setGroupSearchInput((p) => !p);
            }}
          >
            search
          </i>

          <span
            className={
              groupsList?.length === 0
                ? `${classes.disabled} ${classes.invite_txt}`
                : classes.invite_txt
            }
            onClick={selectAllGroupsHandler}
          >
            {groupsList.filter((ele) => ele.my_group === 1).length ===
              selectedGroupList.length && selectedGroupList.length > 0
              ? "Remove all"
              : "Invite All"}
          </span>
        </div>
      </div>
      {groupsList?.length === 0 && <Empty />}
      <div style={{ marginTop: "6px", clear: "both" }}>
        {filterGroupList.slice(0, 10).map((f) => {
          return (
            <span
              style={{ cursor: "pointer" }}
              className={classes.displayuser}
              onClick={() => selectGroupHandler(f)}
            >
              {decodeHtml(f.group_name)}
            </span>
          );
        })}
      </div>
      <SelectedUsers
        open={selectedListVisible}
        Groups={selectedGroupList}
        type={2}
        setGroups={(id) => {
          setDeleteMailId((pre) => {
            if (pre.length === 0) {
              onDeleteData([id]);
              return [id];
            } else {
              onDeleteData([...pre, id]);
              return [...pre, id];
            }
          });
          const findData = selectedGroupList.find((ele) => ele.group_id === id);
          if (findData) {
            setFilterGroupList((pre) => [...pre, findData]);
          }
          setSelectedGroupList((pre) =>
            pre.filter((ele) => ele.group_id !== id)
          );
        }}
        close={() => {
          setSelectedListVisible(false);
        }}
      />
    </div>
  );
};

/**
 * Takes in data and returns a valid array data.
 * @param {any} data - The data to be validated.
 * @returns {string} - The validated array data.
 */
export const getValidarrayData = (data) => {
  if (data) {
    let finalData = "";
    try {
      finalData = JSON.stringify(data);
    } catch (error) {
      finalData = data;
    }
    return finalData;
  } else {
    return "";
  }
};

/**
 * A component that displays audio and video settings for an event.
 * @returns JSX element representing the audio and video settings component.
 */
export const AudioVideoSettings = () => {
  const { values, setFieldValue } = useAddEventContext();

  return (
    <div className="mt-2">
      <div className={classes.audioSetting}>
        <p className="mb-0">Default Audio Settings</p>
        <div className={classes.audiosetting_btn}>
          <Switch
            className="Greenbtn"
            checkedChildren="On"
            unCheckedChildren="Off"
            checked={values.event_host_audio}
            onChange={(val) => {
              setFieldValue("event_host_audio", val ? 1 : 0);
            }}
          />
          <p>Host</p>
        </div>
        <div className={classes.audiosetting_btn}>
          <Switch
            className="Greenbtn"
            checkedChildren="On"
            unCheckedChildren="Off"
            checked={values.event_guest_audio}
            onChange={(val) => {
              setFieldValue("event_guest_audio", val ? 1 : 0);
            }}
          />
          <p>Guest</p>
        </div>
      </div>

      <div className={classes.audioSetting}>
        <p className="mb-0">Default Video Settings</p>
        <div className={classes.audiosetting_btn}>
          <Switch
            checkedChildren="On"
            className="Greenbtn"
            unCheckedChildren="Off"
            checked={values.event_host_video}
            onChange={(val) => {
              setFieldValue("event_host_video", val ? 1 : 0);
            }}
          />
          <p>Host</p>
        </div>
        <div className={classes.audiosetting_btn}>
          <Switch
            className="Greenbtn"
            checkedChildren="On"
            unCheckedChildren="Off"
            checked={values.event_guest_video}
            onChange={(val) => {
              setFieldValue("event_guest_video", val ? 1 : 0);
            }}
          />
          <p>Guest</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Compares two arrays and returns any common items found in arr2 that are also present in arr1.
 * @param {Array} arr1 - The first array to compare.
 * @param {Array} arr2 - The second array to compare.
 * @returns {Array|boolean} - An array of common items if found, otherwise false.
 */
export function compareArrays(arr1, arr2) {
  const checkError = arr2?.filter((item, index) => {
    const CommonItemIndex = arr1?.findIndex((item1, index1) =>
      item?.includes(item1)
    );
    if (CommonItemIndex !== -1) {
      return item;
    }
    return undefined;
  });
  if (checkError?.length > 0) {
    return checkError;
  } else {
    return false;
  }

  // for (let key in arr1) {
  //   if (arr2.includes(key)) {
  //     return true;
  //   }
  // }
  // return false;
}
