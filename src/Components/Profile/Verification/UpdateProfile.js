import { Button, Col, Form, Input, Row, Select, Tooltip } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PlacesAutocomplete from "react-places-autocomplete";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getProfileService,
  resendOtpService,
  updateProfileService,
} from "../../../Services/ApiService";
import {
  ConvertAddresstoLatLng,
  decodeHtml,
  filterValidObject,
  getAspectRatio,
  getAuthToken,
  getGeocodeData,
  getValidImageUrl,
  isValidData,
  isValidImageFile,
  JSONtoformdata,
} from "../../../Shared/Utility";
import DateInputBox from "../../../Sharedcomponents/DateInputBox";
import classes from "./Profilverification.module.css";
import * as yup from "yup";
import {
  handleTwoStepVerified,
  handletwostepVerifyModalshow,
} from "../../../Store/Redux/Reducer/DashboardReducer";
import { Container } from "react-bootstrap";
import { useAuthData, useAuthToken } from "../../../Shared/Reduxfetcher";
import { setLocalStorageData } from "../../../Store/Storage";
import { handleLoginData } from "../../../Store/Redux/Reducer/AuthReducer";
import moment from "moment";
import { GENDER_TYPE, MOBILE_NUMBER_REGEX } from "../../../Shared/Constant";
import ImageCropModal from "../../../Modal/ImageCropModal";
import { useMainContext } from "../../../Shared/Context";

