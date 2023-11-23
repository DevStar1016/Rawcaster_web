/**
 * A component that allows users to post nuggets, which can include text, images, videos, and polls.
 * @param {boolean} isUserPostAvailable - Indicates whether the user is allowed to post nuggets.
 * @returns The PostNuggets component.
 */
import React, { useEffect, useRef, useState } from "react";
import classes from "./PostNuggets.module.css";
import cameraIcon from "../../Assets/Images/svg/camera.svg";
import imageIcon from "../../Assets/Images/svg/picture.svg";
import pollIcon from "../../Assets/Images/svg/pollIcon.svg";
import { Input, message } from "antd";
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
import {
  PostNuggetContext,
  useGlobalContext,
  useListNuggetContext,
} from "../../Shared/Context";
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
import { isArray } from "lodash";

const PostNuggets = ({ isUserPostAvailable }) => {
  const { postModalShow, setpostModalShow, PostContent, setPostContent } =
    useGlobalContext() ?? {};
  const { GetNuggetList, setisNuggetModify } = useListNuggetContext();
  const dispatch = useDispatch();
  const Token = useAuthToken();
  const params = useParams();
  const ImageRef = useRef();
  const VideoRef = useRef();
  const [messageApi] = message.useMessage();
  const [NuggetData, setNuggetData] = useState([]);
  const [PollData, setPollData] = useState();
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

  /**
   * Retrieves the length of the nugget text from the LoginUserData object.
   * If the LoginUserData object is not available, returns 0.
   * @returns The length of the nugget text or 0 if LoginUserData is not available.
   */
  const getNuggetTextLength = () => {
    if (LoginUserData) {
      return LoginUserData?.nugget_content_length;
    } else {
      return 0;
    }
  };

  /**
   * useEffect hook that updates the "content" field value in the form whenever the "PostContent" prop changes.
   * It slices the "PostContent" string to the length specified by the "getNuggetTextLength()" function and sets the sliced value as the new field value.
   * @param {function} setFieldValue - The function to update the value of a form field.
   * @param {string} PostContent - The content of the post.
   * @param {function} getNuggetTextLength - The function that returns the desired length of the sliced text.
   * @returns None
   */
  useEffect(() => {
    if (PostContent) {
      setFieldValue("content", PostContent.slice(0, getNuggetTextLength()));
    }
  }, [PostContent]);

  /**
   * Edits a nugget with the given value.
   * @param {object} val - The value to edit the nugget with.
   * @returns None
   */
  const EditNugget = (val) => {
    if (
      NuggetData.length === 0 &&
      !isValidData(val.content) &&
      previewMedia?.length === 0
    ) {
      toast.remove("rawcaster");
      toast.error("Sorry! Nuggets content or Media can not be empty.", {
        id: "rawcaster",
      });
      return;
    }
    setpostModalShow(false);
    setisNuggetModify({ type: "edit", id: isEdit });
    let formData = new FormData();
    formData.append("token", LoginUserData?.token);
    formData.append("share_type", val.share_type);
    formData.append("nugget_id", isEdit);
    if (val.content !== "") {
      formData.append("content", val.content);
    }
    if (MetaData) {
      formData.append("metadata", JSON.stringify(MetaData));
    }
    if (deletedMedia.length !== 0) {
      formData.append("delete_media_id", JSON.stringify(deletedMedia));
    }
    if (NuggetData.length !== 0) {
      for (const file of NuggetData) {
        formData.append("nuggets_media", file);
      }
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
    editNuggetService(formData)
      .then((res) => {
        if (res.data.status === 1) {
          resetForm();

          GetNuggetList();
          setNuggetData([]);
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {})
      .finally(() => {
        resetForm();

        setNuggetData([]);
        setPostContent("");
        setdeletedMedia([]);
        setpreviewMedia([]);
        setisEdit();
        setMetaData(null);
        setisNuggetModify({ type: "", id: null });
      });
  };

  /**
   * Uploads a nugget with the given data.
   * @param {object} val - The data of the nugget to be uploaded.
   * @returns None
   */
  const uploadNugget = (val) => {
    if (NuggetData.length === 0 && !isValidData(val.content) && !PollData) {
      toast.remove("rawcaster");
      toast.error("Sorry! Nuggets content or Media can not be empty.", {
        id: "rawcaster",
      });
      return;
    }
    setpostModalShow(false);
    let formData = new FormData();
    formData.append("token", LoginUserData?.token);
    formData.append("share_type", val.share_type);
    if (!PollData) {
      for (const file of NuggetData) {
        formData.append("nuggets_media", file);
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
      if (val.content !== "") {
        formData.append("content", val.content);
      }
    }
    if (MetaData) {
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
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {})
      .finally(() => {
        resetForm();
        setisNuggetModify({ type: "", id: null });
        setNuggetData([]);
        setPostContent("");
        setProgress((pre) => ({ ...pre, show: false }));
        dispatch(handleLoading(false));
        setMetaData(null);
      });
  };

  const PostNuggetValues = {
    setFileValues(value, index) {
      if (isEdit) {
        // let getmediaids = previewMedia.map((ele) => ele.media_id);
        // setdeletedMedia(getmediaids);
        setpreviewMedia([]);
        setNuggetData([...value]);
      } else if (index !== undefined) {
        let tempData = [...NuggetData];
        tempData[index] = value;
        setNuggetData(tempData);
      } else if (NuggetData === 0) {
        setNuggetData([...value]);
      } else {
        if (isArray(value)) {
          setNuggetData((pre) => [...pre, ...value]);
        } else {
          setNuggetData((pre) => [...pre, value]);
        }
      }
      setpostModalShow(true);
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

  /**
   * Retrieves the details of a nugget from the server.
   * @returns None
   */
  const getNuggetDetail = () => {
    let nuggetDetailData = {
      token: Token,
      nugget_id: isEdit,
    };
    getNuggetDetailService(JSONtoformdata(nuggetDetailData))
      .then((res) => {
        if (res.data.status === 1) {
          setValues({
            content: decodeHtml(res.data.nugget_detail.content),
            share_type: res.data.nugget_detail.share_type,
          });
          if (res.data.nugget_detail.metadata) {
            setMetaData(JSON.parse(res.data.nugget_detail.metadata));
          }
          if (
            res.data.nugget_detail.share_type === 3 ||
            res.data.nugget_detail.share_type === 4
          ) {
            const getShareWithData = res.data.nugget_detail.shared_detail.map(
              (ele) => ele.id
            );
            setshareWithData(getShareWithData);
          }
          setpostModalShow(true);
          setpreviewMedia(res.data.nugget_detail.media_list);
        }
      })
      .catch((err) => {});
  };

  /**
   * Executes a side effect when the `isEdit` state changes.
   * If `isEdit` is true, it calls the `getNuggetDetail` function.
   * @returns None
   */
  useEffect(() => {
    if (isEdit) {
      getNuggetDetail();
    }
  }, [isEdit]);

  return (
    <PostNuggetContext.Provider value={PostNuggetValues}>
      {isUserPostAvailable && (
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
                  multiple
                  id="nugget_video"
                  accept="video/mp4"
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length !== 0) {
                      const filterValidFiles = [
                        ...Array.from(e.target.files),
                      ].filter((fileInfo) =>
                        ["audio", "video", "image"].includes(
                          fileInfo.type.split("/")[0]
                        )
                      );
                      if (filterValidFiles.length !== 0) {
                        PostNuggetValues.setFileValues(filterValidFiles);
                      } else {
                        messageApi.open({
                          type: "warning",
                          content: "Please Select Valid File",
                        });
                      }
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
                  multiple
                  id="nugget_image"
                  accept="image/png, image/gif, image/jpeg"
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length !== 0) {
                      const filterValidFiles = [
                        ...Array.from(e.target.files),
                      ].filter((fileInfo) =>
                        ["audio", "video", "image"].includes(
                          fileInfo.type.split("/")[0]
                        )
                      );
                      if (filterValidFiles.length !== 0) {
                        PostNuggetValues.setFileValues(filterValidFiles);
                      } else {
                        messageApi.open({
                          type: "warning",
                          content: "Please Select Valid File",
                        });
                      }
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
      )}

      <Postmodal
        visible={postModalShow}
        onClose={() => {
          setPostContent("");
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
