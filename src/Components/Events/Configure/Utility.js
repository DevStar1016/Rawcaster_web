import { Form, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import SelectedUsers from "../../../Modal/Event/SelectedUsers";
import ImageCropModal from "../../../Modal/ImageCropModal";
import { getEventTypeService } from "../../../Services/ApiService";
import { useAuthToken, useDashboard } from "../../../Shared/Reduxfetcher";
import { decodeHtml, JSONtoformdata } from "../../../Shared/Utility";
import classes from "../Events.module.css";

export const EventTypeComponent = ({ onResult, value }) => {
  const token = useAuthToken();
  const [EventData, setEventData] = useState([]);

  useEffect(() => {
    let eventData = {
      token: token,
    };
    getEventTypeService(JSONtoformdata(eventData))
      .then((res) => {
        let filterData = res.data.event_types.map((ele) => {
          return { ...ele, label: ele.type, value: ele.type };
        });
        if (filterData.length !== 0) {
          setEventData(filterData);
        }
      })
      .catch((err) => {});
  }, []);

  const getDisplayName = () => {
    let findEvent = EventData.find((ele) => ele.id === parseInt(value));
    if (findEvent) {
      return findEvent;
    } else {
      return null;
    }
  };
  return (
    <Form.Item label="Event Type" colon={false} className={classes.textBoxSec}>
      <Select
        className={classes.textbox}
        options={EventData}
        value={getDisplayName()}
        onSelect={(val, value) => {
          onResult(value);
        }}
      />
    </Form.Item>
  );
};

export const BannerComponent = ({ onResult, value }) => {
  const bannerRef = useRef();
  const [cropImage, setcropImage] = useState("");
  const [bannerImage, setbannerImage] = useState("");

  const validateImage = (image) => {
    if (typeof image.type !== "undefined" && image.type.includes("image/")) {
      setcropImage(image);
    } else {
      toast.error("upload only image");
    }
  };

  useEffect(() => {
    if (value) {
      setbannerImage(value);
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
            alt=""
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
          ratio={16 / 9}
          onSuccess={(val) => {
            setbannerImage(val);
            onResult(val);
            setcropImage("");
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

export const InviteEmailComponent = ({ onResult }) => {
  const [externalMailId, setExternalMailId] = useState([]);

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
      onResult([...externalMailId, ...newMail]);
      setExternalMailId((prev) => [...prev, ...newMail]);
    }
  };

  const removeExtMailHandler = (index) => {
    let mailList = [...externalMailId];
    if (mailList.length > index) {
      mailList.splice(index, 1);
    }
    externalMailId(mailList);
    onResult(mailList);
  };

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
                removeExtMailHandler(index, setExternalMailId, externalMailId)
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

export const TimeValueComponent = ({ onResult, value }) => {
  const [showTimePicker, setshowTimePicker] = useState(false);
  const [TimeValue, setTimeValue] = useState({ time: "", session: "" });
  const [displayTimeValue, setdisplayTimeValue] = useState("");
  useEffect(() => {
    console.log(TimeValue);
    if (TimeValue.time !== "" && TimeValue.session !== "") {
      onResult(TimeValue.time + " " + TimeValue.session);
    }
  }, [TimeValue]);

  useEffect(() => {
    console.log(value);
    if (value) {
      setTimeValue({
        time: dayjs(value, "HH:mm").format("hh:mm"),
        session: dayjs(value, "HH:mm").format("A"),
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
          open={showTimePicker}
          value={displayTimeValue ? moment(displayTimeValue, "HH:mm") : null}
          use12Hours={true}
          onBlur={() => {
            setshowTimePicker(false);
          }}
          onSelect={(time) => {
            setdisplayTimeValue(dayjs(time).format("HH:mm"));
            setTimeValue((pre) => ({
              ...pre,
              time: dayjs(time).format("hh:mm"),
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
          value={TimeValue.session === "AM" ? 1 : 2}
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

export const Connections = ({ onResult, values }) => {
  const { friendsList } = useDashboard();
  const [filterFriendList, setFilterFriendList] = useState([...friendsList]);
  const [selectedFriendList, setSelectedFriendList] = useState([]);
  const [selectedListVisible, setSelectedListVisible] = useState(false);
  const [friendSearchInput, setFriendSearchInput] = useState(false);

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
  }, [selectedFriendList]);

  useEffect(() => {
    if (values) {
      let finResult = friendsList.filter((ele) => values.includes(ele.user_id));
      setSelectedFriendList(finResult);
      let otherData = friendsList.filter(
        (ele) => !values.includes(ele.user_id)
      );
      setFilterFriendList([...otherData]);
    }
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
            class="material-symbols-outlined"
            onClick={() => {
              setFriendSearchInput((p) => !p);
            }}
          >
            search
          </i>

          <span
            className={classes.invite_txt}
            onClick={selectAllFriendsHandler}
          >
            {friendsList.length === selectedFriendList.length &&
            selectedFriendList.length > 0
              ? "Remove all"
              : "Invite All"}
          </span>
        </div>
      </div>
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
