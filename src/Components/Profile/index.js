import React, { useRef, useState } from "react";
import classes from "./Profile.module.css";
import { useAuthData } from "../../Shared/Reduxfetcher";
import ImageCropModal from "../../Modal/ImageCropModal";

const Profile = () => {
  const coverRef = useRef();
  const profileRef = useRef();
  const loginUserData = useAuthData();
  const [profileImg, setprofileImg] = useState({
    src: "",
    ratio: "",
  });
  return (
    <div>
      <div className={classes.mainContainer}>
        <div className={classes.bannerContainer}>
          <img src={loginUserData?.cover_image} />
          <div className={classes.uploadSec}>
            <span
              class="material-symbols-outlined"
              onClick={() => {
                coverRef?.current.click();
              }}
            >
              photo_camera
            </span>
          </div>
        </div>
        {loginUserData && (
          <div className={classes.profileContainer}>
            <img src={loginUserData?.profile_image} />
            <div className={classes.uploadSec}>
              <span
                class="material-symbols-outlined"
                onClick={() => {
                  profileRef?.current.click();
                }}
              >
                photo_camera
              </span>
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
            console.log(e.target.files[0]);
            if (e.target.files && e.target.files.length !== 0) {
              setprofileImg({
                src: e.target.files[0],
                ratio: 16 / 9,
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
                src: e.target.files[0],
                ratio: 4 / 3,
              });
            }
          }}
          style={{ display: "none" }}
        />
      </div>
      {profileImg.src !== "" && (
        <ImageCropModal
          open={profileImg.src !== ""}
          src={URL.createObjectURL(profileImg.src)}
          ratio={profileImg.ratio}
          onSuccess={(val) => {
            console.log(val);
          }}
          onFailure={() => {
            setprofileImg({
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
