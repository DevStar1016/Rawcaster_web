import React, { useEffect } from "react";
import classes from "../Modal.module.css";
import { Button, Form, Input, Modal, Tooltip } from "antd";
import { Col, Row } from "react-bootstrap";
import DateInputBox from "../../Sharedcomponents/DateInputBox";
import { useFormik } from "formik";
import PlacesAutocomplete from "react-places-autocomplete";
import { toast } from "react-hot-toast";
import { JSONtoformdata, getGeocodeData } from "../../Shared/Utility";
import styles from "./ClaimAccount.module.css";
import moment from "moment";
import { useAuthData } from "../../Shared/Reduxfetcher";
import { AddClaimAccountService } from "../../Services/ApiService";
import * as yup from "yup";

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

const ClaimAccount = ({ visible, onSuccess, onClose, id }) => {
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
      influencer_id: parseInt(id),
      token: loginUserData?.token,
    };
    AddClaimAccountService(JSONtoformdata(finalData))
      .then((res) => {
        if (res.data.status === 1) {
          onSuccess();
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
      })
      .finally(() => {
        onClose();
      });
  };

  const getCurrentLocation = () => {
    getGeocodeData()
      .then((res) => {
        setFieldValue("location", res.address);
      })
      .catch((err) => {});
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
    <Modal
      centered
      footer={null}
      open={visible}
      height={600}
      width={650}
      onCancel={() => {
        onClose();
      }}
    >
      <div className={classes.nuggetModal}>
        <h1>Claim Account</h1>
        <div className="mt-4">
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
              {touched.email_id && <p className="ErrTxt">{errors?.email_id}</p>}
            </Col>
            <Col sm={12} xs={24}>
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
            <Col sm={12} xs={24}>
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
                        className={`${styles.textBox} ${styles.locationInputHeight}`}
                        maxLength={100}
                        {...getInputProps({
                          placeholder: "Search Places ...",
                          className: "location-search-input",
                        })}
                      />
                      <div className={styles.locationdrpmenu}>
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
                  className={styles.locationIcon}
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
              {touched.location && <p className="ErrTxt">{errors?.location}</p>}
            </Col>
          </Row>
          <Button
            className={classes.btnstyle}
            onClickCapture={() => {
              handleSubmit();
            }}
          >
            {"Claim Account"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimAccount;
