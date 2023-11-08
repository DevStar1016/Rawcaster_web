import {
  decodeHtml,
  getAspectRatio,
  handleProfileNavigate,
  isValidImageFile,
} from "../../../Shared/Utility";
import classes from "./Groups.module.css";
import {
  useAuthData,
  useFriends,
  useNuggets,
} from "../../../Shared/Reduxfetcher";
import { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useConfigureGroupContext } from "../../../Shared/Context";
import {
  Button,
  Input,
  Form as AndForm,
  Modal,
  Switch,
  Tooltip,
  Empty,
} from "antd";
import { toast } from "react-hot-toast";
import tickIcon from "../../../Assets/Icons/png/tick.png";
import {
  defaultGroupImg,
  defaultprofileImg,
} from "../../../Shared/CommonConstants";
import ReportGroup from "../../../Modal/Report/ReportGroup";
import ImageCropModal from "../../../Modal/ImageCropModal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export const GroupHeader = () => {
  const {
    isOwner,
    values,
    handleChange,
    handleSubmit,
    errors,
    setFieldValue,
    touched,
    groupId,
    setisAddMember,
    isAddMember,
    HandleDeleteGroup,
    GroupData,
    HandleModifyGroup,
    getValidConnections,
    handleReportGroup,
    handleExitGroup,
    close,
  } = useConfigureGroupContext();
  const [isLogoEditable, setisLogoEditable] = useState(true);
  const [isReport, setisReport] = useState(false);
  const [tempGroupImage, settempGroupImage] = useState(null);

  useEffect(() => {
    if (groupId) {
      if (GroupData && GroupData.group_category === 2) {
        setisLogoEditable(false);
      } else if (!isOwner) {
        if (GroupData && GroupData.group_category === 1) {
          setisLogoEditable(false);
        } else if (GroupData && GroupData?.group_category === 3) {
          setisLogoEditable(false);
        }
      }
    }
  }, [GroupData]);

  const uploadImageTrigger = () => {
    if (isLogoEditable) {
      document.getElementById("imageUpload").click();
    }
  };

  const onChangeImage = (event) => {
    if (event.target.files && event.target.files.length !== 0) {
      if (isValidImageFile(event.target.files[0])) {
        settempGroupImage({
          type: "groupIcon",
          src: event.target.files[0],
          ratio: getAspectRatio(150, 150),
        });
      } else {
        toast.remove("rawcaster");
        toast.error("Please Select Valid Image", { id: "rawcaster" });
      }
    }
  };

  const HeaderActions = () => {
    if (groupId) {
      if (GroupData && GroupData.group_category === 3) {
        if (isAddMember) {
          return (
            <>
              <img
                src={tickIcon}
                onClick={() => {
                  if (!errors.group_members) {
                    handleSubmit();
                  }
                }}
              />
              <span
                className="material-symbols-outlined"
                style={{ display: getValidConnections() ? "" : "none" }}
                onClick={() => {
                  setisAddMember(false);
                }}
              >
                cancel
              </span>
            </>
          );
        } else if (isOwner) {
          return (
            <>
              <img
                src={tickIcon}
                alt={"submit"}
                onClick={() => {
                  handleSubmit();
                }}
              />
              <Tooltip title="Exit and Delete" color={"red"}>
                <div className="d-flex justify-content-center">
                  <span
                    className="material-symbols-outlined"
                    onClick={() => {
                      Modal.confirm({
                        title: "Confirmation",
                        okText: "Yes",
                        cancelText: "No",
                        cancelButtonProps: {
                          danger: true,
                        },
                        content: (
                          <div>Are you sure you want to Delete this Group?</div>
                        ),
                        onOk: () => {
                          HandleDeleteGroup();
                        },
                      });
                    }}
                  >
                    delete
                  </span>
                </div>
              </Tooltip>
              <Tooltip title="Add Connection" color={"#F2718D"}>
                <div className="d-flex justify-content-center">
                  <span
                    className="material-symbols-outlined"
                    style={{ display: getValidConnections() ? "" : "none" }}
                    onClick={() => {
                      setisAddMember(true);
                    }}
                  >
                    person_add
                  </span>
                </div>
              </Tooltip>
              <Tooltip title="Share Group" color={"#F2718D"}>
                <div className="d-flex justify-content-center">
                  <span
                    className="material-symbols-outlined"
                    // style={{ display: getValidConnections() ? "" : "none" }}
                    onClick={() => {
                      navigator.clipboard.writeText(GroupData.referral_link);
                    }}
                  >
                    share
                  </span>
                </div>
              </Tooltip>
            </>
          );
        } else {
          return (
            <>
              <Tooltip title="Report and Exit Group" color={"#fc8403"}>
                <div className="d-flex justify-content-center">
                  <span
                    className="material-symbols-outlined"
                    onClick={() => {
                      setisReport(true);
                    }}
                    style={{
                      color: "#fc8403",
                      fontWeight: 500,
                    }}
                  >
                    report
                  </span>
                </div>
              </Tooltip>
              <Tooltip title="Exit Group" color={"red"}>
                <div
                  className="d-flex justify-content-center"
                  onClick={() => {
                    Modal.confirm({
                      title: "Confirmation",
                      okText: "Yes",
                      cancelText: "No",
                      cancelButtonProps: {
                        danger: true,
                      },
                      content: <div>Are you sure to exit this group?</div>,
                      onOk: () => {
                        handleExitGroup();
                        close();
                      },
                    });
                  }}
                >
                  <span className="material-symbols-outlined">logout</span>
                </div>
              </Tooltip>
            </>
          );
        }
      } else if (GroupData && GroupData.group_category === 2) {
        return (
          <Tooltip title="Report and Exit Group" color={"#fc8403"}>
            <div className="d-flex justify-content-center">
              <span
                onClick={() => {
                  setisReport(true);
                }}
                className="material-symbols-outlined"
                style={{
                  color: "#fc8403",
                  fontWeight: 500,
                }}
              >
                report
              </span>
            </div>
          </Tooltip>
        );
      } else {
        return <></>;
      }
    }
  };

  return (
    <div className="d-flex flex-row justify-content-between">
      <AndForm.Item
        style={{
          display: "inline-block",
          float: "left",
          marginBottom: "0px",
          paddingBottom: "0px",
        }}
      >
        <div
          onClick={uploadImageTrigger}
          className={`${classes.uploadImageSec} ${
            isLogoEditable ? "" : classes.disabledSec
          }`}
          style={{
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            marginRight: "11px",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div className={classes.overLaySec}>
            <span className="material-symbols-outlined">upload</span>
          </div>
          <img
            src={
              values?.group_icon && values.group_icon !== ""
                ? typeof values.group_icon === "string"
                  ? values.group_icon
                  : URL.createObjectURL(values.group_icon)
                : defaultGroupImg
            }
            style={{ borderRadius: "2px" }}
            alt="gropup-icon"
            width="44px"
            height="44px"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = defaultGroupImg;
            }}
          ></img>
        </div>
        <input
          type="file"
          id="imageUpload"
          name="imageUpload"
          style={{ display: "none" }}
          onChange={(event) => onChangeImage(event)}
          accept=".png,.jpg,.jpeg"
        ></input>
      </AndForm.Item>

      <AndForm.Item
        style={{
          display: "inline-block",
          width: "100%",
          marginBottom: "0px",
          paddingBottom: "0px",
        }}
      >
        <Input
          name="group_name"
          size="large"
          style={{ borderRadius: "10px", backgroundColor: "transparent" }}
          value={values.group_name}
          onChange={handleChange("group_name")}
          placeholder="Group Name"
          disabled={
            groupId ? !isOwner || GroupData?.group_category !== 3 : false
          }
        />
        {touched.group_name && (
          <p className="ErrTxt my-1">{errors?.group_name}</p>
        )}
      </AndForm.Item>
      <div className="ms-2">
        {groupId ? (
          <div className={classes.modifySec}>
            <HeaderActions />
          </div>
        ) : (
          <Button
            className={classes.CreateBtn}
            onClick={() => {
              handleSubmit();
            }}
          >
            Create
          </Button>
        )}
      </div>
      <ReportGroup
        msg="Report this group to Rawcaster"
        open={isReport}
        onSuccess={(val) => {
          handleReportGroup(val);
          setisReport(false);
          close();
        }}
        close={() => {
          setisReport(false);
        }}
      />
      {tempGroupImage?.src && (
        <ImageCropModal
          open={tempGroupImage?.src}
          validsize={5}
          src={URL.createObjectURL(tempGroupImage?.src)}
          ratio={tempGroupImage?.ratio}
          onSuccess={(val) => {
            if (GroupData && GroupData?.group_category !== 2) {
              const editData = {
                group_name: values.group_name,
                group_icon: val,
              };
              HandleModifyGroup(editData, false);
              settempGroupImage("");
              return;
            }
            setFieldValue("group_icon", val);
            settempGroupImage("");
          }}
          onFailure={() => {
            settempGroupImage("");
          }}
        />
      )}
    </div>
  );
};

