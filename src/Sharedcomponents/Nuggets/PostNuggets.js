import React, { useRef, useState } from "react";
import Postmodal from "../../Modal/Postmodal";
import classes from "./PostNuggets.module.css";
import cameraIcon from "../../Assets/Images/svg/camera.svg";
import imageIcon from "../../Assets/Images/svg/picture.svg";
import pollIcon from "../../Assets/Images/svg/thumb.svg";
import { Input } from "antd";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { addNuggetsService } from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import {
  handleLoading,
  handleprofileVerifyModalShow,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { useDispatch } from "react-redux";
import CameraModal from "../../Modal/CameraModal";
import { PostNuggetContext, useListNuggetContext } from "../../Shared/Context";
import { useFormik } from "formik";
import { isAccountValid, isValidData } from "../../Shared/Utility";

const PostNuggets = ({ getNuggetList }) => {
  const dispatch = useDispatch();
  const ImageRef = useRef();
  const VideoRef = useRef();
  const [NuggetData, setNuggetData] = useState([]);
  const [PollData, setPollData] = useState();
  const [postModalShow, setpostModalShow] = useState(false);
  const [isPoll, setisPoll] = useState(false);
  const [isCamera, setisCamera] = useState({ show: false, type: "" });
  const LoginUserData = useAuthData();

  const { handleProgress, setProgress } = useListNuggetContext();

  const { values, setFieldValue, handleSubmit, handleChange, resetForm } =
    useFormik({
      initialValues: {
        content: "",
        share_type: 1,
      },
      onSubmit: (val) => {
        uploadNugget(val);
      },
    });

  const uploadNugget = (val) => {
    if (NuggetData.length === 0 && !isValidData(val.content) && !PollData) {
      toast.error("Sorry! Nuggets content or Media can not be empty.");
      return;
    }
    setpostModalShow(false);
    let formData = new FormData();
    formData.append("token", LoginUserData?.token);
    formData.append("share_type", val.share_type);
    if (!PollData) {
      for (const file of NuggetData) {
        console.log(URL.createObjectURL(file));
        formData.append("nuggets_media[]", file);
      }
    }

    if (PollData) {
      if (isPoll) {
        let ChoiceArray = PollData.poll_option.map((ele) => ele.choiceData);
        formData.append("poll_option", JSON.stringify(ChoiceArray));
        formData.append("poll_duration", PollData.duration);
        formData.append("content", PollData.content);
      } else {
        setPollData([]);
      }
    } else {
      formData.append("content", val.content);
    }
    addNuggetsService(formData, handleProgress)
      .then((res) => {
        if (res.data.status === 1) {
          resetForm();
          setNuggetData([]);
          getNuggetList();
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setProgress((pre) => ({ ...pre, show: false }));
        dispatch(handleLoading(false));
      });
  };

  const PostNuggetValues = {
    setFileValues(value) {
      if (NuggetData === 0) {
        setNuggetData([value]);
      } else {
        setNuggetData((pre) => [...pre, value]);
      }
    },
    getPostValues() {
      return NuggetData;
    },
    setNuggetValues(value) {
      return setNuggetData(value);
    },
    useAuthData: useAuthData,
    handleChange: handleChange,
    handleSubmit: handleSubmit,
    setFieldValue: setFieldValue,
    resetForm: resetForm,
    setPollData: setPollData,
    NuggetData: NuggetData,
    values: values,
    setisPoll: setisPoll,
    isPoll: isPoll,
  };

  return (
    <PostNuggetContext.Provider value={PostNuggetValues}>
      <div className={classes.postNuggets}>
        <div className={classes.searchUser}>
          <div className="d-flex flex-row ">
            <img
              src={LoginUserData?.profile_image}
              className={classes.profileImg}
              alt="Post_profileimg"
            />
            <div
              className="w-100"
              onClick={() => {
                console.log("Click");
                if (isAccountValid()) {
                  setpostModalShow(true);
                } else {
                  dispatch(
                    handleprofileVerifyModalShow({
                      show: true,
                      msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
                    })
                  );
                }
              }}
            >
              <Input
                placeholder={`hey ${LoginUserData?.name}, share some nuggets...`}
                className={classes.searchbar}
                readOnly={true}
              />
            </div>
          </div>
          <div className={classes.iconSec}>
            <div
              className={classes.item}
              onClick={() => {
                if (isAccountValid()) {
                  if (VideoRef.current) {
                    VideoRef.current.click();
                  }
                } else {
                  dispatch(
                    handleprofileVerifyModalShow({
                      show: true,
                      msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
                    })
                  );
                }
              }}
            >
              <img src={cameraIcon} alt="camera_icon" />
              Video
              <input
                ref={VideoRef}
                type="file"
                name="file"
                id="nugget_video"
                accept="video/mp4"
                onClick={(event) => {
                  event.target.value = null;
                }}
                onChange={(e) => {
                  console.log(e.target.files);
                  if (e.target.files && e.target.files.length !== 0) {
                    PostNuggetValues.setFileValues(e.target.files[0]);
                    setpostModalShow(true);
                  }
                }}
                style={{ display: "none" }}
              />
            </div>
            <div
              className={classes.item}
              onClick={() => {
                if (isAccountValid()) {
                  if (ImageRef.current) {
                    ImageRef.current.click();
                  }
                } else {
                  dispatch(
                    handleprofileVerifyModalShow({
                      show: true,
                      msg: "You need to complete your account validation before you can do this. Do you want to validate it now?",
                    })
                  );
                }
              }}
            >
              <img src={imageIcon} alt="Image_icon" /> Image
              <input
                ref={ImageRef}
                type="file"
                name="file"
                id="nugget_image"
                accept="image/png, image/gif, image/jpeg"
                onClick={(event) => {
                  event.target.value = null;
                }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length !== 0) {
                    PostNuggetValues.setFileValues(e.target.files[0]);
                    setpostModalShow(true);
                  }
                }}
                style={{ display: "none" }}
              />
            </div>
            <div className={classes.item}>
              <img src={pollIcon} alt="poll_icon" /> Poll
            </div>
          </div>
        </div>
      </div>
      <CameraModal
        visible={isCamera.show}
        type={isCamera.type}
        onSuccess={(value) => {
          PostNuggetValues.setFileValues(value);
          setpostModalShow(true);
        }}
        onClose={() => {
          setisCamera({ show: false, type: "" });
        }}
      />

      <Postmodal
        visible={postModalShow}
        onClose={() => {
          resetForm();
          setNuggetData([]);
          setpostModalShow(false);
        }}
      />
    </PostNuggetContext.Provider>
  );
};

export default PostNuggets;
