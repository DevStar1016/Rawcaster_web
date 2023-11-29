/**
 * A React functional component that renders a form for claiming or verifying an account.
 * @returns The JSX element representing the claim account form.
 */
import React, { useEffect } from "react";
import classes from "./Profile.module.css";
import {
  DecryptionString,
  JSONtoformdata,
  decodeHtml,
  filterValidObject,
  getGeocodeData,
} from "../../Shared/Utility";
import { useNavigate, useParams } from "react-router";
import ProfileLayout from "./ProfileLayout";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  AccountVerifyService,
  AddClaimAccountService,
} from "../../Services/ApiService";
import { Col, Row } from "react-bootstrap";
import DateInputBox from "../../Sharedcomponents/DateInputBox";
import moment from "moment";
import PlacesAutocomplete from "react-places-autocomplete";
import { useDispatch } from "react-redux";
import Seo from "../SEO/Seo";
import { ClaimorVerifySEO } from "../SEO/SEOContent";
import { HandleVerifyModal, ShowLinkOpenModal } from "../../Modal/DefaultModal";
import { useMainContext } from "../../Shared/Context";
import { handleClaimAccount } from "../../Store/Redux/Reducer/DashboardReducer";
import { NAME_REGEX } from "../../Shared/Constant";
import CountryCodeDropdown from "../../UIComponents/CountryCodeDropdown";

const validationSchema = yup.object().shape({
  first_name: yup
    .string()
    .matches(NAME_REGEX, "Please input valid First Name")
    .required(`Please input your First Name!`),
  last_name: yup
    .string()
    .matches(NAME_REGEX, "Please input valid Last Name")
    .required(`Please input your Last Name!`),
  country_id: yup.string(),
  telephone: yup
    .string()
    .min(5, "Mobile number must be atleast 5 characters")
    .test("validate Number", "Enter valid Number", function (value, ctx) {
      const { country_id } = this.parent;
      if (value && !country_id) {
        return ctx.createError({ message: "Country code is Required" });
      }
      return true;
    })
    .required(`Please input your mobile number!`),
  dob: yup.string().required(`Please input your Date of Birth!`),
  email_id: yup
    .string()
    .email("Please enter a valid Email id!")
    .required(`Please input your Email id!`),
  location: yup.string().required(`Please input your Location!`),
});

