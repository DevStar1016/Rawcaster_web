import React, { useEffect, useRef, useState } from "react";
import classes from "./Profile.module.css";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import ImageCropModal from "../../Modal/ImageCropModal";
import msgIcon from "../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../Assets/Images/svg/talkshowIcon.svg";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import {
  getAspectRatio,
  getAuthToken,
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
import { Spin } from "antd";
import FansThumb from "./Components/FansThumb";
import { useParams } from "react-router";

const Profile = () => {
  const params = useParams();
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
  const isLoginUser = parseInt(params.id) === parseInt(loginUserData?.user_id);

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
    if (isLoginUser) {
      if (loginUserData) {
        setprofileData(loginUserData);
      }
    } else {
      getuserprofile(params.id);
    }
  }, [params, loginUserData]);

  return (
    <div>
      <div className={`mainWrapper ${classes.profilePage}`}>
        <div className={classes.bannersec}>
          <img src={profileData?.cover_image} />
          {isLoginUser && (
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
              {isLoginUser && (
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

            <FansThumb isLoginUser={isLoginUser} />

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
              setprofileImg({
                type: "cover",
                src: e.target.files[0],
                ratio: getAspectRatio(1170, 240),
              });
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
            console.log(e.target.files[0]);
            if (e.target.files && e.target.files.length !== 0) {
              setprofileImg({
                type: "profile",
                src: e.target.files[0],
                ratio: getAspectRatio(150, 150),
              });
            }
          }}
          style={{ display: "none" }}
        />

        <div className={classes.fullcontainer}>
          <div className={classes.profileevent}>
            <div className={classes.profileIntro}>
              <h2>
                About {profileData?.first_name} <i class="material-icons">fiber_manual_record</i> <span>Entertainer</span>
              </h2>
              <ReadMore
                maxheight={"64px"}
                isReadMore={false}
                isLinkopenModal={isLinkopenModal}
                setisLinkopenModal={setisLinkopenModal}
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
            </div>
            <Events />
          </div>

          <Nuggets />
          <div className={classes.rightProfiles}>
            <UnclaimedInfluencers />
            {/* <Influencers /> */}
            <Fans />
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
