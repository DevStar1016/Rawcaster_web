import React, { useEffect, useRef, useState } from "react";
import classes from "./Profile.module.css";
import {
  useAuth,
  useAuthData,
  useAuthToken,
  useNuggets,
} from "../../Shared/Reduxfetcher";
import profile_work from "../../Assets/Images/svg/profile_work.svg";
import profile_edu from "../../Assets/Images/svg/profile_edu.svg";
import profile_location from "../../Assets/Images/svg/profile_location.svg";
import profile_bdy from "../../Assets/Images/svg/profile_bdy.svg";
import profile_join from "../../Assets/Images/svg/profile_join.svg";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import {
  DecryptionString,
  getAuthToken,
  JSONtoformdata,
} from "../../Shared/Utility";
import { getOthersProfileService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Skeleton } from "antd";
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
import { getfollowerfollowingService } from "./Components/Utility";
import ProfileLayout from "./ProfileLayout";
import { HandleAddFriend, HandleBecameaFan } from "../../Shared/SharedAPIs";
import { friendRequestSocket } from "../../Services/SocketList";
import styles from "./Profileothers.module.css";

const Profile = () => {
  const params = useParams();
  const leftContainer = useRef();
  const rightContainer = useRef();
  const token = useAuthToken();
  const [hideHeader, setHideHeader] = useState(false);
  const display_user_id = DecryptionString(params.user_id);
  const navigate = useNavigate();
  const { isSuccess } = useAuth();
  const { nuggetFormData } = useNuggets();
  const loginToken = useAuthToken();
  const dispatch = useDispatch();
  const loginUserData = useAuthData();
  const [FansList, setFansList] = useState({
    connections: [],
    allconnections: [],
    connectionscount: 0,
    allconnectionscount: 0,
    filteredConnections: [],
    filteredConnectionCount: 0,
    isLoaded: true,
  });
  const [isLinkopenModal, setisLinkopenModal] = useState(false);
  const [profileData, setprofileData] = useState();

  const getisLoginUser = () => {
    return parseInt(display_user_id) === parseInt(loginUserData?.user_id);
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
          if (res.data.profile.lock_nugget === 1) {
            getprofile();
          }
        }
      })
      .catch((err) => {});
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
      if (getisLoginUser()) {
        if (loginUserData) {
          setprofileData(loginUserData);
          getprofile();
        }
      } else {
        setprofileData();
        getuserprofile(display_user_id);
      }
    }
  }, [display_user_id, loginUserData]);

  const getFollowers = (filterValues = {}) => {
    let promise = new Promise((resolve, reject) => {
      let fansList = {
        ...filterValues,
        token: loginToken,
        type: 2,
      };
      if (!getisLoginUser()) {
        fansList = {
          ...fansList,
          user_id: display_user_id,
        };
      }
      getfollowerfollowingService(fansList)
        .then((res) => {
          let isFilterEnable = Object.keys(filterValues).length !== 0;
          let finalObj = {
            ...res,
          };
          if (isFilterEnable) {
            finalObj = {
              ...FansList,
              filteredConnections: res.allconnections,
              filteredConnectionCount: res.allconnectionscount,
            };
          } else {
            finalObj = {
              ...res,
              filteredConnections: res.allconnections,
              filteredConnectionCount: res.allconnectionscount,
            };
          }
          resolve(finalObj);
          setFansList(finalObj);
        })
        .catch((err) => {
          resolve(FansList);
          toast.error(err.message);
        });
    });
    return promise;
  };

  const handleBecameFan = (user_ref_id = null) => {
    return new Promise((resolve, reject) => {
      if (token && profileData) {
        const ref_id = user_ref_id ? user_ref_id : profileData?.user_ref_id;
        HandleBecameaFan(token, ref_id)
          .then(() => {
            if (!user_ref_id) {
              setprofileData((pre) => ({
                ...pre,
                follow: true,
              }));
            }
            resolve();
          })
          .catch(() => {
            reject();
          });
      }
    });
  };

  const handleAddUser = (ele = null) => {
    return new Promise((resolve, reject) => {
      if (token && (ele || profileData)) {
        const refId = ele ? ele?.user_ref_id : profileData?.user_ref_id;
        HandleAddFriend(token, refId)
          .then((res) => {
            let data = {
              friend_request_id: res.friend_request_ids[0],
              display_name: ele ? ele.name : loginUserData.name,
              profile_img: ele
                ? ele.profile_image
                : loginUserData.profile_image,
              user_id: ele ? ele.user_id : loginUserData.user_id,
            };
            friendRequestSocket(
              ele ? ele.user_id : loginUserData.user_id,
              data
            );
            if (ele === null) {
              setprofileData((pre) => ({
                ...pre,
                friend_status: 0,
              }));
            }

            resolve();
          })
          .catch((err) => {
            reject();
          });
      }
    });
  };

  const profileValue = {
    FansList,
    setFansList,
    profileData,
    setprofileData,
    isLinkopenModal,
    setisLinkopenModal,
    isLoginUser: getisLoginUser(),
    getFollowers,
    handleBecameFan,
    handleAddUser,
    leftContainer,
    rightContainer,
  };

  const getHeight = () => {
    const leftheight = leftContainer.current?.offsetHeight / 2;
    console.log(leftheight, window.innerHeight);
  };

  return (
    <ProfileContext.Provider value={profileValue}>
      <div>
        <div className={`mainWrapper ${classes.profilePage}`}>
          <ProfileLayout
            profileData={profileData}
            isFansEnabled
            isEditable
            className={hideHeader ? styles.hidden : ""}
            setprofileData={setprofileData}
            isLocked={profileData && profileData.lock_fans === 1}
            handleAddUser={handleAddUser}
          >
            <div className={classes.fullcontainer}>
              <div
                ref={leftContainer}
                style={{
                  position: "sticky",
                  top: `-${leftContainer.current?.offsetHeight / 2}px`,
                }}
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
                              isLoading={!profileData}
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
                        {profileData?.work_at &&
                          profileData?.work_at !== "" && (
                            <div className={classes.item}>
                              <p>
                                <img src={profile_work} alt={"Work"} />
                              </p>{" "}
                              Work at <span> {profileData?.work_at}</span>
                            </div>
                          )}
                        {profileData?.studied_at &&
                          profileData?.studied_at !== "" && (
                            <div className={classes.item}>
                              <p>
                                <img src={profile_edu} alt={"Education"} />
                              </p>{" "}
                              Studied at <span>{profileData?.studied_at}</span>
                            </div>
                          )}
                        {profileData?.geo_location && (
                          <div className={classes.item}>
                            <p>
                              <img src={profile_location} alt={"Location"} />
                            </p>
                            {profileData?.geo_location}
                          </div>
                        )}
                        {profileData?.dob && profileData?.dob !== "" && (
                          <div className={classes.item}>
                            <p>
                              <img src={profile_bdy} alt={"Date of Birth"} />
                            </p>
                            Date of Birth
                            <span>
                              {moment(profileData?.dob, "YYYY-MM-DD").format(
                                " DD/MM/YYYY"
                              )}
                            </span>
                          </div>
                        )}
                        <div className={classes.item}>
                          <p>
                            <img src={profile_join} alt={"Joined at"} />
                          </p>
                          Joined RAWCASTER on
                          <span>
                            {moment(profileData?.date_of_join).format(
                              " DD-MM-YYYY"
                            )}
                          </span>
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
                isLoading={!profileData}
                isLocked={profileData && profileData.lock_nugget === 1}
                maxHeight={getHeight()}
                className={null}
              />

              <>
                {getisLoginUser() && isSuccess && (
                  <div className={classes.rightProfiles} ref={rightContainer}>
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
          </ProfileLayout>
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default Profile;