const Claimaccount = () => {
  const navigate = useNavigate();
  const { isAccountVerified, IsValidCredentials } = useMainContext();
  const dispatch = useDispatch();
  const params = useParams();
  const display_user_id = params?.user_id
    ? DecryptionString(params.user_id)
    : null;

  const loginUserData = useAuthData();

  const {
    values,
    setFieldValue,
    handleChange,
    handleSubmit,
    setValues,
    touched,
    errors,
  } = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      telephone: "",
      dob: "",
      country_code: "",
      country_id: "",
      email_id: "",
      location: "",
    },
    validationSchema,
    onSubmit: (val) => {
      if (display_user_id && loginUserData?.account_verify_type === 0) {
        HandleVerifyModal({
          primary: "success",
          message:
            "Your profile should be a verified profile to claim an influencer profile",
          SubmitButtonTitle: "Verify Account",
          onSuccess: () => {
            if (loginUserData.user_status_id >= 3) {
              navigate("/verifyaccount");
            } else {
              navigate(-1);
            }
          },
          isCloseAvailable: false,
        });
      } else if (display_user_id && loginUserData?.account_verify_type === 1) {
        HandleVerifyModal({
          primary: "success",
          message:
            "Your profile verification status is pending, you can claim an influencer profile only when verification status is success",
          SubmitButtonTitle: "Back to Profile",
          onSuccess: () => {
            navigate(-1);
          },
          isCloseAvailable: false,
        });
      } else if (!display_user_id) {
        ShowLinkOpenModal({
          message:
            "You are being redirected to our partner website for your ID verification..",
          onSuccess: () => {
            HandleClaimAccount(val);
          },
        });
      } else {
        HandleClaimAccount(val);
      }
    },
  });

  /**
   * Verifies the type of value and calls the appropriate service function based on the
   * value of display_user_id.
   * @param {any} value - The value to be verified.
   * @returns The result of calling the appropriate service function.
   */
  const VerifyType = (value) => {
    if (display_user_id) {
      return AddClaimAccountService(value);
    } else {
      return AccountVerifyService(value);
    }
  };

  const getisLoginuserId = () => {
    return parseInt(DecryptionString(params.user_id)) === loginUserData.user_id;
  };

  /**
   * Handles the claim account functionality by sending a request to the server with the provided value.
   * @param {any} value - The value to be sent to the server for claiming the account.
   * @returns None
   */
  const HandleClaimAccount = (value) => {
    let finalData = {
      ...value,
      influencer_id: display_user_id ? parseInt(display_user_id) : null,
      token: loginUserData?.token,
    };
    VerifyType(JSONtoformdata(filterValidObject(finalData)))
      .then((res) => {
        if (res.data.status === 1) {
          // dispatch(handleAccountVerifyStatus(1));
          if (!display_user_id) {
            window.open(res.data.redirect_url, "_self");
            // navigate(`/documentverify`, {
            //   state: {
            //     url: res.data.redirect_url,
            //   },
            // });
          } else {
            dispatch(
              handleClaimAccount({
                show: true,
                msg: res.data.msg,
              })
            );
            navigate(-1);
          }
        } else if (res.data.status === 0) {
          Modal.error({
            content: res.data.msg,
          });
        }
      })
      .catch((err) => {});
  };

  /**
   * Retrieves the current location using geocode data and sets the value of the "location" field.
   * @returns None
   */
  const getCurrentLocation = () => {
    getGeocodeData()
      .then((res) => {
        setFieldValue("location", res.address);
      })
      .catch((err) => {});
  };

  /**
   * useEffect hook that updates the form values with the login user data when it changes.
   * @param {Object} loginUserData - The login user data object.
   * @returns None
   */
  useEffect(() => {
    if (loginUserData) {
      setValues({
        first_name: loginUserData?.first_name,
        last_name: loginUserData?.last_name,
        telephone: loginUserData?.mobile,
        dob: loginUserData?.dob,
        email_id: loginUserData?.email_id,
        location: loginUserData?.geo_location,
        country_code: loginUserData?.country_code,
        country_id: loginUserData?.country_id,
      });
    }
  }, [loginUserData]);

  /**
   * Determines the SEO type based on the presence of a display_user_id.
   * If display_user_id is present, it returns the SEO for claiming an account.
   * If display_user_id is not present, it returns the SEO for verifying an account.
   * @returns {string} - The SEO type.
   */
  const getSeoType = () => {
    if (display_user_id) {
      return ClaimorVerifySEO(
        loginUserData.first_name
          ? decodeHtml(loginUserData.first_name)
          : "Claim Account",
        "Claim"
      );
    } else {
      return ClaimorVerifySEO(
        loginUserData.first_name
          ? decodeHtml(loginUserData.first_name)
          : "Claim Account",
        "Verify"
      );
    }
  };

  return (
    <div className={`mainWrapper ${classes.profilePage}`}>
      <ProfileLayout Addfriend={true} profileData={loginUserData}>
        <Seo
          title={getSeoType().title}
          description={getSeoType().description}
        />
        <div className={`mt-4  ${classes.claimAccountSec}`}>
          <div className={`${classes.claimAccountBox}`}>
            <h2>
              {display_user_id
                ? "Confirm Profile Data"
                : "Submit Details For Verification"}
            </h2>
            <Row>
              <Col md={6}>
                <div className="my-2">
                  <p className={classes.label}>
                    First Name <span className="text-danger">*</span>{" "}
                  </p>
                  <Input
                    className={`${classes.textBox} `}
                    maxLength={25}
                    autoComplete="off"
                    value={values.first_name}
                    onChange={handleChange("first_name")}
                    placeholder="Enter your first name"
                    disabled={isAccountVerified !== "unverified"}
                  />
                </div>
                {touched.first_name && (
                  <p className="ErrTxt">{errors?.first_name}</p>
                )}
              </Col>
              <Col md={6}>
                <div className="my-2">
                  <p className={classes.label}>
                    Last Name <span className="text-danger">*</span>{" "}
                  </p>
                  <Input
                    className={`${classes.textBox} `}
                    maxLength={25}
                    autoComplete="off"
                    value={values.last_name}
                    onChange={handleChange("last_name")}
                    placeholder="Enter your last name"
                    disabled={isAccountVerified !== "unverified"}
                  />
                </div>
                {touched.last_name && (
                  <p className="ErrTxt">{errors?.last_name}</p>
                )}
              </Col>
              <Col md={6}>
                <div className="my-2">
                  <p className={classes.label}>
                    Mobile Number <span className="text-danger">*</span>{" "}
                  </p>
                  <div className="mobileInput">
                    <CountryCodeDropdown
                      width="25%"
                      marginTop={5}
                      status={
                        touched.telephone && errors.telephone ? "error" : ""
                      }
                      isDisabled={IsValidCredentials.mobile}
                      value={values.country_code}
                      onSelectItem={(val) => {
                        setValues((pre) => ({
                          ...pre,
                          country_code: val.label,
                          country_id: val.key,
                        }));
                      }}
                    />
                    <Input
                      className={`${classes.textBox} `}
                      maxLength={20}
                      style={{
                        marginLeft: 10,
                      }}
                      autoComplete="off"
                      value={values.telephone}
                      onChange={handleChange("telephone")}
                      placeholder="Enter your mobile number"
                      disabled={IsValidCredentials.mobile}
                    />
                  </div>
                </div>
                {touched.telephone && (
                  <p className="ErrTxt">{errors?.telephone}</p>
                )}
              </Col>
              <Col md={6}>
                <div className="my-2">
                  <p className={classes.label}>
                    Email Id <span className="text-danger">*</span>{" "}
                  </p>
                  <Input
                    className={`${classes.textBox}`}
                    maxLength={25}
                    autoComplete="off"
                    value={values.email_id}
                    onChange={handleChange("email_id")}
                    placeholder="Enter your email id"
                    disabled={IsValidCredentials.email}
                  />
                </div>
                {touched.email_id && (
                  <p className="ErrTxt">{errors?.email_id}</p>
                )}
              </Col>
              <Col md={6}>
                <div className="my-2">
                  <p className={classes.label}>
                    Date of Birth <span className="text-danger">*</span>{" "}
                  </p>
                  <DateInputBox
                    isDisabled={isAccountVerified !== "unverified"}
                    displayDate={values.dob}
                    isError={errors.dob && touched.dob}
                    onSelectDate={(date) => {
                      if (date !== "") {
                        setFieldValue("dob", moment(date).format("YYYY-MM-DD"));
                      } else {
                        setFieldValue("dob", "");
                      }
                    }}
                  />
                </div>
                {touched.dob && <p className="ErrTxt">{errors?.dob}</p>}
              </Col>
              <Col md={6}>
                <div className="my-2">
                  <p className={classes.label}>
                    Location <span className="text-danger">*</span>{" "}
                  </p>
                  <Form.Item name="location">
                    <PlacesAutocomplete
                      value={values.location}
                      onChange={handleChange("location")}
                      onSelect={(val) => {
                        setFieldValue("location", val);
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
                                display:
                                  suggestions.length > 0 ? "block" : "none",
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
                  </Form.Item>
                  {touched.location && (
                    <p className="ErrTxt">{errors?.location}</p>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <div className="w-100 text-center">
            <Button
              className={classes.btnstyle}
              onClickCapture={() => {
                handleSubmit();
              }}
            >
              {"Submit"}
            </Button>
          </div>
        </div>
      </ProfileLayout>
    </div>
  );
};

export default Claimaccount;