export const SelectConnections = () => {
  const {
    touched,
    setFieldValue,
    errors,
    GroupMembers,
    groupId,
    GroupData,
    handleMemberChat,
  } = useConfigureGroupContext();
  const friends = useFriends();
  const [searchInput, setsearchInput] = useState("");
  const [SelectedConnections, setSelectedConnections] = useState([]);

  const getValidConnections = () => {
    if (groupId) {
      const TempMemberArray = GroupMembers.map((ele) => ele.user_id);
      return friends.filter((ele) => !TempMemberArray.includes(ele.user_id));
    }
    return friends;
  };

  const isChatSwichEnabled = () => {
    if (!groupId) {
      return false;
    }
    return true;
  };

  const getSearchData = () => {
    if (getValidConnections() && getValidConnections().length !== 0) {
      return getValidConnections().filter((ele) =>
        ele?.display_name
          ? decodeHtml(ele?.display_name)
              .toLowerCase()
              .includes(searchInput.toLowerCase())
          : ele
      );
    } else {
      return [];
    }
  };

  return (
    <div>
      <div className={classes.filterSec}>
        <div className={classes.memberSec}>
          <InputGroup className="mb-2">
            <Form.Control
              className={classes.inSearch}
              placeholder="Search your connections"
              aria-label="Search your connections"
              onChange={(e) => {
                setsearchInput(e.target.value);
              }}
            />
            <InputGroup.Text className={classes.searchIcon}>
              <span className="material-icons">search</span>
            </InputGroup.Text>
          </InputGroup>

          {isChatSwichEnabled() && (
            <div className={`${classes.chatEnabledSec} chatSwitch`}>
              <p>Chat:</p>
              <Switch
                checked={parseInt(GroupData?.chat_enabled) === 1}
                onChange={handleMemberChat}
              />
            </div>
          )}
        </div>

        {touched.group_members && (
          <p className="ErrTxt my-1 text-center">{errors?.group_members}</p>
        )}
      </div>
      <h2 className={classes.membersHeading}>
        Connections <span>({getSearchData().length})</span>
      </h2>
      {getSearchData().length ? (
        <div className={classes.ConnectionList}>
          {getSearchData()?.map((ele) => (
            <div
              className={`d-flex flex-row justify-content-between align-items-center ${classes.addFriends}`}
              style={{
                background:
                  SelectedConnections.includes(ele.user_id) && "#e6f4ff",
              }}
              onClick={() => {
                let findValue = SelectedConnections.find(
                  (elem) => elem === ele.user_id
                );
                if (findValue) {
                  setSelectedConnections((pre) => {
                    let result = pre.filter((elem) => elem !== ele.user_id);
                    if (result.length !== 0) {
                      setFieldValue("group_members", JSON.stringify(result));
                    } else {
                      setFieldValue("group_members", "");
                    }

                    return result;
                  });
                } else {
                  setSelectedConnections((pre) => {
                    let result = [...pre, ele.user_id];
                    if (result.length !== 0) {
                      setFieldValue("group_members", JSON.stringify(result));
                    } else {
                      setFieldValue("group_members", "");
                    }
                    return result;
                  });
                }
              }}
            >
              <div
                className={`${classes.friends} justify-content-between w-100`}
                style={{
                  position: "relative",
                  padding: "10px 0px",
                  display: decodeHtml(ele.display_name)
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())
                    ? "flex"
                    : "none",
                }}
              >
                <div className="d-flex flex-row">
                  <img
                    src={ele.profile_img ? ele.profile_img : ""}
                    alt="uploadImg"
                    style={{ borderRadius: "16px" }}
                    width="32px"
                    height="32px"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = defaultprofileImg;
                    }}
                  ></img>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      marginLeft: "10px",
                    }}
                  >
                    <span className={classes.userName}>
                      {decodeHtml(ele.display_name)}
                    </span>
                  </span>
                </div>
                <div
                  style={{
                    display: decodeHtml(ele.display_name)
                      .toLowerCase()
                      .includes(searchInput.toLowerCase())
                      ? "block"
                      : "none",
                    paddingRight: "10px",
                    paddingTop: "3px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      display: SelectedConnections.includes(ele.user_id)
                        ? ""
                        : "none",
                    }}
                  >
                    done
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.EmptySec}>
          <Empty description="No Connections Found" />
        </div>
      )}
    </div>
  );
};

