import { Button, Col, Form, Input, Row, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PlacesAutocomplete from "react-places-autocomplete";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getProfileService,
  resendOtpService,
  updateProfileService,
} from "../../Services/ApiService";
import {
  ConvertAddresstoLatLng,
  decodeHtml,
  filterValidObject,
  getAuthToken,
  getGeocodeData,
  getValidImageUrl,
  isValidData,
  JSONtoformdata,
} from "../../Shared/Utility";
import DateInputBox from "../../Sharedcomponents/DateInputBox";
import classes from "./Profilverification.module.css";
import * as yup from "yup";
import {
  handleTwoStepVerified,
  handletwostepVerifyModalshow,
} from "../../Store/Redux/Reducer/DashboardReducer";
import { Container } from "react-bootstrap";
import { useAuthData, useAuthToken } from "../../Shared/Reduxfetcher";
import { setLocalStorageData } from "../../Store/Storage";
import { handleLoginData } from "../../Store/Redux/Reducer/AuthReducer";

const validationSchema = yup.object().shape({
  first_name: yup.string().required(`Please input your First Name!`),
  last_name: yup.string().required(`Please input your Last Name!`),
  gender: yup.string().required(`Please input your Gender!`),
  name: yup.string().required(`Please input your Display Name!`),
  dob: yup.string().required(`Please input your Date of Birth!`),
  geo_location: yup.string().required(`Please input your Location!`),
  mobile_no: yup
    .string()
    .min(5, `Please input Valid Mobile Number!`)
    .required(`Please input your Mobile Number!`),
  email_id: yup
    .string()
    .email(`Please input Valid Email Id!`)
    // .matches(EMAIL_REGEX, `Please input Valid Email Id!`)
    .required(`Please input your Email!`),
});

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginUserData = useAuthData();
  const loginToken = useAuthToken();
  const [IsValidCredentials, setIsValidCredentials] = useState({
    email: false,
    mobile: false,
  });
  const [ProfileImage, setProfileImage] = useState("");
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
      dob: "",
      email_id: "",
      mobile_no: "",
      profile_image: "",
      geo_location: "",
      latitude: "",
      longitude: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleupdateProfile(values);
    },
  });

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
            dob: profileData.dob,
            email_id: profileData.email_id,
            mobile_no: profileData.mobile,
            profile_image: profileData.profile_image,
            geo_location: profileData.geo_location || "",
          }));
          const isTwoStepVerified =
            profileData.is_email_id_verified === 1 &&
            profileData.is_mobile_no_verified === 1;
          dispatch(handleTwoStepVerified(isTwoStepVerified));

          if (isNext) {
            HandleprofileUpdate(profileData);
          }

          setIsValidCredentials({
            email: profileData.is_email_id_verified === 1,
            mobile: profileData.is_mobile_no_verified === 1,
          });

          setProfileImage(profileData.profile_image);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

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
      toast.error("Phone Number and Email ID Missing");
    }
  };

  const handleSendOTP = (value) => {
    let finalData = {
      auth_code: getAuthToken("Rawcaster"),
      token: loginUserData?.token,
      otp_flag: value,
    };
    resendOtpService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          navigate("/verifyotp", { state: { type: value, ...res.data } });
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

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
      .catch((err) => {
        toast.error(err.message);
      });
  };

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
      .catch((err) => {
        toast.error(err.message);
      });
  };

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
    }
    updateProfileService(JSONtoformdata(filterValidObject(profileValue)))
      .then((res) => {
        if (res.data.status === 1) {
          toast.success(res.data.msg);
          getProfileInfo(isNext);
        } else {
          toast.error(res.data.msg);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (loginToken) {
      getProfileInfo();
    }
  }, [loginToken]);

  return (
    <Container>
      <Col xs={24} sm={24} md={24} lg={24} xl={16} style={{ margin: "auto" }}>
        <div className={classes.centerLogo}>
          <Link to="/">
            <img src={require("../../Assets/Images/png/rawcater_logo.png")} />
          </Link>
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
                  src={getValidImageUrl(ProfileImage)}
                />
                <input
                  type="file"
                  id="profileImageUploadId"
                  name="profileImageUploadName"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    setProfileImage(e.target.files[0]);
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
          <Row gutter={10}>
            <Col sm={12}>
              <p className={classes.label}>First Name</p>
              <Form.Item name="first_name">
                <Input
                  size="large"
                  className={classes.textBox}
                  placeholder="First Name"
                  maxLength={50}
                  status={
                    touched.first_name && errors.first_name ? "error" : ""
                  }
                  value={values.first_name}
                  onChange={handleChange("first_name")}
                />
                {touched.first_name && (
                  <p className="ErrTxt">{errors?.first_name}</p>
                )}
              </Form.Item>
            </Col>
            <Col sm={12}>
              <p className={classes.label}>Last Name</p>
              <Form.Item name="last_name">
                <Input
                  size="large"
                  className={classes.textBox}
                  placeholder="Last Name"
                  maxLength={50}
                  status={touched.last_name && errors.last_name ? "error" : ""}
                  value={values.last_name}
                  onChange={handleChange("last_name")}
                />
                {touched.last_name && (
                  <p className="ErrTxt">{errors?.last_name}</p>
                )}
              </Form.Item>
            </Col>
            <Col md={12}>
              <p className={classes.label}>Display Name</p>
              <Form.Item name="name">
                <Input
                  size="large"
                  className={classes.textBox}
                  placeholder="Display Name"
                  status={touched.name && errors.name ? "error" : ""}
                  value={values.name}
                  maxLength={40}
                  onChange={handleChange("name")}
                />
                {touched.name && <p className="ErrTxt">{errors?.name}</p>}
              </Form.Item>
            </Col>

            <Col md={12}>
              <p className={classes.label}>Gender</p>
              <Form.Item name="gender" className="genderSelect">
                <Select
                  className={classes.selectBox}
                  placeholder="Select Gender"
                  status={touched.gender && errors.gender ? "error" : ""}
                  value={values.gender}
                  onSelect={(val) => {
                    setFieldValue("gender", val);
                  }}
                >
                  <Select.Option value={1}>Male</Select.Option>
                  <Select.Option value={2}>Female</Select.Option>
                </Select>
                {touched.gender && <p className="ErrTxt">{errors?.gender}</p>}
              </Form.Item>
            </Col>

            <Col md={12}>
              <p className={classes.label}>Date of Birth</p>
              <DateInputBox
                displayDate={values.dob}
                onSelectDate={(date) => {
                  if (date !== "") {
                    setFieldValue("dob", dayjs(date).format("YYYY-MM-DD"));
                  } else {
                    setFieldValue("dob", "");
                  }
                }}
              />
              {touched.dob && <p className="ErrTxt">{errors?.dob}</p>}
            </Col>

            <Col md={12}>
              <p className={classes.label}>Location</p>
              <Form.Item name="geo_location">
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
                        id="geoLocation"
                        size="large"
                        className={`${classes.textBox} ${classes.locationInputHeight}`}
                        maxLength={100}
                        {...getInputProps({
                          style: { paddingRight: "40px" },
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

            <Col md={12}>
              <p className={classes.label}>Mobile Number</p>
              <Form.Item name="mobile">
                <Input
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
            <Col md={12}>
              <p className={classes.label}>Email</p>
              <Form.Item name="email_id">
                <Input
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
                      validateForm()
                        .then((res) => {
                          if (Object.keys(res).length === 0) {
                            handleupdateProfile(values, true);
                          } else {
                            handleSubmit();
                          }
                        })
                        .catch((err) => {
                          console.log(err);
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
