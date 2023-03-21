import React, { useRef, useState } from "react";
import classes from "./Profile.module.css";
import { useAuthData } from "../../Shared/Reduxfetcher";
import ImageCropModal from "../../Modal/ImageCropModal";
import msgIcon from "../../Assets/Images/svg/msgIcon.svg";
import talkshowIcon from "../../Assets/Images/svg/talkshowIcon.svg";
import Nuggets from "../../Sharedcomponents/Nuggets/Nuggets";
import { Link } from "react-router-dom";
import { ReadMore } from "../../Shared/Utility";
import Events from "./Components/Events";
import UnclaimedInfluencers from "./Components/UnclaimedInfluencers";
import Influencers from "./Components/Influencers";
import Fans from "./Components/Fans";

const Profile = () => {
  const coverRef = useRef();
  const profileRef = useRef();
  const loginUserData = useAuthData();
  const [isLinkopenModal, setisLinkopenModal] = useState(false);
  const [profileImg, setprofileImg] = useState({
    src: "",
    ratio: "",
  });
  return (
    <div>
      <div className={`mainWrapper ${classes.profilePage}`}>
        <div className={classes.bannersec}>
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
            <div className={classes.profileSec}>
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

            <div className={classes.fansList}>
              <img
                className={classes.thumbImg}
                src={require("../../Assets/Images/png/pro_img.png")}
              />
              <img
                className={classes.thumbImg}
                src={require("../../Assets/Images/png/pro_img.png")}
              />
              <img
                className={classes.thumbImg}
                src={require("../../Assets/Images/png/pro_img.png")}
              />
              <img
                className={classes.thumbImg}
                src={require("../../Assets/Images/png/pro_img.png")}
              />
              <img
                className={classes.thumbImg}
                src={require("../../Assets/Images/png/pro_img.png")}
              />
              <img
                className={classes.thumbImg}
                src={require("../../Assets/Images/png/pro_img.png")}
              />
              <img
                className={classes.thumbImg}
                src={require("../../Assets/Images/png/pro_img.png")}
              />
              <div className={classes.count}>400+</div>
            </div>

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

        <div className={classes.fullcontainer}>
          <div className={classes.profileevent}>
            <div className={classes.profileIntro}>
              <h2>
                About Danii <span>Entertainer</span>
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
