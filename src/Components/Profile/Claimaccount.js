import React, { useEffect } from "react";
import classes from "./Profile.module.css";
import {
  DecryptionString,
  JSONtoformdata,
  getGeocodeData,
} from "../../Shared/Utility";
import { useNavigate, useParams } from "react-router";
import ProfileLayout from "./ProfileLayout";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as yup from "yup";
import { AddClaimAccountService } from "../../Services/ApiService";
import { Col, Row } from "react-bootstrap";
import DateInputBox from "../../Sharedcomponents/DateInputBox";
import moment from "moment";
import PlacesAutocomplete from "react-places-autocomplete";

const validationSchema = yup.object().shape({
  first_name: yup.string().required(`Please input your First Name!`),
  last_name: yup.string().required(`Please input your Last Name!`),
  telephone: yup
    .string()
    .min(5, "Telephone must be atleast 5 characters")
    .required(`Please input your Telephone!`),
  dob: yup.string().required(`Please input your Date of Birth!`),
  email_id: yup.string().required(`Please input your Email id!`),
  location: yup.string().required(`Please input your Location!`),
});

const Claimaccount = () => {
  const navigate = useNavigate();
  const params = useParams();
  const display_user_id = DecryptionString(params.user_id);
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
      email_id: "",
      location: "",
    },
    validationSchema,
    onSubmit: (val) => {
      HandleClaimAccount(val);
    },
  });

  const HandleClaimAccount = (value) => {
    let finalData = {
      ...value,
      influencer_id: parseInt(display_user_id),
      token: loginUserData?.token,
    };
    AddClaimAccountService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          navigate(-1);
          Modal.success({
            content: res.data.msg,
          });
        } else if (res.data.status === 0) {
          Modal.error({
            content: res.data.msg,
          });
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const getCurrentLocation = () => {
    getGeocodeData()
      .then((res) => {
        setFieldValue("location", res.address);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (loginUserData) {
      setValues({
        first_name: loginUserData?.first_name,
        last_name: loginUserData?.last_name,
        telephone: loginUserData?.mobile,
        dob: loginUserData?.dob,
        email_id: loginUserData?.email_id,
        location: loginUserData?.geo_location,
      });
    }
  }, [loginUserData]);

  return (
    <div className={`mainWrapper ${classes.profilePage}`}>
      <ProfileLayout profileData={loginUserData}>
        <div className={`mt-4  ${classes.claimAccountSec}`}>
          <div className={`${classes.claimAccountBox}`}>
            <h2>Confirm Profile Data</h2>
            <Row>
              <Col sm={6}>
                <div className="my-2">
                  <p className={classes.label}>First Name </p>
                  <Input
                    className={`${classes.textBox} `}
                    maxLength={25}
                    autoComplete="off"
                    value={values.first_name}
                    onChange={handleChange("first_name")}
                  />
                </div>
                {touched.first_name && (
                  <p className="ErrTxt">{errors?.first_name}</p>
                )}
              </Col>
              <Col sm={6}>
                <div className="my-2">
                  <p className={classes.label}>Last Name </p>
                  <Input
                    className={`${classes.textBox} `}
                    maxLength={25}
                    autoComplete="off"
                    value={values.last_name}
                    onChange={handleChange("last_name")}
                  />
                </div>
                {touched.last_name && (
                  <p className="ErrTxt">{errors?.last_name}</p>
                )}
              </Col>
              <Col sm={6}>
                <div className="my-2">
                  <p className={classes.label}>Telephone </p>
                  <Input
                    className={`${classes.textBox} `}
                    maxLength={20}
                    autoComplete="off"
                    value={values.telephone}
                    onChange={handleChange("telephone")}
                  />
                </div>
                {touched.telephone && (
                  <p className="ErrTxt">{errors?.telephone}</p>
                )}
              </Col>
              <Col sm={6}>
                <div className="my-2">
                  <p className={classes.label}>Email id </p>
                  <Input
                    className={`${classes.textBox}`}
                    maxLength={25}
                    autoComplete="off"
                    value={values.email_id}
                    onChange={handleChange("email_id")}
                  />
                </div>
                {touched.email_id && (
                  <p className="ErrTxt">{errors?.email_id}</p>
                )}
              </Col>
              <Col sm={6}>
                <div className="my-2">
                  <p className={classes.label}>Date of Birth </p>
                  <DateInputBox
                    displayDate={values.dob}
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
              <Col sm={6}>
                <div className="my-2">
                  <p className={classes.label}>Location</p>
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
          <Button
            className={classes.btnstyle}
            onClickCapture={() => {
              handleSubmit();
            }}
          >
            {"Submit"}
          </Button>
        </div>
      </ProfileLayout>
    </div>
  );
};

export default Claimaccount;
