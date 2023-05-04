import React, { useRef, useState } from "react";
import msgIcon from "../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../Assets/Images/svg/talkshowIcon.svg";
import FansThumb from "./Components/FansThumb";
import { toast } from "react-hot-toast";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  DecryptionString,
  JSONtoformdata,
  getAspectRatio,
  getAuthToken,
  isValidImageFile,
} from "../../Shared/Utility";
import classes from "./Profile.module.css";
import { updateProfileService } from "../../Services/ApiService";
import { getProfile } from "../Auth/getProfile";
import { useDispatch } from "react-redux";
import { Skeleton, Spin } from "antd";
import ImageCropModal from "../../Modal/ImageCropModal";
import { useParams } from "react-router";

const ProfileLayout = ({
  children,
  profileData = null,
  isFansEnabled = false,
  isEditable = false,
}) => {
  const loginUserData = useAuthData();
  const params = useParams();
  const display_user_id = DecryptionString(params.user_id);
  const isLoginUser =
    parseInt(display_user_id) === parseInt(loginUserData?.user_id);
  const coverRef = useRef();
  const profileRef = useRef();
  const dispatch = useDispatch();
  const loginToken = useAuthToken();

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

  return (
    <>
      <div className={classes.bannersec}>
        <Skeleton.Node active={isCoverLoading} className={classes.bannerImg}>
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

        {isLoginUser && (
          <div
            className={classes.uploadSec}
            style={{ display: isEditable ? "" : "none" }}
          >
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
              <div
                className={classes.uploadSec}
                style={{ display: isEditable ? "" : "none" }}
              >
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
          {isFansEnabled && (
            <>
              {loginUserData && <FansThumb isLoginUser={isLoginUser} />}

              <div className={classes.actionIcon}>
                <img src={msgIcon} />
                <img src={talkshowIcon} />
              </div>
            </>
          )}
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
    </>
  );
};

export default ProfileLayout;
