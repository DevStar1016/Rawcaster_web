import React, { useRef, useState } from "react";
import msgIcon from "../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../Assets/Images/svg/talkshowIcon.svg";
import FansThumb from "./Components/FansThumb";
import { toast } from "react-hot-toast";
import {
  useAuthData,
  useAuthToken,
  useDashboard,
} from "../../Shared/Reduxfetcher";
import {
  DecryptionString,
  EncryptionString,
  JSONtoformdata,
  getAspectRatio,
  getAuthToken,
  getisAddFriend,
  isValidImageFile,
} from "../../Shared/Utility";
import classes from "./Profile.module.css";
import { updateProfileService } from "../../Services/ApiService";
import { useDispatch } from "react-redux";
import { Button, Dropdown, Image, Modal, Skeleton, Spin } from "antd";
import ImageCropModal from "../../Modal/ImageCropModal";
import { useLocation, useNavigate, useParams } from "react-router";
import { fetchuserInfobyToken } from "../../Store/Redux/Action";
import AddFriendIcon from "../../Assets/Icons/svg/profile_add_friend.svg";
import ClaimAccountModal from "../../Modal/Connections/ClaimAccountModal";
import { handleClaimAccount } from "../../Store/Redux/Reducer/DashboardReducer";
import { handleUnFollowService, handleUnFriendService } from "./Utility";
import DiamonVerified from "../../Assets/Icons/svg/diamond_verified.svg";
import { defaultprofileImg } from "../../Shared/CommonConstants";