const UpdateProfile = () => {
  const { IsValidCredentials } = useMainContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const loginUserData = useAuthData();
  const loginToken = useAuthToken();
  const { isAccountVerified } = useMainContext();

  const [ProfileImage, setProfileImage] = useState("");
  const [tempGroupImage, settempGroupImage] = useState(null);

  const validationSchema = yup.object().shape({
    first_name: yup
      .string()
      .trim("The First Name cannot include leading and trailing spaces")
      .strict(true)
      .required(`Please input your First Name!`),
    last_name: yup
      .string()
      .trim("The Last Name cannot include leading and trailing spaces")
      .strict(true)
      .required(`Please input your Last Name!`),
    gender: yup
      .mixed()
      // .trim("The Gender cannot include leading and trailing spaces")
      // .strict(true)
      .required(`Please input your Gender!`),
    name: yup
      .string()
      .trim("The Display Name cannot include leading and trailing spaces")
      .strict(true)
      .required(`Please input your Display Name!`),
    dob: yup.string().required(`Please input your Date of Birth!`),
    geo_location: yup
      .string()
      .trim("The Location cannot include leading and trailing spaces")
      .strict(true)
      .required(`Please input your Location!`),
    mobile_no: yup
      .string()
      .min(5, `Please input Valid Mobile Number!`)
      .matches(MOBILE_NUMBER_REGEX, `Please Enter Valid Mobile Number!`),
    // .required(`Please input your Mobile Number!`),
    email_id: yup.string().email(`Please input Valid Email Id!`),
  });

  const {
    values,
    handleChange,
    setFieldValue,
    setValues,
    touched,
    errors,
    handleSubmit,
    validateForm,
  } = useFormik({
    initialValues: {
      name: "",
      first_name: "",
      last_name: "",
      gender: "",
      other_gender: "",
      dob: "",
      email_id: "",
      mobile_no: "",
      profile_image: "",
      geo_location: "",
      latitude: "",
      longitude: "",
      work_at: "",
      studied_at: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleupdateProfile(values);
    },
  });

  /**
   * Retrieves profile information from the server and updates the state with the retrieved data.
   * @param {boolean} [isNext=false] - Indicates whether the profile update is for the next step.
   * @returns None
   */
  const getProfileInfo = (isNext = false) => {
    let profileData = {
      token: loginToken,
      auth_code: getAuthToken(loginToken),
    };
    getProfileService(JSONtoformdata(profileData))
      .then((res) => {
        if (res.data.status === 1) {
          let profileData = {
            ...res.data.profile,
            first_name: decodeHtml(res.data.profile.first_name),
            last_name: decodeHtml(res.data.profile.last_name),
            name: decodeHtml(res.data.profile.name),
          };
          dispatch(handleLoginData({ token: loginToken, ...profileData }));
          setLocalStorageData(
            "rawcaster_user_token",
            JSON.stringify({ token: loginToken, ...profileData })
          );
          setValues((pre) => ({
            ...pre,
            name: profileData.name,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            gender: profileData.gender,
            dob: profileData.dob ? profileData.dob : "",
            other_gender: profileData.other_gender
              ? profileData.other_gender
              : "",
            email_id: profileData.email_id,
            mobile_no: profileData.mobile,
            profile_image: profileData.profile_image,
            geo_location: profileData.geo_location || "",
            work_at: profileData.work_at,
            studied_at: profileData.studied_at,
          }));
          const isTwoStepVerified =
            profileData.is_email_id_verified === 1 &&
            profileData.is_mobile_no_verified === 1;
          dispatch(handleTwoStepVerified(isTwoStepVerified));

          if (isNext) {
            HandleprofileUpdate(profileData);
          } else if (
            state?.data === "redirectToOtp" &&
            profileData?.is_mobile_no_verified === 0 &&
            profileData?.mobile
          ) {
            handleSendOTP("sms", true);
          } else if (
            state?.data === "redirectToOtp" &&
            profileData?.is_email_id_verified === 0 &&
            profileData?.email_id
          ) {
            handleSendOTP("email", true);
          }

          setProfileImage(profileData.profile_image);
        }
      })
      .catch((err) => {});
  };

  /**
   * Handles the profile update based on the provided value.
   * If two_type_verification is 1 and both email_id and mobile are valid data,
   * it dispatches the handletwostepVerifyModalshow action.
   * If only email_id is valid data, it calls the handleSendOTP function with "email" as the parameter.
   * If only mobile is valid data, it calls the handleSendOTP function with "sms" as the parameter.
   * If both email_id and mobile are missing or not valid data, it displays an error toast message.
   * @param {object} value - The value object containing the profile update data.
   * @returns None
   */
  const HandleprofileUpdate = (value) => {
    if (
      value.two_type_verification === 1 &&
      isValidData(value.email_id) &&
      isValidData(value.mobile)
    ) {
      dispatch(handletwostepVerifyModalshow(true));
    } else if (isValidData(value.email_id)) {
      handleSendOTP("email");
    } else if (isValidData(value.mobile)) {
      handleSendOTP("sms");
    } else {
      toast.remove("rawcaster");
      toast.error("Phone Number and Email ID Missing", { id: "rawcaster" });
    }
  };

  /**
   * Handles the process of sending an OTP (One-Time Password) for verification.
   * @param {string} value - The value of the OTP flag.
   * @param {string} navigateFrom - The path to navigate from.
   * @returns None
   */
  const handleSendOTP = (value, navigateFrom) => {
    let finalData = {
      auth_code: getAuthToken("Rawcaster"),
      token: loginUserData?.token,
      otp_flag: value,
    };
    resendOtpService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
          if (navigateFrom) {
            navigate("/verifyotp", {
              state: { navigatePath: "/setting", type: value, ...res.data },
            });
          } else {
            navigate("/verifyotp", { state: { type: value, ...res.data } });
          }
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.message, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Converts an address to latitude and longitude coordinates using the ConvertAddresstoLatLng function.
   * Updates the geo_location, latitude, and longitude values in the state.
   * @param {string} address - The address to convert to coordinates.
   * @returns None
   */
  const convertAddresstoLatLng = (address) => {
    ConvertAddresstoLatLng(address)
      .then((res) => {
        setValues((pre) => ({
          ...pre,
          geo_location: address,
          latitude: res.lat,
          longitude: res.lng,
        }));
      })
      .catch((err) => {});
  };

  /**
   * Retrieves the current location using geocode data.
   * @returns None
   */
  const getCurrentLocation = () => {
    getGeocodeData()
      .then((res) => {
        setValues((pre) => ({
          ...pre,
          geo_location: res.address,
          latitude: res.location.lat,
          longitude: res.location.lng,
        }));
      })
      .catch((err) => {});
  };

  /**
   * Handles the update of a user's profile information.
   * @param {object} values - The updated profile values.
   * @param {boolean} [isNext=false] - Indicates whether to proceed to the next step after updating the profile.
   * @returns None
   */
  const handleupdateProfile = (values, isNext = false) => {
    let profileValue = {
      ...values,
      token: loginToken,
      auth_code: getAuthToken(loginToken + values.name.trim()),
    };
    if (typeof ProfileImage === "object") {
      profileValue = {
        ...profileValue,
        profile_image: ProfileImage,
      };
    } else if (typeof profileValue.profile_image === "string") {
      delete profileValue.profile_image;
    }
    updateProfileService(JSONtoformdata(filterValidObject(profileValue)))
      .then((res) => {
        if (res.data.status === 1) {
          toast.remove("rawcaster");
          toast.success(res.data.msg, { id: "rawcaster" });
          getProfileInfo(isNext);
        } else {
          toast.remove("rawcaster");
          toast.error(res.data.msg, { id: "rawcaster" });
        }
      })
      .catch((err) => {});
  };

  /**
   * Executes a side effect when the value of `loginToken` changes.
   * If `loginToken` is truthy, it calls the `getProfileInfo` function.
   * @returns None
   */
  useEffect(() => {
    if (loginToken) {
      getProfileInfo();
    }
  }, [loginToken]);

  /**
   * Event handler for when an image is selected.
   * @param {Event} event - The event object containing information about the selected image.
   * @returns None
   */
  const onChangeImage = (event) => {
    if (event.target.files && event.target.files.length !== 0) {
      if (isValidImageFile(event.target.files[0])) {
        settempGroupImage(event.target.files[0]);
      } else {
        toast.remove("rawcaster");
        toast.error("Please Select Valid Image", { id: "rawcaster" });
      }
    }
  };

  return (
    <Container>
      <Col xs={24} sm={24} md={24} lg={24} xl={16} style={{ margin: "auto" }}>
        <div className={classes.centerLogo}>
          <div className={classes.backBtn}>
            <Link
              to={".."}
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
          </div>
          <div className={classes.linkSec}>
            <Link to="/">
              <img
                src={require("../../../Assets/Images/png/rawcater_logo.png")}
                alt="Rawcaster"
              />
            </Link>
          </div>
        </div>
        <div className={classes.updatebg}>
          <Row className="mb-4">
            <Col md={18}>
              <h1 className={classes.heading_h1}>Please update your profile</h1>
              <p className={classes.subText}>
                Please update your profile info to continue on Rawcaster
              </p>
            </Col>

            <Col md={6}>
              <div className={classes.picuploadSec}>
                <img
                  className={classes.profile_img}
                  alt="user_img"
                  src={getValidImageUrl(ProfileImage)}
                />
                <input
                  type="file"
                  id="profileImageUploadId"
                  name="profileImageUploadName"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    // setProfileImage(e.target.files[0]);
                    onChangeImage(e);
                  }}
                  accept=".png,.jpg,.jpeg,"
                ></input>

                <div
                  className={classes.chgavatar}
                  onClick={() => {
                    document.getElementById("profileImageUploadId").click();
                  }}
                >
                  <i className="material-icons">insert_photo</i>
                  Change Avatar
                </div>
              </div>
            </Col>
          </Row>
          {tempGroupImage && (
            <ImageCropModal
              open={tempGroupImage}
              validsize={5}
              src={URL.createObjectURL(tempGroupImage)}
              ratio={getAspectRatio(150, 150)}
              onSuccess={(val) => {
                setProfileImage(val);
                settempGroupImage(null);
              }}
              onFailure={() => {
                settempGroupImage(null);
              }}
            />
          )}
          <Row gutter={10}>
            <Col md={12} xs={24}>
              <p className={classes.label}>First Name</p>
              <Form.Item>
                <Input
                  size="large"
                  name="first_name"
                  className={classes.textBox}
                  placeholder="First Name"
                  maxLength={50}
                  status={
                    touched.first_name && errors.first_name ? "error" : ""
                  }
                  value={values?.first_name ? values?.first_name : ""}
                  onClick={() => {}}
                  disabled={isAccountVerified !== "unverified"}
                  onChange={(e) => {
                    setFieldValue("first_name", e.target.value);
                  }}
                />
                {touched.first_name && (
                  <p className="ErrTxt">{errors?.first_name}</p>
                )}
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <p className={classes.label}>Last Name</p>
              <Form.Item>
                <Input
                  size="large"
                  name="last_name"
                  className={classes.textBox}
                  placeholder="Last Name"
                  maxLength={50}
                  status={touched.last_name && errors.last_name ? "error" : ""}
                  value={values.last_name}
                  disabled={isAccountVerified !== "unverified"}
                  onChange={(e) => {
                    setFieldValue("last_name", e.target.value);
                  }}
                />
                {touched.last_name && (
                  <p className="ErrTxt">{errors?.last_name}</p>
                )}
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <p className={classes.label}>Display Name</p>
              <Form.Item>
                <Input
                  name="name"
                  size="large"
                  className={classes.textBox}
                  placeholder="Display Name"
                  status={touched.name && errors.name ? "error" : ""}
                  value={values.name}
                  maxLength={40}
                  onChange={(e) => {
                    setFieldValue("name", e.target.value);
                  }}
                />
                {touched.name && <p className="ErrTxt">{errors?.name}</p>}
              </Form.Item>
            </Col>

            <Col md={12} xs={24}>
              <p className={classes.label}>Sex</p>
              <Form.Item className="genderSelect">
                <Select
                  name="gender"
                  className={classes.selectBox}
                  placeholder="Select Gender"
                  disabled={isAccountVerified !== "unverified"}
                  status={touched.gender && errors.gender ? "error" : ""}
                  value={values.gender}
                  onSelect={(val) => {
                    setFieldValue("gender", val);
                  }}
                >
                  {GENDER_TYPE.map(({ key, label }) => (
                    <Select.Option value={key}>{label}</Select.Option>
                  ))}
                </Select>
                {touched.gender && <p className="ErrTxt">{errors?.gender}</p>}
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <p className={classes.label}>Gender</p>
              <Form.Item>
                <Input
                  size="large"
                  name="other_gender"
                  className={classes.textBox}
                  // disabled={isAccountVerified !== "unverified"}
                  placeholder="Gender"
                  maxLength={50}
                  status={
                    touched.other_gender && errors.other_gender ? "error" : ""
                  }
                  value={values.other_gender}
                  onChange={(e) => {
                    setFieldValue("other_gender", e.target.value);
                  }}
                />
                {touched.other_gender && (
                  <p className="ErrTxt">{errors?.other_gender}</p>
                )}
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <p className={classes.label}>Date of Birth</p>
              <DateInputBox
                displayDate={values.dob}
                isDisabled={isAccountVerified !== "unverified"}
                onSelectDate={(date) => {
                  if (date !== "") {
                    setFieldValue("dob", moment(date).format("YYYY-MM-DD"));
                  } else {
                    setFieldValue("dob", "");
                  }
                }}
              />
              {touched.dob && <p className="ErrTxt">{errors?.dob}</p>}
            </Col>

            <Col md={12} xs={24}>
              <p className={classes.label}>Location</p>
              <Form.Item>
                <PlacesAutocomplete
                  value={values.geo_location}
                  onChange={handleChange("geo_location")}
                  onSelect={(val) => {
                    convertAddresstoLatLng(val);
                  }}
                  style={{ width: "90%" }}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div style={{ width: "100%", float: "left" }}>
                      <Input
                        name="geo_location"
                        id="geoLocation"
                        size="large"
                        className={`${classes.textBox} ${classes.locationInputHeight}`}
                        maxLength={100}
                        {...getInputProps({
                          placeholder: "Search Places ...",
                          className: "location-search-input",
                        })}
                      />
                      <div className={classes.locationdrpmenu}>
                        {suggestions.map((suggestion) => {
                          const style = suggestion.active
                            ? {
                                backgroundColor: "#fafafa",
                                cursor: "pointer",
                                width: "100%",
                                padding: "5px 10px",
                              }
                            : {
                                backgroundColor: "#ffffff",
                                cursor: "pointer",
                                width: "100%",
                                padding: "5px 10px",
                              };
                          const key = suggestion.placeId;
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                style,
                                key,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                        <div
                          style={{
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            width: "100%",
                            display: suggestions.length > 0 ? "block" : "none",
                            paddingBottom: "10px",
                          }}
                        >
                          {/* <img
                          src={require("../../assets/powered_by_google_on_white_hdpi.png")}
                          style={{ float: "right", height: "20px" }}
                        ></img> */}
                        </div>
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
                <div
                  className={classes.locationIcon}
                  style={{ float: "left", padding: "13px" }}
                >
                  <Tooltip title="get current location">
                    <i
                      className="material-icons"
                      onClick={() => getCurrentLocation()}
                    >
                      location_on
                    </i>
                  </Tooltip>
                </div>
                <div className="clearfix"></div>
                {touched.geo_location && (
                  <p className="ErrTxt">{errors?.geo_location}</p>
                )}
              </Form.Item>
            </Col>
            <Col sm={12} xs={24}>
              <p className={classes.label}>Studied At</p>
              <Form.Item>
                <Input
                  name="studied_at"
                  size="large"
                  className={classes.textBox}
                  placeholder="Studied At"
                  status={
                    touched.studied_at && errors.studied_at ? "error" : ""
                  }
                  value={values.studied_at}
                  maxLength={50}
                  onChange={(e) => {
                    setFieldValue("studied_at", e.target.value);
                  }}
                />
                {touched.studied_at && (
                  <p className="ErrTxt">{errors?.studied_at}</p>
                )}
              </Form.Item>
            </Col>
            <Col sm={12} xs={24}>
              <p className={classes.label}>Work At</p>
              <Form.Item>
                <Input
                  name="work_at"
                  size="large"
                  className={classes.textBox}
                  placeholder="Work At"
                  status={touched.work_at && errors.work_at ? "error" : ""}
                  value={values.work_at}
                  maxLength={50}
                  onChange={(e) => {
                    setFieldValue("work_at", e.target.value);
                  }}
                />
                {touched.work_at && <p className="ErrTxt">{errors?.work_at}</p>}
              </Form.Item>
            </Col>

            <Col sm={12} xs={24}>
              <p className={classes.label}>Mobile Number</p>
              <Form.Item>
                <Input
                  name="mobile_no"
                  maxLength={15}
                  className={`${classes.textBox}`}
                  placeholder="Mobile Number"
                  status={touched.mobile_no && errors.mobile_no ? "error" : ""}
                  value={values.mobile_no}
                  disabled={IsValidCredentials.mobile}
                  onChange={handleChange("mobile_no")}
                />
                {touched.mobile_no && (
                  <p className="ErrTxt">{errors?.mobile_no}</p>
                )}
              </Form.Item>
            </Col>
            <Col sm={12} xs={24}>
              <p className={classes.label}>Email</p>
              <Form.Item>
                <Input
                  name="email_id"
                  size="large"
                  className={classes.textBox}
                  placeholder="Email"
                  maxLength={50}
                  disabled={IsValidCredentials.email}
                  status={touched.email_id && errors.email_id ? "error" : ""}
                  value={values.email_id}
                  onChange={handleChange("email_id")}
                />
                {touched.email_id && (
                  <p className="ErrTxt">{errors?.email_id}</p>
                )}
              </Form.Item>
            </Col>

            <Col className="w100" md={24}>
              <Form.Item>
                <Button
                  block
                  htmlType="submit"
                  className={classes.updateBtn}
                  onClick={() => handleSubmit()}
                >
                  Update Info
                </Button>

                {loginUserData?.acc_verify_status === 0 && (
                  <Button
                    block
                    onClick={() => {
                      validateForm().then((res) => {
                        if (Object.keys(res).length === 0) {
                          handleupdateProfile(values, true);
                        } else {
                          handleSubmit();
                        }
                      });

                      //
                    }}
                    className={classes.nextBtn}
                  >
                    Next
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Col>
    </Container>
  );
};

export default UpdateProfile;
