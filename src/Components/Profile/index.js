import React, { useEffect, useRef, useState } from "react";
import classes from "./Profile.module.css";
import {
  useAuth,
  useAuthData,
  useAuthToken,
  useNuggets,
} from "../../Shared/Reduxfetcher";
import ImageCropModal from "../../Modal/ImageCropModal";
import msgIcon from "../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../Assets/Images/svg/talkshowIcon.svg";
import profile_work from "../../Assets/Images/svg/profile_work.svg";
import profile_edu from "../../Assets/Images/svg/profile_edu.svg";
import profile_location from "../../Assets/Images/svg/profile_location.svg";
import profile_bdy from "../../Assets/Images/svg/profile_bdy.svg";
import profile_join from "../../Assets/Images/svg/profile_join.svg";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import {
  DecryptionString,
  getAspectRatio,
  getAuthToken,
  isValidImageFile,
  JSONtoformdata,
} from "../../Shared/Utility";
import {
  getOthersProfileService,
  updateProfileService,
} from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { getProfile } from "../Auth/getProfile";
import { useDispatch } from "react-redux";
import { Skeleton, Spin } from "antd";
import FansThumb from "./Components/FansThumb";
import { useNavigate, useParams } from "react-router";
import Connections from "../Connections/Friends/Connections";
import moment from "moment";
import { ProfileContext } from "../../Shared/Context";
import BioContainer from "./Components/BioContainer";
import Eventslisting from "../Events/Eventslisting";
import ConnectionsList from "./Components/Connections";
import { ConnectionsType } from "./Components/Constants";
import OthersEventListing from "../Events/OthersEventListing";
import {
  handleNuggetFormData,
  handleResetNuggets,
} from "../../Store/Redux/Reducer/NuggetsReducer";
import { fetchNuggetsbyId } from "../../Store/Redux/Action";

