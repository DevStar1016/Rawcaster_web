import React, { useEffect, useRef, useState } from "react";
import classes from "./Profile.module.css";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
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
  ReadMore,
} from "../../Shared/Utility";
import Events from "./Components/Events";
import UnclaimedInfluencers from "./Components/UnclaimedInfluencers";
import Fans from "./Components/Fans";
import {
  getOthersProfileService,
  updateProfileService,
} from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import { getProfile } from "../Auth/getProfile";
import { useDispatch } from "react-redux";
import { Skeleton, Spin } from "antd";
import FansThumb from "./Components/FansThumb";
import { useParams } from "react-router";
import Connections from "../Connections/Connections";

const Profile = () => {
  const params = useParams();
  const display_user_id = DecryptionString(params.user_id);
  const loginToken = useAuthToken();
  const dispatch = useDispatch();
  const coverRef = useRef();
  const profileRef = useRef();
  const loginUserData = useAuthData();

  const [isLinkopenModal, setisLinkopenModal] = useState(false);
  const [profileData, setprofileData] = useState([]);
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
          const modalHandle = () => {
            setisUploading(false);
          };
          getProfile(loginToken, dispatch, modalHandle);
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

  useEffect(() => {
    if (loginUserData) {
      if (getisLoginUser()) {
        if (loginUserData) {
          setprofileData(loginUserData);
        }
      } else {
        getuserprofile(display_user_id);
      }
    }
  }, [display_user_id, loginUserData]);

  return (
    <div>
      <div className={`mainWrapper ${classes.profilePage}`}>
        <div className={classes.bannersec}>
          <Skeleton.Node active={true} className={classes.bannerImg}>
            <img src={profileData?.cover_image} />
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
          <div className={classes.profileevent}>
            <div className={classes.profileIntro}>
              <h2>
                About {profileData?.first_name}{" "}
                <i class="material-icons">fiber_manual_record</i>{" "}
                <span>Entertainer</span>
              </h2>
              <ReadMore
                maxheight={"64px"}
                isReadMore={false}
                isLinkopenModal={isLinkopenModal}
                setisLinkopenModal={setisLinkopenModal}
                isReadMoreValid={() => {
                  console.log("valid");
                }}
              >
                The richest man in the world, Elon Musk, has created a chip
                (Neuralink) that will be inserted into the human brain. He said
                that his prime motivation for is Neuralink was the question:
                'What do we do if there is a super intelligence that is much
                smarter than human beings much smarter The richest man in the
              </ReadMore>
            </div>

            <div className={classes.intro}>
              <h2>Intro</h2>
              <div className={classes.item}>
                <p>
                  <img src={profile_work} />
                </p>{" "}
                Work at Rawcaster
              </div>
              <div className={classes.item}>
                <p>
                  <img src={profile_edu} />
                </p>{" "}
                Studied at ABCD
              </div>
              <div className={classes.item}>
                <p>
                  <img src={profile_location} />
                </p>{" "}
                Alpharetta, Georgia, United State
              </div>
              <div className={classes.item}>
                <p>
                  <img src={profile_bdy} />
                </p>{" "}
                Date of Birth 02/03/1992
              </div>
              <div className={classes.item}>
                <p>
                  <img src={profile_join} />
                </p>{" "}
                Joined RAWCASTER on 03 Jan 2020
              </div>
            </div>
            <Events />
          </div>

          <Nuggets />

          <div className={classes.rightProfiles}>
            <UnclaimedInfluencers />
            {/* <Influencers /> */}
            <Fans />
            <Connections />
          </div>
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
  );
};

export default Profile;
