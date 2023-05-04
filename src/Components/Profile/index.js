import React, { useEffect, useState } from "react";
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

const Profile = () => {
  const params = useParams();
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

  const getFollowers = (filterValues = {}) => {
    let promise = new Promise((resolve, reject) => {
      console.log("test1");
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

  const profileValue = {
    FansList,
    setFansList,
    profileData,
    isLinkopenModal,
    setisLinkopenModal,
    isLoginUser: getisLoginUser(),
    getFollowers,
  };

  return (
    <ProfileContext.Provider value={profileValue}>
      <div>
        <div className={`mainWrapper ${classes.profilePage}`}>
          <ProfileLayout profileData={profileData} isFansEnabled isEditable>
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
                        {profileData?.work_at &&
                          profileData?.work_at !== "" && (
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
          </ProfileLayout>
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default Profile;
