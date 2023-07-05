import { Form, Select, Switch, TimePicker } from "antd";
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

export const EventTypeComponent = ({
  onResult,
  value,
  disabled,
  isLoading,
  isEnabledLabel = true,
}) => {
  const token = useAuthToken();
  const [EventData, setEventData] = useState([]);

  useEffect(() => {
    getEventType(token).then((res) => {
      setEventData(res);
      onResult(res[0]);
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

export const EventLayoutComponent = ({
  onResult,
  value,
  disabled,
  isLoading,
  isEnabledLabel = true,
}) => {
  const token = useAuthToken();
  const [EventData, setEventData] = useState([]);

  useEffect(() => {
    getLayoutData(token).then((res) => {
      setEventData(res);
      onResult(res[0]);
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

export const EventMelodyComponent = ({
  onResult,
  value,
  disabled,
  isLoading,
  isEnabledLabel = true,
  isCustomize = false,
}) => {
  const token = useAuthToken();
  const [EventData, setEventData] = useState([]);

  useEffect(() => {
    getMelodyData(token).then((res) => {
      let finalData = [...res];
      if (isCustomize) {
        finalData = [
          ...finalData,
          { id: 0, value: "Customize", label: "Customize" },
        ];
      }

      setEventData(finalData);

      onResult(finalData[0]);
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

export const BannerComponent = ({ onResult, value, size = null }) => {
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
                toast.error("Image size is too big (max 10MB)");
              } else if (image.type.match("image")) {
                setbannerImage(image);
                onResult(image);
                setcropImage("");
              } else {
                toast.error("Upload only image");
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

export const InviteEmailComponent = ({ onResult, value }) => {
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

      setExternalMailId((prev) => {
        onResult([...prev, ...newMail]);
        return [...prev, ...newMail];
      });
    }
  };

  const removeExtMailHandler = (index) => {
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

export const AudioVideoSettings = ({ values, setFieldValue }) => {
  return (
    <div className="mt-2">
      <div className={classes.audioSetting}>
        Default Audio Settings
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
        Default Video Settings
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
