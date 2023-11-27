/**
 * A React component that represents a user profile page.
 * @returns The rendered profile page.
 */
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
import profile_member from "../../Assets/Icons/svg/profile_membership.svg";
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
import { Modal, Skeleton } from "antd";
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
import { detectMob } from "../../Shared/Utility";
import Seo from "../SEO/Seo";
import { ProfileSEO } from "../SEO/SEOContent";
import { ScrollRestoration } from "react-router-dom";
import { ShowUnclaimedAccountModal } from "../../Modal/DefaultModal";

const Profile = () => {
  const params = useParams();
  const leftContainer = useRef();
  const rightContainer = useRef();
  const token = useAuthToken();
  const display_user_id = DecryptionString(params.user_id);
  const [isInfluencerChatModalOpen, setisInfluencerChatModalOpen] = useState({
    show: false,
  });
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
  const [profileData, setprofileData] = useState();

  /**
   * Checks if the display user ID is equal to the login user ID.
   * @returns {boolean} True if the display user ID is equal to the login user ID, false otherwise.
   */
  const getisLoginUser = () => {
    return parseInt(display_user_id) === parseInt(loginUserData?.user_id);
  };

  /**
   * Retrieves the profile data of a user with the given ID.
   * @param {number} id - The ID of the user.
   * @returns None
   */
  const getuserprofile = (id) => {
    let otherprofileValue = {
      token: loginToken ? loginToken : "RAWCAST",
      user_id: id,
      auth_code: getAuthToken(loginToken ? loginToken : "RAWCAST"),
    };
    getOthersProfileService(JSONtoformdata(otherprofileValue))
      .then((res) => {
        if (res.data.status === 1) {
          setprofileData(res.data.profile);
          if (res.data.profile.lock_nugget === 1) {
            getprofile();
          }
          if (res.data.profile.unclaimed_status === 1) {
            ShowUnclaimedAccountModal({
              message:
                "Rawcaster generated profile Page to be claimed by the owner",
              isSubmitAvailable: true,
              SubmitButtonTitle: "OK",
            });
            setTimeout(() => {
              Modal.destroyAll();
            }, 5000);
          }
        }
      })
      .catch((err) => {});
  };

  /**
   * Retrieves the user profile based on the provided filter data.
   * If the search key or user ID is present in the filter data, it updates the filter data
   * with the necessary parameters and dispatches actions to reset the nuggets, update the
   * nugget form data, and fetch the nuggets by ID.
   * @returns None
   */
  const getprofile = () => {
    // if (loginToken) {
    let filterData = { ...nuggetFormData };
    if (filterData?.formData?.search_key || filterData?.formData?.user_id) {
      filterData.formData = {
        user_id: display_user_id,
        page_number: 1,
        nugget_type: 0,
        token: loginToken ? loginToken : "RAWCAST",
      };
      dispatch(handleResetNuggets());
      dispatch(handleNuggetFormData(filterData));
      dispatch(fetchNuggetsbyId(filterData));
    }
    // }
  };

  /**
   * Executes a side effect when the dependencies change. If `loginUserData` is truthy,
   * it checks if the user is logged in using `getisLoginUser()`. If the user is logged in,
   * it sets the `profileData` state to `loginUserData` and calls the `getprofile()` function.
   * If the user is not logged in, it clears the `profileData` state and calls the
   * `getuserprofile()` function with the `display_user_id` parameter.
   * @param {Function} effect - The side effect to execute.
   * @param {Array} dependencies - The dependencies to watch for changes.
   * @returns None
   */
  useEffect(() => {
    // if (loginUserData) {
    if (getisLoginUser()) {
      if (loginUserData) {
        setprofileData(loginUserData);
        getprofile();
      }
    } else {
      setprofileData();
      getuserprofile(display_user_id);
    }
    // }
  }, [display_user_id, loginUserData]);

  /**
   * Retrieves the followers list based on the provided filter values.
   * @param {Object} [filterValues={}] - The filter values to apply to the followers list.
   * @returns {Promise} - A promise that resolves to the final object containing the followers list.
   */
  const getFollowers = (filterValues = {}, page = 1) => {
    let promise = new Promise((resolve, reject) => {
      let fansList = {
        ...filterValues,
        token: loginToken ? loginToken : "RAWCAST",
        type: 2,
        page_number: page,
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
          toast.remove("rawcaster");
          toast.error(err.message, { id: "rawcaster" });
        });
    });
    return promise;
  };

  /**
   * Handles the action when a user becomes a fan.
   * @param {string|null} user_ref_id - The user reference ID. If provided, it will be used instead of the profileData's user_ref_id.
   * @returns {Promise} - A promise that resolves when the action is successfully handled, and rejects if there is an error.
   */
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

  /**
   * Handles the process of adding a user as a friend.
   * @param {Object} ele - The user object to add as a friend. Default value is null.
   * @returns {Promise} A promise that resolves when the user is successfully added as a friend.
   * If an error occurs, the promise is rejected.
   */
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

  /**
   * Retrieves the diamond verification type based on the login user data.
   * @returns {number} - The diamond verification type:
   *   - 1: The account verify status is:verified.
   *   - 2: The account verify status is:Approval Pending.
   *   - 3: The account verify status is:not verified but verify available for this member.
   *   - 4: The account verify status is:verify not available.
   */
  const getDiamondVeifyType = () => {
    if (loginUserData) {
      const { account_verify_type, user_status_id } = loginUserData;
      if (getisLoginUser()) {
        if (account_verify_type === 2) {
          return 1;
        } else if (account_verify_type === 1) {
          return 2;
        } else if (account_verify_type === 0) {
          return 3;
        }
        return 4;
      }
      return 4;
    }
    return 4;
  };

  // useEffect(() => {
  //   ShowUnclaimedAccountModal({
  //     message: "This is Unclaimed Account",
  //     isSubmitAvailable: false,
  //   });
  //   setTimeout(() => {
  //     Modal.destroyAll();
  //   }, 5000);
  // }, []);

  const profileValue = {
    FansList,
    setFansList,
    profileData,
    setprofileData,

    isLoginUser: getisLoginUser(),
    DiamondVerifyType: getDiamondVeifyType(),
    getFollowers,
    handleBecameFan,
    handleAddUser,
    leftContainer,
    rightContainer,
    setisInfluencerChatModalOpen,
    isInfluencerChatModalOpen,
  };

  const getUserData = () => profileData;
  return (
    <ProfileContext.Provider value={profileValue}>
      <Seo
        title={ProfileSEO(profileData?.first_name ?? "User").title}
        description={ProfileSEO(profileData?.first_name ?? "User").description}
      />
      <div>
        <div className={`mainWrapper`}>
          <ProfileLayout
            profileData={profileData}
            isFansEnabled
            isEditable
            setprofileData={setprofileData}
            isLocked={profileData && profileData.lock_fans === 1}
            handleAddUser={handleAddUser}
            setisInfluencerChatModalOpen={setisInfluencerChatModalOpen}
          >
            <div className={classes.fullcontainer}>
              <div
                ref={leftContainer}
                style={{
                  position: detectMob() ? "relative" : "sticky",

                  top: detectMob()
                    ? 0
                    : `calc(-${
                        leftContainer.current?.scrollHeight -
                        window.innerHeight +
                        20
                      }px)`,
                  // `calc(-${leftContainer.current?.offsetHeight / 2}px + ${
                  //     document.getElementById("banner_container")
                  //       ?.offsetHeight
                  //   }px)`
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
                            <Connections profileClass={true} />
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
                {!getisLoginUser() && loginToken && <OthersEventListing />}
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
                        <div
                          className={`${classes.item} ${classes.memberitem}`}
                        >
                          <p>
                            <img src={profile_member} alt={"Joined at"} />
                          </p>
                          <div className={classes.memberContent}>
                            <span className={classes.noWrap}>
                              Rawcaster membership is
                            </span>
                            <span className={classes.breakAll}>
                              {" "}
                              {profileData?.user_status}
                            </span>
                          </div>
                        </div>
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
                        userData={getUserData()}
                      />
                    )}
                  </>
                )}
              </div>

              <Nuggets
                isLoginuser={getisLoginUser()}
                isLoading={!profileData}
                isLocked={profileData && profileData.lock_nugget === 1}
                className={null}
              />

              <>
                {getisLoginUser() && isSuccess && (
                  <div
                    className={classes.rightProfiles}
                    ref={rightContainer}
                    style={{
                      position: "sticky",
                      top: `calc(-${
                        rightContainer.current?.offsetHeight / 2
                      }px + ${
                        document.getElementById("banner_container")
                          ?.offsetHeight
                      }px)`,
                    }}
                  >
                    {ConnectionsType.map((ele) => {
                      return ele.id === 3 ? (
                        <Connections profileClass={true} />
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
      <ScrollRestoration />
    </ProfileContext.Provider>
  );
};

export default Profile;
