import React, { useEffect, useRef, useState } from "react";
import classes from "./PostNuggets.module.css";
import cameraIcon from "../../Assets/Images/svg/camera.svg";
import imageIcon from "../../Assets/Images/svg/picture.svg";
import pollIcon from "../../Assets/Images/svg/pollIcon.svg";
import { Input } from "antd";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import {
  addNuggetsService,
  editNuggetService,
  getNuggetDetailService,
} from "../../Services/ApiService";
import { toast } from "react-hot-toast";
import {
  handleLoading,
  handleprofileVerifyModalShow,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { useDispatch } from "react-redux";
import { PostNuggetContext, useListNuggetContext } from "../../Shared/Context";
import { useFormik } from "formik";
import {
  decodeHtml,
  isAccountValid,
  isValidData,
  JSONtoformdata,
} from "../../Shared/Utility";
import Postmodal from "../../Modal/Nugget/Postmodal";
import { useParams } from "react-router";
import profileImg from "../../Assets/Images/svg/userImg.svg";

const PostNuggets = () => {
  const { GetNuggetList, setisNuggetModify } = useListNuggetContext();
  const dispatch = useDispatch();
  const Token = useAuthToken();
  const params = useParams();
  const ImageRef = useRef();
  const VideoRef = useRef();
  const [NuggetData, setNuggetData] = useState([]);
  const [PollData, setPollData] = useState();
  const [postModalShow, setpostModalShow] = useState(false);
  const [previewMedia, setpreviewMedia] = useState([]);
  const [deletedMedia, setdeletedMedia] = useState([]);
  const [isPoll, setisPoll] = useState(false);
  const LoginUserData = useAuthData();
  const [MetaData, setMetaData] = useState();
  const [shareWithData, setshareWithData] = useState([]);
  const { handleProgress, setProgress, isEdit, setisEdit } =
    useListNuggetContext();

  const {
    values,
    setFieldValue,
    handleSubmit,
    handleChange,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      content: "",
      share_type: 1,
    },
    onSubmit: (val) => {
      if (isEdit) {
        EditNugget(val);
      } else {
        uploadNugget(val);
      }
    },
  });

  const EditNugget = (val) => {
    setpostModalShow(false);

    let formData = new FormData();
    formData.append("token", LoginUserData?.token);
    formData.append("share_type", val.share_type);
    formData.append("nugget_id", isEdit);
    formData.append("content", val.content);
    if (deletedMedia.length !== 0) {
      formData.append("delete_media_id", JSON.stringify(deletedMedia));
    }
    if (NuggetData.length !== 0) {
      for (const file of NuggetData) {
        formData.append("nuggets_media[]", file);
      }
    }
    if (parseInt(val.share_type) === 3 || parseInt(val.share_type) === 4) {
      if (shareWithData) {
        const getShareTypeData = () => {
          if (parseInt(val.share_type) === 3) {
            return { groups: shareWithData };
          } else if (parseInt(val.share_type) === 4) {
            return { friends: shareWithData };
          }
        };
        formData.append("share_with", getShareTypeData());
      }
    }
    editNuggetService(formData)
      .then((res) => {
        if (res.data.status === 1) {
          resetForm();
          setisNuggetModify({ type: "edit", id: isEdit });
          GetNuggetList();
          setNuggetData([]);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setdeletedMedia([]);
        setpreviewMedia([]);
        setisEdit();
      });
  };

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
    if (MetaData && NuggetData.length === 0) {
      formData.append("metadata", JSON.stringify(MetaData));
    }
    if (parseInt(val.share_type) === 3 || parseInt(val.share_type) === 4) {
      if (shareWithData) {
        const getShareTypeData = () => {
          if (parseInt(val.share_type) === 3) {
            return JSON.stringify({ groups: shareWithData });
          } else if (parseInt(val.share_type) === 4) {
            return JSON.stringify({ friends: shareWithData });
          }
        };
        formData.append("share_with", getShareTypeData());
      }
    }
    addNuggetsService(formData, handleProgress)
      .then((res) => {
        if (res.data.status === 1) {
          resetForm();
          setisNuggetModify({ type: "add", id: null });
          GetNuggetList();
          setNuggetData([]);
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
    setFileValues(value, index) {
      if (index !== undefined) {
        let tempData = [...NuggetData];
        tempData[index] = value;
        setNuggetData(tempData);
      } else if (NuggetData === 0) {
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
    useAuthData,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    setPollData,
    NuggetData,
    values,
    setisPoll,
    isPoll,
    setMetaData,
    MetaData,
    shareWithData,
    setshareWithData,
    previewMedia,
    setpreviewMedia,
    deletedMedia,
    setdeletedMedia,
  };

  const getNuggetDetail = () => {
    let nuggetDetailData = {
      token: Token,
      nugget_id: isEdit,
    };
    getNuggetDetailService(JSONtoformdata(nuggetDetailData))
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 1) {
          setValues({
            content: decodeHtml(res.data.nugget_detail.content),
            share_type: res.data.nugget_detail.share_type,
          });
          setpostModalShow(true);
          setpreviewMedia(res.data.nugget_detail.media_list);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (isEdit) {
      getNuggetDetail();
    }
  }, [isEdit]);

  return (
    <PostNuggetContext.Provider value={PostNuggetValues}>
      <div
        className={classes.postNuggets}
        style={{ display: params.key ? "none" : "block" }}
      >
        <div className={classes.searchUser}>
          <div className="d-flex flex-row">
            <img
              src={LoginUserData?.profile_image || profileImg}
              className={classes.profileImg}
              alt="Post_profileimg"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = profileImg;
              }}
            />
            <div
              className="w-100"
              onClick={() => {
                if (isAccountValid(LoginUserData)) {
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
                if (isAccountValid(LoginUserData)) {
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
                if (isAccountValid(LoginUserData)) {
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
            <div
              className={classes.item}
              onClick={() => {
                setisPoll(true);
                setpostModalShow(true);
              }}
            >
              <img src={pollIcon} alt="poll_icon" /> Poll
            </div>
          </div>
        </div>
      </div>

      <Postmodal
        visible={postModalShow}
        onClose={() => {
          resetForm();
          setNuggetData([]);
          setpreviewMedia([]);
          setdeletedMedia([]);
          setisPoll(false);
          setpostModalShow(false);
          setisEdit(null);
        }}
      />
    </PostNuggetContext.Provider>
  );
};

export default PostNuggets;