const Profile = () => {
  const params = useParams();
  const display_user_id = DecryptionString(params.user_id);
  const navigate = useNavigate();
  const { isSuccess } = useAuth();
  const { nuggetFormData } = useNuggets();
  const loginToken = useAuthToken();
  const dispatch = useDispatch();
  const coverRef = useRef();
  const profileRef = useRef();
  const loginUserData = useAuthData();
  const [isCoverLoading, setisCoverLoading] = useState(true);
  const [FansList, setFansList] = useState({
    connections: [],
    allconnections: [],
    connectionscount: 0,
    allconnectionscount: 0,
    isLoaded: true,
  });
  const [isLinkopenModal, setisLinkopenModal] = useState(false);
  const [profileData, setprofileData] = useState();
  const [isUploading, setisUploading] = useState(false);
  const [profileImg, setprofileImg] = useState({
    type: "",
    src: "",
    ratio: "",
  });
  const getisLoginUser = () => {
    return parseInt(display_user_id) === parseInt(loginUserData?.user_id);
  };

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
          getProfile(loginToken, dispatch).then(() => {
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

  const getuserprofile = (id) => {
    let otherprofileValue = {
      token: loginToken,
      user_id: id,
      auth_code: getAuthToken(loginToken),
    };
    getOthersProfileService(JSONtoformdata(otherprofileValue))
      .then((res) => {
        if (res.data.status === 1) {
          setprofileData(res.data.profile);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const getprofile = () => {
    let filterData = { ...nuggetFormData };
    if (filterData?.formData?.search_key || filterData?.formData?.user_id) {
      filterData.formData = {
        user_id: display_user_id,
        page_number: 1,
        nugget_type: 0,
      };
      dispatch(handleResetNuggets());
      dispatch(handleNuggetFormData(filterData));
      dispatch(fetchNuggetsbyId(filterData));
    }
  };

  useEffect(() => {
    if (loginUserData) {
      getprofile();
      if (getisLoginUser()) {
        if (loginUserData) {
          setprofileData(loginUserData);
        }
      } else {
        getuserprofile(display_user_id);
      }
    }
  }, [display_user_id, loginUserData]);

  const profileValue = {
    FansList,
    setFansList,
    profileData,
    isLinkopenModal,
    setisLinkopenModal,
    isLoginUser: getisLoginUser(),
  };

  return (
    <ProfileContext.Provider value={profileValue}>
      <div>
        <div className={`mainWrapper ${classes.profilePage}`}>
          <div className={classes.bannersec}>
            <Skeleton.Node
              active={isCoverLoading}
              className={classes.bannerImg}
            >
              <img
                src={profileData?.cover_image}
                onLoadStart={() => {
                  setisCoverLoading(true);
                }}
                onLoad={() => {
                  setisCoverLoading(false);
                }}
                onError={() => {
                  setisCoverLoading(false);
                }}
              />
            </Skeleton.Node>

            {getisLoginUser() && (
              <div className={classes.uploadSec}>
                {isUploading === "cover" ? (
                  <Spin size="small" className={classes.loader} />
                ) : (
                  <span
                    class="material-symbols-outlined"
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
                <img src={profileData?.profile_image} />
                {getisLoginUser() && (
                  <div className={classes.uploadSec}>
                    {isUploading === "profile" ? (
                      <Spin size="small" className={classes.loader} />
                    ) : (
                      <span
                        class="material-symbols-outlined"
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

              {loginUserData && <FansThumb isLoginUser={getisLoginUser()} />}

              <div className={classes.actionIcon}>
                <img src={msgIcon} />
                <img src={talkshowIcon} />
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

          <div className={classes.fullcontainer}>
            <div
              className={`${classes.profileevent} ${
                getisLoginUser() ? "" : classes.othersprofileEvent
              }`}
            >
              <BioContainer isLoginuser={getisLoginUser()} />

              {!getisLoginUser() && (
                <>
                  {isSuccess && (
                    <div className={classes.rightProfiles}>
                      {ConnectionsType.map((ele) => {
                        return ele.id === 3 && getisLoginUser() ? (
                          <Connections />
                        ) : (
                          <ConnectionsList
                            {...ele}
                            isMyProfile={false}
                            isLocked={
                              profileData && profileData[ele.lockedName] === 1
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              )}
              {!getisLoginUser() && <OthersEventListing />}
              {getisLoginUser() && (
                <>
                  {isSuccess ? (
                    <div className={classes.intro}>
                      <div className={classes.headingSec}>
                        <h2>Intro</h2>
                        <div
                          className={classes.editSec}
                          style={{
                            display: getisLoginUser() ? "block" : "none",
                          }}
                          onClick={() => {
                            window.scrollTo(0, 0);
                            navigate("/profile");
                          }}
                        >
                          <i className={classes.editIcon}></i>
                        </div>
                      </div>
                      {profileData?.work_at && profileData?.work_at !== "" && (
                        <div className={classes.item}>
                          <p>
                            <img src={profile_work} />
                          </p>{" "}
                          Work at {profileData?.work_at}
                        </div>
                      )}
                      {profileData?.studied_at &&
                        profileData?.studied_at !== "" && (
                          <div className={classes.item}>
                            <p>
                              <img src={profile_edu} />
                            </p>{" "}
                            Studied at {profileData?.studied_at}
                          </div>
                        )}
                      {profileData?.geo_location && (
                        <div className={classes.item}>
                          <p>
                            <img src={profile_location} />
                          </p>
                          {profileData?.geo_location}
                        </div>
                      )}
                      {profileData?.dob && profileData?.dob !== "" && (
                        <div className={classes.item}>
                          <p>
                            <img src={profile_bdy} />
                          </p>
                          Date of Birth
                          {moment(profileData?.dob, "YYYY-MM-DD").format(
                            " DD/MM/YYYY"
                          )}
                        </div>
                      )}
                      <div className={classes.item}>
                        <p>
                          <img src={profile_join} />
                        </p>
                        Joined RAWCASTER on
                        {moment(profileData?.date_of_join).format(
                          " DD-MM-YYYY"
                        )}
                      </div>
                    </div>
                  ) : (
                    <Skeleton active />
                  )}
                  {isSuccess && (
                    <Eventslisting
                      isCreateEnabled={getisLoginUser()}
                      isSearchEnabled={true}
                      isUser={true}
                      userData={profileData}
                    />
                  )}
                </>
              )}
            </div>

            <Nuggets
              isLoginuser={getisLoginUser()}
              isLocked={profileData && profileData.lock_nugget === 1}
            />

            <>
              {getisLoginUser() && isSuccess && (
                <div className={classes.rightProfiles}>
                  {ConnectionsType.map((ele) => {
                    return ele.id === 3 ? (
                      <Connections />
                    ) : (
                      <ConnectionsList {...ele} isMyProfile={true} />
                    );
                  })}
                </div>
              )}
            </>
          </div>
        </div>
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
    </ProfileContext.Provider>
  );
};

export default Profile;