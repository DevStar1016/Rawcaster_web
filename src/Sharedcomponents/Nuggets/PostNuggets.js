import React, { useState } from "react";
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
import { PostNuggetContext } from "../../Shared/Context";
import { useFormik } from "formik";
import { isAccountValid } from "../../Shared/Utility";

const PostNuggets = ({ getNuggetList }) => {
  const dispatch = useDispatch();
  const [NuggetData, setNuggetData] = useState([]);
  const [postModalShow, setpostModalShow] = useState(false);

  const [isCamera, setisCamera] = useState({ show: false, type: "" });
  const LoginUserData = useAuthData();

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
    dispatch(handleLoading(true));
    let formData = new FormData();
    formData.append("token", LoginUserData?.token);
    formData.append("share_type", val.share_type);
    formData.append("content", val.content);
    for (const file of NuggetData) {
      console.log(URL.createObjectURL(file));
      formData.append("nuggets_media[]", file);
    }

    addNuggetsService(formData)
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
    values: values,
  };

  return (
    <PostNuggetContext.Provider value={PostNuggetValues}>
      <div className={classes.postNuggets}>
        <div className={classes.searchUser}>
          <img
            src={LoginUserData?.profile_image}
            className={classes.profileImg}
          />
          <Input
            placeholder={`hey ${LoginUserData?.name}, share some nuggets...`}
            className={classes.searchbar}
            onClick={() => {
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
          />
          <div className={classes.iconSec}>
            <div
              className={classes.item}
              onClick={() => {
                if (isAccountValid()) {
                  document.getElementById("nugget_video").click();
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
              <img src={cameraIcon} />
              Video
              <input
                type="file"
                name="file"
                id="nugget_video"
                accept="video/mp4"
                onChange={(e) => {
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
                  document.getElementById("nugget_image").click();
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
              <img src={imageIcon} /> Image
              <input
                type="file"
                name="file"
                id="nugget_image"
                accept="image/png, image/gif, image/jpeg"
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
              <img src={pollIcon} /> Poll
            </div>
          </div>
        </div>
      </div>
      <CameraModal
        visible={isCamera.show}
        type={isCamera.type}
        onSuccess={(value) => {
          PostNuggetValues.setFileValues(value);

          setisCamera({ show: false, type: "" });
          setpostModalShow(true);
        }}
        onClose={() => {
          setisCamera({ show: false, type: "" });
        }}
      />

      <Postmodal
        visible={postModalShow}
        onClose={() => {
          setpostModalShow(false);
        }}
      />
    </PostNuggetContext.Provider>
  );
};

export default PostNuggets;