const ProfileLayout = ({
  children,
  profileData = null,
  isFansEnabled = false,
  isEditable = false,
  isLocked = false,
  handleAddUser,
  setprofileData,
  className = null,
  setisInfluencerChatModalOpen = null,
}) => {
  const loginUserData = useAuthData();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const params = useParams();
  const display_user_id = DecryptionString(params.user_id);
  const isLoginUser =
    parseInt(display_user_id) === parseInt(loginUserData?.user_id);
  const coverRef = useRef();
  const profileRef = useRef();
  const dispatch = useDispatch();
  const loginToken = useAuthToken();
  const { claimAccount } = useDashboard();
  const [isUploading, setisUploading] = useState(false);
  const [isCoverLoading, setisCoverLoading] = useState(true);
  const [profileImg, setprofileImg] = useState({
    type: "",
    src: "",
    ratio: "",
  });

  const handleUpdateProfile = (image) => {
    let profileValue = {
      token: loginToken,
      name: loginUserData.name.trim(),
      auth_code: getAuthToken(loginToken + loginUserData.name.trim()),
    };
    if (profileImg.type === "cover") {
      profileValue = {
        ...profileValue,
        cover_image: image,
      };
    } else if (profileImg.type === "profile") {
      profileValue = {
        ...profileValue,
        profile_image: image,
      };
    }
    updateProfileService(JSONtoformdata(profileValue))
      .then((res) => {
        if (res.data.status === 1) {
          dispatch(fetchuserInfobyToken(loginToken)).then(({ payload }) => {
            setisUploading(false);
          });
        } else {
          toast.error(res.data.msg);
          setisUploading(false);
        }
      })
      .catch((err) => {
        toast.error(err.message);
        setisUploading(false);
      });
  };

  const isAddFriend = () => {
    if (isLoginUser) {
      return false;
    } else if (profileData?.unclaimed_status === 0) {
      return false;
    } else if (pathname.includes("claim")) {
      return false;
    } else if (getisAddFriend(profileData?.friend_status)) {
      return true;
    } else {
      return false;
    }
  };

  const UnfriendService = () => {
    handleUnFriendService(loginToken, profileData?.user_ref_id).then(() => {
      setprofileData((pre) => ({
        ...pre,
        friend_status: 0,
      }));
    });
  };
  const UnfollowService = () => {
    handleUnFollowService(loginToken, profileData?.user_ref_id).then(() => {
      setprofileData((pre) => ({
        ...pre,
        follow: false,
      }));
    });
  };

  const DropDownItems = [
    {
      key: 1,
      label: (
        <div
          onClick={() => {
            Modal.confirm({
              title: "Confirmation",
              okText: "Yes",
              cancelText: "No",
              okButtonProps: {
                danger: true,
              },
              content: <div>Are you sure to Unfollow this User ?</div>,
              onOk: () => {
                UnfollowService();
              },
            });
          }}
        >
          Unfollow
        </div>
      ),
    },
    {
      key: 2,
      label: (
        <div
          onClick={() => {
            Modal.confirm({
              title: "Confirmation",
              okText: "Yes",
              cancelText: "No",
              okButtonProps: {
                danger: true,
              },
              content: <div>Are you sure to remove this connection ?</div>,
              onOk: () => {
                UnfriendService();
              },
            });
          }}
        >
          Remove Friend
        </div>
      ),
    },
  ];

  const getValidItems = () => {
    return DropDownItems.filter((ele) => {
      const getisAddFriend = () => {
        if (profileData) {
          switch (profileData.friend_status) {
            case 1:
              return true;
            default:
              return false;
          }
        } else {
          if (profileData?.unclaimed_status === 0) {
            return false;
          }
          return true;
        }
      };
      if (
        !isAddFriend() &&
        getisAddFriend() &&
        parseInt(ele.key) === 2 &&
        !isLoginUser
      ) {
        return ele;
      } else if (profileData?.follow && ele.key === 1) {
        return ele;
      }
    });
  };

  return (
    <div className={className ? className : ""} id="banner_container">
      <div className={classes.bannersec}>
        <Image
          alt="Cover Image"
          width="100%"
          preview={false}
          rootClassName={classes.bannerImg}
          src={profileData?.cover_image}
          placeholder={
            <Skeleton.Node active={true} className={classes.bannerImg}>
              <div className={classes.bannerLoading}></div>
            </Skeleton.Node>
          }
        />

        {isLoginUser && (
          <div
            className={classes.uploadSec}
            style={{ display: isEditable ? "" : "none" }}
          >
            {isUploading === "cover" ? (
              <Spin size="small" className={classes.loader} />
            ) : (
              <span
                className="material-symbols-outlined"
                onClick={() => {
                  coverRef?.current.click();
                }}
              >
                photo_camera
              </span>
            )}
          </div>
        )}
      </div>
      {profileData && (
        <div className={classes.profileContainer}>
          <div className={classes.profileSec}>
            <img
              src={DiamonVerified}
              className={classes.verifiedImg}
              style={{
                display:
                  profileData?.account_verify_type === 2 ? "block" : "none",
              }}
            />

            <img
              src={profileData?.profile_image}
              alt="Profile"
              className={classes.profileImg}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = defaultprofileImg;
              }}
            />
            {isLoginUser && (
              <div
                className={classes.uploadSec}
                style={{ display: isEditable ? "" : "none" }}
              >
                {isUploading === "profile" ? (
                  <Spin size="small" className={classes.loader} />
                ) : (
                  <span
                    className="material-symbols-outlined"
                    onClick={() => {
                      profileRef?.current.click();
                    }}
                  >
                    photo_camera
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="d-md-flex flex-row justify-content-between">
            <div className="d-flex flex-row align-items-baseline">
              {isAddFriend() && (
                <div className="ms-3">
                  <img
                    src={AddFriendIcon}
                    alt="Add Friend"
                    className={classes.addFriendIcon}
                    onClick={() => {
                      handleAddUser();
                    }}
                  />
                </div>
              )}
              <div className={classes.profilesSec}>
                {isFansEnabled && (
                  <div style={{ display: isLocked ? "none" : "" }}>
                    {loginUserData && <FansThumb isLoginUser={isLoginUser} />}

                    <div
                      className={classes.actionIcon}
                      style={{
                        display: isLoginUser ? "" : "none",
                      }}
                    >
                      <img
                        src={msgIcon}
                        alt="Message"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (setisInfluencerChatModalOpen) {
                            setisInfluencerChatModalOpen({ show: true });
                          }
                        }}
                      />
                      <img src={talkshowIcon} alt="Talkshow" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={classes.claimBtnSec}>
              {profileData?.unclaimed_status === 0 && (
                <Button
                  className={`${classes.becomeafanbtn} mx-4`}
                  onClickCapture={() => {
                    navigate(`/claim/${EncryptionString(profileData.user_id)}`);
                  }}
                >
                  Claim this Account
                </Button>
              )}
              {getValidItems().length !== 0 && (
                <Dropdown
                  placement="bottomRight"
                  menu={{
                    items: getValidItems(),
                    selectable: false,
                  }}
                >
                  <div style={{ cursor: "pointer" }}>
                    <span className="material-icons">more_horiz</span>
                  </div>
                </Dropdown>
              )}
            </div>
          </div>
        </div>
      )}

      <input
        ref={coverRef}
        type="file"
        name="file"
        id="post_nugget_image"
        accept="image/png, image/jpeg"
        onClick={(event) => {
          event.target.value = null;
        }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length !== 0) {
            if (isValidImageFile(e.target.files[0])) {
              setprofileImg({
                type: "cover",
                src: e.target.files[0],
                ratio: getAspectRatio(1170, 240),
              });
            } else {
              toast.error("Please Select Valid Image");
            }
          }
        }}
        style={{ display: "none" }}
      />

      <input
        ref={profileRef}
        type="file"
        name="file"
        id="post_nugget_image"
        accept="image/png, image/jpeg"
        onClick={(event) => {
          event.target.value = null;
        }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length !== 0) {
            if (isValidImageFile(e.target.files[0])) {
              setprofileImg({
                type: "profile",
                src: e.target.files[0],
                ratio: getAspectRatio(150, 150),
              });
            } else {
              toast.error("Please Select Valid Image");
            }
          }
        }}
        style={{ display: "none" }}
      />

      {children}
      {claimAccount.show && (
        <ClaimAccountModal
          visible={claimAccount.show}
          msg={claimAccount.msg}
          onClose={() => {
            dispatch(
              handleClaimAccount({
                show: false,
                msg: "",
              })
            );
          }}
        />
      )}
      {profileImg.src !== "" && (
        <ImageCropModal
          open={profileImg.src !== ""}
          validsize={5}
          src={URL.createObjectURL(profileImg.src)}
          ratio={profileImg.ratio}
          onSuccess={(val) => {
            handleUpdateProfile(val);
            setisUploading(profileImg.type);
            setprofileImg({
              type: "",
              src: "",
              ratio: "",
            });
          }}
          onFailure={() => {
            setprofileImg({
              type: "",
              src: "",
              ratio: "",
            });
          }}
        />
      )}
    </div>
  );
};

export default ProfileLayout;