export const EditGroupMembers = () => {
  const userData = useAuthData();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nuggetFormData } = useNuggets();
  const {
    isOwner,
    GroupMembers,
    GroupData,
    HandleDeleteFriendstoGroup,
    groupId,
    handleMemberChat,
  } = useConfigureGroupContext();
  const [searchInput, setsearchInput] = useState("");

  /**
   * Checks if the chat switch is enabled.
   * @returns {boolean} - Returns true if the chat switch is enabled, false otherwise.
   */
  const isChatSwichEnabled = () => {
    if (isOwner) {
      if (groupId) {
        return true;
      }

      return false;
    }
    return false;
  };

  /**
   * Retrieves search data from the GroupMembers array based on the search input.
   * @returns {Array} An array of search results that match the search input.
   */
  const getSearchData = () => {
    let searchData = GroupMembers.filter((ele) =>
      decodeHtml(ele?.display_name || "")
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    );
    searchData = searchData.filter((ele) => ele !== undefined);
    if (searchData) {
      return searchData;
    } else {
      return [];
    }
  };

  return (
    <div>
      <div className={classes.filterSec}>
        <div className={classes.memberSec}>
          {GroupData?.locked !== 1 && (
            <InputGroup className="mb-2">
              <Form.Control
                className={classes.inSearch}
                placeholder="Search Members"
                aria-label="Search Members"
                onChange={(e) => {
                  setsearchInput(e.target.value);
                }}
              />
              <InputGroup.Text className={classes.searchIcon}>
                <span className="material-icons">search</span>
              </InputGroup.Text>
            </InputGroup>
          )}

          {isChatSwichEnabled() && (
            <div className={`${classes.chatEnabledSec} chatSwitch`}>
              <p>Chat:</p>
              <Switch
                checked={parseInt(GroupData?.chat_enabled) === 1}
                onChange={handleMemberChat}
              />
            </div>
          )}
        </div>
      </div>
      <h2 className={classes.membersHeading}>
        Members
        <span>({GroupData?.group_member_count})</span>
      </h2>
      {GroupData?.locked === 1 ? (
        <div className={classes.lockedConnections}>
          <div className={classes.lockedoverLay}>
            <div className={classes.lockBtn}>
              <i className={classes.lock_icon}></i>
            </div>
          </div>

          <>
            {[...Array(GroupData?.group_member_count)]?.map((ele) => (
              <div
                className={`d-flex flex-row justify-content-between align-items-center ${classes.groupListSec}`}
              >
                <div
                  className={classes.friends}
                  style={{
                    position: "relative",
                    padding: "10px 0px",
                  }}
                >
                  <div className="d-flex flex-row">
                    <img
                      src={defaultprofileImg}
                      alt="uploadImg"
                      style={{ borderRadius: "16px" }}
                      width="32px"
                      height="32px"
                    ></img>
                    <span
                      className="d-flex flex-row"
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        marginLeft: "10px",
                        lineHeight: 2,
                      }}
                    >
                      <span className={classes.userName}>Rawcaster User</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        </div>
      ) : (
        <>
          {getSearchData().length !== 0 ? (
            <div className={`${classes.ConnectionList} my-2`}>
              {getSearchData()?.map((ele) => (
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <div
                    className={classes.friends}
                    onClick={() => {
                      let finalData = {
                        dispatch,
                        navigate,
                        nuggetFormData,
                        user_id: ele?.user_id,
                      };
                      handleProfileNavigate(finalData);
                    }}
                    style={{
                      position: "relative",
                      padding: "10px 0px",
                      display: decodeHtml(ele?.display_name)
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                        ? "block"
                        : "none",
                    }}
                  >
                    <div className="d-flex flex-row">
                      <img
                        src={ele.profile_img ? ele.profile_img : ""}
                        alt="uploadImg"
                        style={{ borderRadius: "16px" }}
                        width="32px"
                        height="32px"
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = defaultprofileImg;
                        }}
                      ></img>
                      <span
                        className="d-flex flex-row"
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          marginLeft: "10px",
                          lineHeight: 2,
                        }}
                      >
                        <span className={classes.userName}>
                          {decodeHtml(ele?.display_name)}
                        </span>
                        {userData.user_id === ele.user_id && `  (You)`}
                      </span>
                    </div>
                  </div>
                  <div className={classes.actionSec}>
                    {ele.user_id === GroupData?.group_owner ? (
                      <span
                        style={{
                          display: decodeHtml(ele?.display_name)
                            .toLowerCase()
                            .includes(searchInput.toLowerCase())
                            ? "block"
                            : "none",
                        }}
                      >
                        Owner
                      </span>
                    ) : (
                      <>
                        {isOwner &&
                          GroupData &&
                          parseInt(GroupData.group_category) !== 1 && (
                            <i
                              style={{
                                display: decodeHtml(ele?.display_name)
                                  .toLowerCase()
                                  .includes(searchInput.toLowerCase())
                                  ? "block"
                                  : "none",
                                cursor: "pointer",
                              }}
                            >
                              <span
                                className="material-symbols-outlined"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  Modal.confirm({
                                    title: "Confirmation",
                                    okText: "Yes",
                                    cancelText: "No",
                                    cancelButtonProps: {
                                      danger: true,
                                    },
                                    content: (
                                      <div>
                                        Are you sure you want to Remove this
                                        member ?
                                      </div>
                                    ),
                                    onOk: () => {
                                      HandleDeleteFriendstoGroup(ele.user_id);
                                    },
                                  });
                                }}
                              >
                                close
                              </span>
                            </i>
                          )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-3">
              <Empty description="No Members Found" />
            </div>
          )}
        </>
      )}
    </div>
  );
};
